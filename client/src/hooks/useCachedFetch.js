import { useState, useEffect, useCallback } from 'react';

/**
 * useCachedFetch
 * Returns cached data instantly, then syncs with the server in background.
 * @param {Function} fetchFn  - async function that fetches fresh data
 * @param {Function} getCacheFn - function that returns cached data from localStorage
 * @param {Array} deps - dependency array to re-trigger fetch
 */
const useCachedFetch = (fetchFn, getCacheFn, deps = []) => {
  const [data, setData] = useState(() => getCacheFn());
  const [isLoading, setIsLoading] = useState(!getCacheFn());
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const fresh = await fetchFn();
      setData(fresh);
      setIsLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to sync');
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [fetchFn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refresh();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, isSyncing, error, refresh };
};

export default useCachedFetch;
