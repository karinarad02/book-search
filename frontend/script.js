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
        const { title, isbn13, num_pages, publication_date,image_url,rating } = book
        const overview= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
        const bookEl = document.createElement('div')
        bookEl.classList.add('book')

        bookEl.innerHTML = `
            <img src="${image_url}" alt="${title}">
            <div class="book-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(rating)}">${rating}</span>
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
    if(vote >= 4) {
        return 'green'
    } else if(vote >= 2.5) {
        return 'orange'
    } else {
        return 'red'
    }
}

// Define the search API endpoint
// const SEARCH_API = 'https://localhost/search?query=';

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