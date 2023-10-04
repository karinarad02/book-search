const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // This enables CORS for all routes

// Define your Oracle Database connection configuration
const dbConfig = {
    user: 'C##KARINA',
    password: 'karina',
    connectString: 'localhost:1521/xe',
};

// Define a route to fetch books from the Oracle Database
app.get('/api/books', async (req, res) => {
  try {
    // Establish a connection to the Oracle Database
    const connection = await oracledb.getConnection(dbConfig);

    // Define your SQL query to fetch book information from the "book" table
    const sqlQuery = 'SELECT title, isbn13, num_pages, publication_date,image_url FROM book';

    // Execute the query
    const result = await connection.execute(sqlQuery);

    // Convert the result to an array of books
    const books = result.rows.map((row) => ({
      title: row[0],
      isbn13: row[1],
      num_pages: row[2],
      publication_date: row[3],
      image_url: row[4],
    }));

    // Send the books as a JSON response
    res.json(books);
    console.log(books[0].image_url)
  } catch (error) {
    console.error('Error fetching data from Oracle Database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


///////////////////////////////////////////////////////


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



////////////////////////////////////////////////////////////


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
