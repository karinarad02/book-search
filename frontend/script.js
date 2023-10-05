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
        const { title, isbn13, num_pages, publication_date,image_url,rating,overview } = book
        const bookEl = document.createElement('div')
        bookEl.classList.add('book')

        bookEl.innerHTML = `
            <img src="${image_url?image_url:"./bookImgReplacement.jpeg"}" alt="${title?title:"Book Title"}">
            <div class="book-info">
          <h3>${title?title:"Book Title"}</h3>
          <span class="${getClassByRate(rating)}">${rating?rating:'No Ratings'}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          ${overview?overview:'Read it to find out'}
        </div>
        `
        main.appendChild(bookEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 4) {
        return 'green'
    } else if(vote >= 2.5) {
        return 'orange'
    } else {
        return 'red'
    }
}

// Define the search API endpoint
const SEARCH_API = 'https://localhost:5500/search?query='

function getBooks(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data.results.length !== 0) {
            showBooks(data.results)
        } else {
            main.innerHTML = `<h1>No results for this search</h1>`
        }
    })
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