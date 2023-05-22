// Get a reference to the container element where the navbar will be placed
const API_KEY = "451c6cbe138ebd54a2bb4af297ef9c43";
const container = document.querySelector("#container");
let hideTimeout;

// Create the navbar element
const navbar = document.createElement("nav");
navbar.className = "bg-gray-800";
navbar.innerHTML = `
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex justify-between h-16">
<div class="flex items-center">
<a href="/index.html" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
<div class="relative inline-block text-left">
<button id="movies-dropdown" type="button" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Movies
            </button>
            <div id="movies-dropdown-menu" class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="movies-menu">
            <!-- Add more genres here -->
            </div>
            </div>
            </div>
            <a id='actor-list' class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Actor List</a>
            <a id="about" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
            </div>
            <div class="flex items-center">
      <input id="search-input" type="text" class="rounded-md px-3 py-2" placeholder="Search...">
      <select class="rounded-md px-3 py-2 ml-2">
      <option value="popular">Popular</option>
      <option value="release-date">Release Date</option>
      <option value="top-rated">Top Rated</option>
      <option value="now-playing">Now Playing</option>
        <option value="upcoming">Upcoming</option>
        </select>
        </div>
    </div>
  </div>
  `;

// Append the navbar to the container element
document.body.prepend(navbar);

// Handle Search

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keyup", (event) => {
  const query = searchInput.value.trim();
  performSearch(query);

  if (searchInput.value === "") {
    renderPopularMovies();
  }
});

const performSearch = async (query) => {
  container.innerHTML = ""; // Clear the existing content

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
    );
    const data = await response.json();
    console.log(data);

    const movies = data.results;
    console.log("Search results:", movies);

    movies.forEach((movie) => {
      const movieCardContainer = document.createElement("div");
      const movieCard = document.createElement("div");
      const movieImg = document.createElement("img");
      const movieTitle = document.createElement("h2");
      const movieOverview = document.createElement("p");
      const movieReleaseDate = document.createElement("p");
      const movieVoteAverage = document.createElement("p");
      const movieGenres = document.createElement("p");

      movieCardContainer.className =
        "flex flex-col items-center p-3 w-1/4 h-156";
      movieCard.className = "bg-white shadow-lg rounded-lg overflow-hidden";
      movieImg.className = "w-full";
      movieTitle.className = "text-xl font-bold mt-2";
      movieOverview.className = "text-gray-700 text-base mt-2";
      movieReleaseDate.className = "text-gray-500 text-sm mt-2";
      movieVoteAverage.className = "text-yellow-500 text-lg mt-2";
      movieGenres.className = "text-gray-500 text-sm mt-2";

      movieImg.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      movieTitle.textContent = movie.title;
      movieOverview.textContent = movie.overview;
      movieReleaseDate.textContent = movie.release_date;
      movieVoteAverage.textContent = movie.vote_average;
      movieGenres.textContent = movie.genre_ids;
      movieCard.append(
        movieImg,
        movieTitle,
        movieOverview,
        movieReleaseDate,
        movieVoteAverage,
        movieGenres
      );

      movieImg.addEventListener("click", () => {
        // console.log(movie.id);
        handleMovieClick(movie.id);
      });
      movieTitle.addEventListener("click", () => {
        // console.log(movie.id);
        handleMovieClick(movie.id);
      });

      movieCardContainer.append(movieCard);

      container.append(movieCardContainer);
    });
  } catch (error) {
    console.error("Error performing search:", error);
  }
};

// Fetch movie genres and populate the dropdown menu
const fetchMovieGenres = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    const data = await response.json();
    const dropdownMenu = document.getElementById("movies-dropdown-menu");

    // Generate dropdown options based on the received genres
    data.genres.forEach((genre) => {
      const genreLink = document.createElement("a");
      genreLink.href = "#";
      genreLink.className =
        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900";
      genreLink.innerText = genre.name;

      // Add event listener to handle genre selection
      genreLink.addEventListener("click", () => {
        loadMoviesByGenre(genre.id);
      });

      // Append genre option to the dropdown
      dropdownMenu.appendChild(genreLink);
    });
  } catch (error) {
    console.error("Error fetching movie genres:", error);
  }
};

// Show genre list when hovering over "Movies" button or the dropdown menu
const moviesDropdown = document.getElementById("movies-dropdown");
const moviesDropdownMenu = document.getElementById("movies-dropdown-menu");

moviesDropdown.addEventListener("mouseenter", () => {
  clearTimeout(hideTimeout);
  showGenreList();
});

moviesDropdownMenu.addEventListener("mouseenter", () => {
  clearTimeout(hideTimeout);
  showGenreList();
});

// Hide genre list when mouse leaves the dropdown
moviesDropdown.addEventListener("mouseleave", () => {
  hideTimeout = setTimeout(hideGenreList, 200);
});

moviesDropdownMenu.addEventListener("mouseleave", () => {
  hideTimeout = setTimeout(hideGenreList, 200);
});

// Function to show genre list
function showGenreList() {
  moviesDropdownMenu.classList.remove("hidden");
}

// Function to hide genre list
function hideGenreList() {
  moviesDropdownMenu.classList.add("hidden");
}

// Call the function to fetch and render movie genres

const loadMoviesByGenre = async (genreId) => {
  container.innerHTML = "";
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    const data = await response.json();
    console.log(data);

    // Process the fetched movies data
    const movies = data.results;
    console.log("Movies by genre:", movies);
    // Add your logic to render or display the movies
    movies.forEach((movie) => {
      // genre_ids,id,overview,poster_path,release_date,title,vote_average
      const movieCardContainer = document.createElement("div");
      const movieCard = document.createElement("div");
      const movieImg = document.createElement("img");
      const movieTitle = document.createElement("h2");
      const movieOverview = document.createElement("p");
      const movieReleaseDate = document.createElement("p");
      const movieVoteAverage = document.createElement("p");
      const movieGenres = document.createElement("p");

      movieCardContainer.className =
        "flex flex-col items-center p-3 w-1/4 h-156";
      movieCard.className = "bg-white shadow-lg rounded-lg overflow-hidden";
      movieImg.className = "w-full";
      movieTitle.className = "text-xl font-bold mt-2";
      movieOverview.className = "text-gray-700 text-base mt-2";
      movieReleaseDate.className = "text-gray-500 text-sm mt-2";
      movieVoteAverage.className = "text-yellow-500 text-lg mt-2";
      movieGenres.className = "text-gray-500 text-sm mt-2";

      movieImg.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      movieTitle.textContent = movie.title;
      movieOverview.textContent = movie.overview;
      movieReleaseDate.textContent = movie.release_date;
      movieVoteAverage.textContent = movie.vote_average;
      movieGenres.textContent = movie.genre_ids;
      movieCard.append(
        movieImg,
        movieTitle,
        movieOverview,
        movieReleaseDate,
        movieVoteAverage,
        movieGenres
      );
      movieCardContainer.append(movieCard);

      container.append(movieCardContainer);

      // add event listener to the movie card
      movieImg.addEventListener("click", () => {
        // console.log(movie.id);
        handleMovieClick(movie.id);
      });
      movieTitle.addEventListener("click", () => {
        // console.log(movie.id);
        handleMovieClick(movie.id);
      });
    });
  } catch (error) {
    console.error("Error loading movies by genre:", error);
  }
};

//authorization object

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NTFjNmNiZTEzOGViZDU0YTJiYjRhZjI5N2VmOWM0MyIsInN1YiI6IjY0NjY0MTg5YzM1MTRjMDBlNWRjMTU0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ECX5gEaxxOk3_4yEKdkvb6MiaNa5U4j2dN3M5s7Klvk",
  },
};

const renderPopularMovies = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    );
    const data = await response.json();
    // console.log(data.results);
    data.results.forEach((movie) => {
      // genre_ids,id,overview,poster_path,release_date,title,vote_average
      const movieCardContainer = document.createElement("div");
      const movieCard = document.createElement("div");
      const movieImg = document.createElement("img");
      const movieTitle = document.createElement("h2");
      const movieOverview = document.createElement("p");
      const movieReleaseDate = document.createElement("p");
      const movieVoteAverage = document.createElement("p");
      const movieGenres = document.createElement("p");

      movieCardContainer.className =
        "flex flex-col items-center p-3 w-1/4 h-156";
      movieCard.className = "bg-white shadow-lg rounded-lg overflow-hidden";
      movieImg.className = "w-full";
      movieTitle.className = "text-xl font-bold mt-2";
      movieOverview.className = "text-gray-700 text-base mt-2";
      movieReleaseDate.className = "text-gray-500 text-sm mt-2";
      movieVoteAverage.className = "text-yellow-500 text-lg mt-2";
      movieGenres.className = "text-gray-500 text-sm mt-2";

      movieImg.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      movieTitle.textContent = movie.title;
      movieOverview.textContent = movie.overview;
      movieReleaseDate.textContent = movie.release_date;
      movieVoteAverage.textContent = movie.vote_average;
      movieGenres.textContent = movie.genre_ids;
      movieCard.append(
        movieImg,
        movieTitle,
        movieOverview,
        movieReleaseDate,
        movieVoteAverage,
        movieGenres
      );

      movieImg.addEventListener("click", () => {
        // console.log(movie.id);
        handleMovieClick(movie.id);
      });
      movieTitle.addEventListener("click", () => {
        // console.log(movie.id);
        handleMovieClick(movie.id);
      });

      movieCardContainer.append(movieCard);
      container.append(movieCardContainer);

      // add event listener to the movie card
    });
    // const homePageTitle = document.createElement("h1");
    // homePageTitle.textContent = "Popular Movies";
    // container.prepend(homePageTitle);
  } catch {
    (error) => console.error(error);
  }
};

const handleMovieClick = async (movieId) => {
  container.innerHTML = "";

  try {
    // Fetch the movie details using the movieId
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    const movie = await response.json();
    // console.log(movie);

    // Display the movie information
    const movieCardContainer = document.createElement("div");
    const movieCard = document.createElement("div");
    const movieImg = document.createElement("img");
    const movieTitle = document.createElement("h2");
    const movieOverview = document.createElement("p");
    const movieReleaseDate = document.createElement("p");
    const movieVoteAverage = document.createElement("p");
    const movieGenres = document.createElement("p");

    movieCardContainer.className = "flex items-center p-3 w-1/4 h-156";
    movieCard.className = "bg-white shadow-lg rounded-lg overflow-hidden";
    movieImg.className = "w-full";
    movieTitle.className = "text-xl font-bold mt-2";
    movieOverview.className = "text-gray-700 text-base mt-2";
    movieReleaseDate.className = "text-gray-500 text-sm mt-2";
    movieVoteAverage.className = "text-yellow-500 text-lg mt-2";
    movieGenres.className = "text-gray-500 text-sm mt-2";

    movieImg.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    movieTitle.textContent = movie.title;
    movieOverview.textContent = movie.overview;
    movieReleaseDate.textContent = movie.release_date;
    movieVoteAverage.textContent = movie.vote_average;
    movieGenres.textContent = movie.genre_ids;
    movieCard.append(
      movieImg,
      movieTitle,
      movieOverview,
      movieReleaseDate,
      movieVoteAverage,
      movieGenres
    );

    container.append(movieCard);

    // Fetch the cast information for the movie
    const castResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    const castData = await castResponse.json();
    // console.log(castData);

    // Display the actors
    const actorsContainer = document.createElement("div");
    const actorsTitle = document.createElement("h3");
    actorsTitle.textContent = "Actors";
    actorsContainer.appendChild(actorsTitle);

    castData.cast.slice(0, 8).forEach((actor) => {
      const actorCard = document.createElement("div");
      const actorName = document.createElement("p");
      const actorImage = document.createElement("img");

      actorCard.className =
        "flex flex-col bg-white shadow-lg rounded-lg items-center overflow-hidden";
      actorName.className = "text-gray-700 text-base mt-2";
      actorImage.className = "w-20 h-20 rounded-full";
      actorsContainer.className =
        "flex flex-wrap space-x-3  justify-between p-3 ";

      actorName.textContent = actor.name;
      actorImage.src = `https://image.tmdb.org/t/p/w500/${actor.profile_path}`;
      actorCard.append(actorImage, actorName);
      actorsContainer.append(actorCard);

      actorCard.addEventListener("click", () => {
        handleActorClick(actor.id);
      });
    });

    container.append(actorsContainer);
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};

const handleActorClick = async (actorId) => {
  container.innerHTML = "";

  try {
    // Fetch the actor details using the actorId
    const actorResponse = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}`
    );
    const actor = await actorResponse.json();

    // Fetch the movies the actor took part in
    const moviesResponse = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}`
    );
    const moviesData = await moviesResponse.json();
    const movies = moviesData.cast;

    // Create the container for the actor details
    const actorContainer = document.createElement("div");
    actorContainer.className = "flex items-center p-3";

    // Create the actor image element
    const actorImg = document.createElement("img");
    actorImg.className = "w-48";
    actorImg.src = `https://image.tmdb.org/t/p/w500/${actor.profile_path}`;

    // Create the container for the actor information
    const actorInfoContainer = document.createElement("div");
    actorInfoContainer.className = "ml-4";

    // Create elements for the actor information
    const actorName = document.createElement("h2");
    actorName.className = "text-xl font-bold";
    actorName.textContent = actor.name;

    const actorBio = document.createElement("p");
    actorBio.className = "text-gray-700 text-base";
    actorBio.textContent = actor.biography;

    const actorBirthday = document.createElement("p");
    actorBirthday.className = "text-gray-500 text-sm";
    actorBirthday.textContent = `Birthday: ${actor.birthday}`;

    const actorPlaceOfBirth = document.createElement("p");
    actorPlaceOfBirth.className = "text-gray-500 text-sm";
    actorPlaceOfBirth.textContent = `Place of Birth: ${actor.place_of_birth}`;

    // Append the actor information elements to the actor info container
    actorInfoContainer.append(
      actorName,
      actorBio,
      actorBirthday,
      actorPlaceOfBirth
    );

    // Append the actor image and info container to the main actor container
    actorContainer.append(actorImg, actorInfoContainer);

    // Create a container for the movies
    const moviesContainer = document.createElement("div");
    moviesContainer.className = "mt-4";

    // Create a heading for the movies section
    const moviesHeading = document.createElement("h3");
    moviesHeading.className = "text-lg font-bold";
    moviesHeading.textContent = "Movies";

    // Create a container for the movie list
    const movieList = document.createElement("ul");
    movieList.className = "list-disc ml-8";

    console.log(movies);

    // Create list items for each movie
    for (const movie of movies) {
      const movieItem = document.createElement("li");
      movieItem.textContent = movie.title;
      movieList.appendChild(movieItem);
      movieItem.addEventListener("click", () => {
        handleMovieClick(movie.id);
      });
    }

    // Append the movies heading and movie list to the movies container
    moviesContainer.append(moviesHeading, movieList);

    // Append the actor container and movies container to the main container
    container.append(actorContainer, moviesContainer);
  } catch (error) {
    console.error("Error fetching actor details:", error);
  }
};

async function fetchPopularActors() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch popular actors");
    }
    const data = await response.json();

    console.log(data.results);
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

// Usage
async function getPopularActors() {
  container.innerHTML = "";
  try {
    const popularActors = await fetchPopularActors();
    console.log(popularActors);
    // Process the popular actors data
    // Display or manipulate the data as needed
    popularActors.forEach((actor) => {
      const actorCardContainer = document.createElement("div");
      const actorCard = document.createElement("div");
      const actorImg = document.createElement("img");
      const actorName = document.createElement("h2");

      actorCardContainer.className =
        "flex flex-col items-center p-3 w-1/4 h-156";
      actorCard.className = "bg-white shadow-lg rounded-lg overflow-hidden";
      actorImg.className = "w-full";
      actorName.className = "text-xl font-bold mt-2";

      actorImg.src = `https://image.tmdb.org/t/p/w500/${actor.profile_path}`;
      actorName.textContent = actor.name;

      actorCard.append(actorImg, actorName);

      actorImg.addEventListener("click", () => {
        // console.log(movie.id);
        handleActorClick(actor.id);
      });
      actorName.addEventListener("click", () => {
        // console.log(movie.id);
        handleActorClick(actor.id);
      });

      actorCardContainer.append(actorCard);

      container.append(actorCardContainer);
    });
  } catch (error) {
    console.error(error);
  }
}

const actorList = document.getElementById("actor-list");
actorList.addEventListener("click", () => getPopularActors());

renderPopularMovies();
fetchMovieGenres();
