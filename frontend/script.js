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
        const { title, num_pages, publication_date,image_url,rating,overview } = book
        const bookEl = document.createElement('div')
        bookEl.classList.add('book')

        bookEl.innerHTML = `
            <img src="${image_url?image_url:"./bookImgReplacement.jpeg"}" alt="${title?title:"Book Title"}">
            <span class="readtype">${getTextByPages(num_pages)}</span>
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

function getTextByPages(num) {
    if(num >= 400) {
        return 'advanced read'
    } else if(num >= 100) {
        return 'medium read'
    } else {
        return 'light read'
    }
}

// Define the search API endpoint to match your server route
const SEARCH_API = 'http://localhost:3000/api/search?query='; // Update the port and path as needed

function getBooks(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.length !== 0) { // Data is an array of books
        showBooks(data); // Update the function to handle the array of books
      } else {
        main.innerHTML = `<h1>No results for this search</h1>`;
      }
    });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== '') {
    getBooks(SEARCH_API + searchTerm);

    search.value = '';
  } else {
    window.location.reload();
  }
});