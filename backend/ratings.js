//goodreads average rating


const puppeteer = require('puppeteer');

async function fetchDataFromGoodreads(isbn13) {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
  
      const apiUrl = `http://www.goodreads.com/book/isbn/${isbn13}`;
      await page.goto(apiUrl);
  
      const averageRating = await page.evaluate(() => {
        const averageRatingElement = document.querySelector('.RatingStatistics__rating');
        return averageRatingElement ? averageRatingElement.textContent.trim() : null;
      });
  
      await browser.close();
  
      if (averageRating !== null) {
        const parsedRating = parseFloat(averageRating);
        if (!isNaN(parsedRating)) {
          return parsedRating;
        }
      }
  
      throw new Error('Average rating is not available or not valid.');
    } catch (error) {
      throw error;
    }
  }
  
  async function updateRatings() {
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('SELECT isbn13 FROM book');
      const isbns = result.rows.map((row) => row[0]);
  
      for (const isbn13 of isbns) {
        try {
          const averageRating = await fetchDataFromGoodreads(isbn13);
          await connection.execute(
            'UPDATE book SET rating = :rating WHERE isbn13 = :isbn13',
            {
              isbn13,
              rating: averageRating,
            }
          );
  
          console.log(`Updated rating for ISBN-13: ${isbn13} - Average Rating: ${averageRating}`);
        } catch (error) {
          console.error(`Error fetching or updating rating for ISBN-13: ${isbn13}`, error.message);
        }
      }
  
      await connection.commit();
      await connection.close();
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  updateRatings();


