// script to get and upload book covers in the db
//format: https://covers.openlibrary.org/b/$key/$value-$size.jpg
//key:ISBN, Value: bookISBN, size: L
async function updateImageUrls() {
    try {
      // Establish a connection to the Oracle database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Query the existing books with ISBN-13
      const result = await connection.execute('SELECT isbn13 FROM book');
      const isbns = result.rows.map((row) => row[0]);
  
      // Iterate through the ISBN-13 values and update image URLs
      for (const isbn13 of isbns) {
        // Create the Open Library Covers API URL
        const apiUrl = `https://covers.openlibrary.org/b/ISBN/${isbn13}-L.jpg`;
  
        // Update the image_url column with the API URL
        await connection.execute(
          'UPDATE book SET image_url = :image_url WHERE isbn13 = :isbn13',
          {
            isbn13,
            image_url: apiUrl,
          }
        );
  
        console.log(`Updated image URL for ISBN-13: ${isbn13}`);
      }
  
      // Commit the transaction and close the connection
      await connection.commit();
      await connection.close();
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  // Call the function to update image URLs
  updateImageUrls();