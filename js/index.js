const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const searchResult = document.getElementById("search-result");
let watchList = JSON.parse(localStorage.getItem("watchlist")) || [];
let movieResults = [];

document.addEventListener("click", (e) => {
  console.log(e.target.id);
  if (e.target.id === "search-btn") {
    search();
  } else if (e.target.dataset.watchlist) {
    addToWatchlist(e.target.dataset.watchlist);
  } else if (e.target.dataset.remove) {
    removeFromWatchlist(e.target.dataset.remove);
    renderWatchlist();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const watchlistResult = document.getElementById("watchlist-result");
  if (watchlistResult) {
    renderWatchlist();
  }
});

async function search() {
  const inputVal = searchInput.value.replace(" ", "+");
  movieResults = await fetchMovies(inputVal);
  console.log(movieResults);
  let html = "";

  if (movieResults.length) {
    for (let movie of movieResults) {
      html += `
        <div class="content">
          <img src="${movie.Poster}" alt="${movie.Title}" />
          <div>
            <div class="content-title">
              <h3>${movie.Title}</h3>
              <p>⭐️ ${movie.imdbRating}</p>
            </div>
            <div class="content-info">
              <p>${movie.Runtime}</p>
              <p>${movie.Genre}</p>
              <p data-watchlist=${movie.imdbID}>➕ Watchlist</p>
            </div>
            <p class="content-desc">
              ${movie.Plot}
            </p>
          </div>
        </div>
            `;
    }
  }

  searchResult.innerHTML = html;
}

function addToWatchlist(id) {
  const movieObj = movieResults.find((result) => result.imdbID === id);
  watchList.find((movie) => movie.imdbID === id)
    ? ""
    : watchList.push(movieObj);
  localStorage.setItem("watchlist", JSON.stringify(watchList));
}

function renderWatchlist() {
  const watchlistResult = document.getElementById("watchlist-result");
  watchList = JSON.parse(localStorage.getItem("watchlist"));
  if (watchList.length) {
    let html = "";
    for (let movie of watchList) {
      html += `
        <div class="content">
          <img src="${movie.Poster}" alt="${movie.Title}" />
          <div>
            <div class="content-title">
              <h3>${movie.Title}</h3>
              <p>⭐️ ${movie.imdbRating}</p>
            </div>
            <div class="content-info">
              <p>${movie.Runtime}</p>
              <p>${movie.Genre}</p>
              <p data-remove=${movie.imdbID}>➖ Remove</p>
            </div>
            <p class="content-desc">
              ${movie.Plot}
            </p>
          </div>
        </div>
            `;
    }
    watchlistResult.innerHTML = html;
  } else {
    watchlistResult.innerHTML = "";
  }
}

function removeFromWatchlist(id) {
  watchList = watchList.filter((result) => result.imdbID !== id);
  localStorage.setItem("watchlist", JSON.stringify(watchList));
}

async function fetchMovies(searchInput) {
  let movies = [];
  const response = await fetch(
    `http://www.omdbapi.com/?s=${searchInput}&apikey='YOUR API KEY'`,
  );
  const data = await response.json();
  console.log(data);
  if (data.Search) {
    for (let movie of data.Search) {
      const movieResponse = await fetch(
        `http://www.omdbapi.com/?i=${movie.imdbID}&apikey='YOUR API KEY'`,
      );
      const movieData = await movieResponse.json();
      movies.push(movieData);
    }

    return movies;
  }
  return "";
}
