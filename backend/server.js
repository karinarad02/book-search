const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the content type and status code
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;

  // Respond with a simple message
  res.end('Hello, Node.js Server!');
});

// Specify the port to listen on
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const oracledb = require('oracledb');

// Define your Oracle Database connection configuration
const dbConfig = {
    user: 'C##KARINA',
    password: 'karina',
    connectString: 'localhost:1521/xe',
};

// Function to fetch books from the Oracle Database
async function getBooksFromDatabase() {
  let connection;

  try {
    // Establish a connection to the Oracle Database
    connection = await oracledb.getConnection(dbConfig);

    // Define your SQL query to fetch book information from the "book" table
    const sqlQuery = 'SELECT title, isbn13, num_pages, publication_date FROM book';

    // Execute the query
    const result = await connection.execute(sqlQuery);

    // Convert the result to an array of books
    const books = result.rows.map((row) => ({
      title: row[0],
      isbn13: row[1],
      num_pages: row[2],
      publication_date: row[3],
    }));

    // Do something with the retrieved books
    console.log('Retrieved Books:', books);

    // You can return the 'books' array to use it in your application
    return books;
  } catch (error) {
    console.error('Error fetching data from Oracle Database:', error);
    throw error; // Propagate the error for handling in the calling code
  } finally {
    // Close the database connection
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

// Call the function to fetch books from the database
getBooksFromDatabase()
  .then((books) => {
    // Here, you can process or display the 'books' array as needed
    console.log('Processing Books:', books);
  })
  .catch((error) => {
    // Handle any errors that occurred during the database operation
    console.error('Error in main function:', error);
  });
