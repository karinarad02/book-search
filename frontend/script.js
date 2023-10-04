const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const oracledb = require('oracledb');
const { oracledbConfig } = require('./dbConfig'); // Replace with your database connection details

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// Define your Oracle Database connection configuration
const dbConfig = {
  user: 'C##KARINA',
  password: 'karina',
  connectString: 'localhost:1521/orclpdb',
};

// Get initial books from the Oracle Database
getBooksFromDatabase();

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

    // Display the books
    //showBooks(books);
  } catch (error) {
    console.error(error);
  } finally {
    // Close the database connection
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
}

function showBooks(books) {
    main.innerHTML = ''

    books.forEach((book) => {
        const { title, poster_path, vote_average, overview } = book

        const bookEl = document.createElement('div')
        bookEl.classList.add('movie')

        bookEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
        `
        main.appendChild(bookEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value

    if(searchTerm && searchTerm !== '') {
        getBooks(SEARCH_API + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }
})