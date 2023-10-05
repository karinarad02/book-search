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
    const sqlQuery = 'SELECT title, num_pages, publication_date,image_url,overview FROM book';

    // Execute the query
    const result = await connection.execute(sqlQuery);

    // Convert the result to an array of books
    const books = result.rows.map((row) => ({
      title: row[0],
      isbn13: row[1],
      num_pages: row[2],
      publication_date: row[3],
      image_url: row[4],
      overview: row[5],
    }));

    // Send the books as a JSON response
    res.json(books);

  } catch (error) {
    console.error('Error fetching data from Oracle Database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a new route for searching books by title or author
app.get('/api/search', async (req, res) => {
  try {
    // Extract the search query from the URL parameters
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Missing search query' });
    }

    // Establish a connection to the Oracle Database
    const connection = await oracledb.getConnection(dbConfig);

    // Define your SQL query to search for books by title or author
    const sqlQuery = `
      SELECT title, num_pages, publication_date, image_url, overview
      FROM book
      WHERE title LIKE :searchQuery
    `;

    // Execute the query with the search query as a parameter
    const result = await connection.execute(sqlQuery, {
      searchQuery: `%${query}%`, // Add wildcards for partial matching
    });

    // Convert the result to an array of books
    const books = result.rows.map((row) => ({
      title: row[0],
      num_pages: row[1],
      publication_date: row[2],
      image_url: row[3],
      overview: row[4],
    }));

    // Send the search results as a JSON response
    res.json(books);

  } catch (error) {
    console.error('Error searching for books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
