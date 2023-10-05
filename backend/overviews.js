//goodreads overviews

const oracledb = require('oracledb');
const dbConfig = {
    user: 'C##KARINA',
    password: 'karina',
    connectString: 'localhost:1521/xe',
};
const puppeteer = require('puppeteer');

async function fetchDataFromGoodreads(isbn13) {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
  
      const apiUrl = `http://www.goodreads.com/book/isbn/${isbn13}`;
      await page.goto(apiUrl);
  
      const bookOverview = await page.evaluate(() => {
        const overviewElement = document.querySelector('.Formatted');
        return overviewElement ? overviewElement.textContent.trim() : null;
      });
  
      await browser.close();
  
      if (bookOverview !== null) {
        return bookOverview;
      }
  
      throw new Error('Book overview is not available.');
    } catch (error) {
      throw error;
    }
  }
  
  async function updateOverviews() {
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('SELECT isbn13 FROM book');
      const isbns = result.rows.map((row) => row[0]);
  
      for (const isbn13 of isbns) {
        try {
          const bookOverview = await fetchDataFromGoodreads(isbn13);
          await connection.execute(
            'UPDATE book SET overview = :overview WHERE isbn13 = :isbn13',
            {
              isbn13,
              overview: bookOverview,
            }
          );
  
          console.log(`Updated overview for ISBN-13: ${isbn13}`);
        } catch (error) {
          console.error(`Error fetching or updating overview for ISBN-13: ${isbn13}`, error.message);
        }
      }
  
      await connection.commit();
      await connection.close();
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  updateOverviews();

