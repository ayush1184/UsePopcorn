import { useEffect, useState, useRef } from 'react';
import { FadeLoader } from 'react-spinners';
import StarRating from './StarRating.js';
import { useMovies } from './useMovies.js';
import { useLocalStorageState } from './useLocalStorageState.js';

const API_KEY = `c937e4d0`;

export default function App() {
  const [query, setQuery] = useState(``);
  const [selectedID, setSelectedID] = useState(null);

  // Custom Hooks
  const [watched, setWatched] = useLocalStorageState([], `watched`);
  const { movies, error, isLoading } = useMovies(query);

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() => {
  //   const storedWatch = JSON.parse(localStorage.getItem('watched'));
  //   return storedWatch;
  // });

  // const [watched, setWatched] = useState(() =>
  //   JSON.parse(localStorage.getItem(`watched`))
  // );

  function handleAddWatched(movie) {
    setWatched(watched => {
      const result = watched.some(mov => mov.imdbID === movie.imdbID)
        ? watched
        : [...watched, movie];

      // localStorage.setItem(`watched`, JSON.stringify(result));

      return result;
    });
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(mov => mov.imdbID !== id));
  }

  // useEffect(
  //   function () {
  //     localStorage.setItem(`watched`, JSON.stringify(watched));
  //   },
  //   [watched]
  // );

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
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  useEffect(function () {
    function command(e) {
      if (e.key === `/`) {
        e.preventDefault();
        inputEl.current.focus();
      }
    }

    document.addEventListener(`keydown`, command);
  }, []);

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={inputEl}
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

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const {
    imdbRating,
    Type: type,
    Plot: plot,
    Genre: genre,
    Title: title,
    Actors: actors,
    Poster: poster,
    Runtime: runtime,
    Director: director,
    Released: released,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      poster,
      runtime,
      imdbRating: Number(imdbRating),
      title,
      userRating,
      countRatingDecision: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    setSelectedID(null);
  }

  /* eslint-disable */
  // if (imdbRating > 8) [test, setTest] = useState(true);
  // if (imdbRating > 8) return <p>Test</p>;

  // const [isTop, setIsTop] = useState(imdbRating > 0);
  // useEffect(
  //   function () {
  //     setIsTop(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );

  // const isTop = imdbRating > 8;
  // console.log(isTop);

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
