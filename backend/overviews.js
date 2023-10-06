//goodreads overviews

const oracledb = require('oracledb');
const dbConfig = {
    user: 'C##KARINA',
    password: 'karina',
    connectString: 'localhost:1521/xe',
};
const puppeteer = require('puppeteer');

async function closeSignInModalIfPresent(page) {
  // Selector for the sign-in modal
  const modalSelector = '.Overlay__window';

  const modal = await page.$(modalSelector);
  if (modal) {
    console.log('Sign-in modal found. Closing...');
    await page.evaluate(() => {
      // Close the modal or perform an action to bypass it
      // You may need to inspect the modal's HTML and find the appropriate close button or action
      // For demonstration purposes, we'll just click a hypothetical close button with class 'close-button'
      const closeButton = document.querySelector('.Button');
      if (closeButton) {
        closeButton.click();
      }
    });
    console.log('Sign-in modal closed.');
  }
}

async function fetchDataFromGoodreads(isbn13) {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();

      await closeSignInModalIfPresent(page);
  
      const apiUrl = `http://www.goodreads.com/book/isbn/${isbn13}`;
      await page.goto(apiUrl);
  
      const bookOverview = await page.evaluate(() => {
        const overviewElement = document.querySelector('.BookPageMetadataSection__description span.Formatted');
        console.log(overviewElement);
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
  
          console.log(`Updated overview for ISBN-13: ${isbn13} with ${bookOverview}`);
          await connection.commit();
        } catch (error) {
          console.error(`Error fetching or updating overview for ISBN-13: ${isbn13}`, error.message);
        }

        if(isbn13 == '9790007672386'){
          console.log('done');
            break;
        }
      }
  
      await connection.commit();
      await connection.close();
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  updateOverviews();

