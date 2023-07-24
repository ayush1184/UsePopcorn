import { useState, useEffect } from 'react';

const API_KEY = `c937e4d0`;
// const JONAS_API_KEY = `f84fc31d`;

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      //   setSelectedID?.(null);

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

      //   setSelectedID(null);
      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, error, isLoading };
}
