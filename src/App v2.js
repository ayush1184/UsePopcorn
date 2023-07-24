import { useEffect, useState } from 'react';
import { FadeLoader } from 'react-spinners';
import StarRating from './StarRating.js';

const API_KEY = `c937e4d0`;
// const JONAS_API_KEY = `f84fc31d`;

export default function App() {
  // const [movies, setMovies] = useState(tempMovieData);
  // const [watched, setWatched] = useState(tempWatchedData);
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(``);
  const [query, setQuery] = useState(``);
  const [selectedID, setSelectedID] = useState(null);
  // const [ratedMovies, setRatedMovies] = useState([]);
  // const tempQuery = `interstellar`;

  function handleAddWatched(movie) {
    setWatched(watched => {
      return watched.some(mov => mov.imdbID === movie.imdbID)
        ? watched
        : [...watched, movie];
    });
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(mov => mov.imdbID !== id));
  }

  /*
  
  useEffect Experiment

  useEffect(function () {
    console.log(`A`);
  }, []);

  useEffect(function () {
    console.log(`B`);
  });

  useEffect(() => console.log(`D`), [query]);

  console.log(`C`);
*/

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovie() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `https://omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(`Something went wrong with movie fetching...`);

          // const res = await fetch(
          // `https://omdbapi.com/?apikey=${API_KEY}&s=interstellar`
          // );
          const data = await res.json();

          if (data.Response === `False`)
            throw new Error(data.Error.slice(0, -1));

          setMovies(data.Search);
          setError(``);
        } catch (err) {
          if (err.name !== `AbortError`) setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError(``);
        return;
      }

      setSelectedID(null);
      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {error ? (
            <ErrorMessage message={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <MoviesList movies={movies} setSelectedID={setSelectedID} />
          )}
          {/* /* Alternative to above line of code. */}
          {/* {isLoading && <Loader />}
          {!isLoading && !error && <MoviesList movies={movies} />}
          {error && <ErrorMessage />} */}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              key={selectedID}
              onAddWatched={handleAddWatched}
              selectedID={selectedID}
              setSelectedID={setSelectedID}
              watched={watched}
              setWatched={setWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div>
      <FadeLoader
        cssOverride={{
          margin: `40% auto`,
        }}
        color='#a3b6e9'
      />
    </div>
  );
}

function ErrorMessage({ message }) {
  return <div className='error'>⛔️ {message} ⛔️</div>;
}

const average = arr =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
      {/* Found <strong>X</strong> results */}
    </p>
  );
}

function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen(open => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

// function ListBox({ children }) {
//   return <Box>{children}</Box>;
// }

function MoviesList({ movies, setSelectedID }) {
  return (
    <ul className='list list-movies'>
      {movies?.map(movie => (
        <Movie movie={movie} key={movie.imdbID} setSelectedID={setSelectedID} />
      ))}
    </ul>
  );
}

function Movie({ movie, setSelectedID }) {
  return (
    <li
      onClick={() =>
        setSelectedID(id => (id === movie.imdbID ? null : movie.imdbID))
      }
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title.split(` `).slice(0, 1)} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ watched, onAddWatched, selectedID, setSelectedID }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const isRated = watched.some(mov => mov.imdbID === selectedID);

  const {
    Released: released,
    Director: director,
    Runtime: runtime,
    Poster: poster,
    Actors: actors,
    Genre: genre,
    Title: title,
    Plot: plot,
    Type: type,
    imdbRating,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      poster,
      runtime,
      imdbRating,
      title,
      userRating,
    };
    onAddWatched(newWatchedMovie);
    setSelectedID(null);
  }

  // Movie details data fetching
  useEffect(
    function () {
      async function getMoviesDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://omdbapi.com/?apikey=${API_KEY}&i=${selectedID}`
          );
          const data = await res.json();

          setMovie(data);
          // console.log(data);
        } catch (err) {
          console.error(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMoviesDetails();
    },
    [selectedID]
  );

  // Title change Functionality
  useEffect(
    function () {
      if (!title) return;
      document.title = `${
        type?.at(0).toUpperCase() + type?.slice(1)
      } | ${title}`;

      // return () => (document.title = `usePopcorn`);
      return function () {
        document.title = `usePopcorn`;
        console.log(`Clean-Up Effect for the ${type} : ${title}`);
      };
    },
    [type, title]
  );

  // adding and removing eventhandler
  useEffect(
    function () {
      function escClose(e) {
        if (e.code === `Escape`) {
          setSelectedID(null);
          // console.log(`closing`);
        }
      }
      document.addEventListener(`keydown`, escClose);

      return function () {
        document.removeEventListener(`keydown`, escClose);
      };
    },
    [setSelectedID]
  );

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className='details'>
        <header>
          <img src={poster} alt={`Poster of the ${title} movie`} />
          <div className='details-overview'>
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p>
              <span>⭐️</span>
              {imdbRating} IMDB rating
            </p>
          </div>
        </header>

        <section>
          <div className='rating'>
            {isRated ? (
              <>
                <StarRating
                  size={24}
                  onSetRating={setUserRating}
                  defaultRating={
                    watched.find(mov => mov.imdbID === selectedID)?.userRating
                  }
                />

                {watched.find(mov => mov.imdbID === selectedID)?.userRating !==
                  userRating && userRating > 0 ? (
                  <button className='btn-add' onClick={handleAdd}>
                    Update to List
                  </button>
                ) : (
                  ``
                )}
              </>
            ) : (
              <>
                <StarRating size={24} onSetRating={setUserRating} />
                {userRating && (
                  <button className='btn-add' onClick={handleAdd}>
                    Add to List
                  </button>
                )}
              </>
            )}
          </div>
          <em>{plot}</em>
          <p>Starring {actors} actors</p>
          <p>{director === `N/A` ? null : `Directed by ${director}`}</p>
        </section>
        <button className='btn-back' onClick={() => setSelectedID(null)}>
          {/* ⬅ */}&larr;
        </button>
      </div>
    </>
  );
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <Box>
//       <>
//         <WatchedSummary watched={watched} />
//         <WatchedMoviesList watched={watched} />
//       </>
//     </Box>
//   );
// }

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(
    watched.map(movie =>
      Number.isFinite(Number.parseInt(movie.runtime))
        ? Number.parseInt(movie.runtime)
        : 45
    )
  );

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {avgRuntime % 1 === 0
              ? avgRuntime.toFixed(0)
              : avgRuntime.toFixed(1)}
            min
          </span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className='list list-movies'>
      {watched.map(movie => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <>
      <li>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} </span>
          </p>
        </div>
        <button
          className='btn-delete'
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          &times;
        </button>
      </li>
    </>
  );
}
