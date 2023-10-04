const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const DATABASE_URL = 'http://localhost:3000/api/books';
// Get initial books from the Oracle Database

async function getBooksFromDatabase() {
  try {
    const response = await fetch(DATABASE_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const books = await response.json();
    // Call a function to display the books in your frontend
    showBooks(books);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}
getBooksFromDatabase();

function showBooks(books) {
    main.innerHTML = ''

    books.forEach((book) => {
        const { title, poster_path, vote_average, overview } = book

        const bookEl = document.createElement('div')
        bookEl.classList.add('book')

        bookEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="book-info">
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