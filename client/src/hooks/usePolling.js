import { useEffect, useRef } from 'react';

/**
 * usePolling
 * Calls the provided callback at the given interval.
 * Automatically pauses when the tab is hidden (saves resources).
 * @param {Function} callback - function to call on each poll
 * @param {number} intervalMs - polling interval in milliseconds (default 30s)
 * @param {boolean} enabled   - whether polling is active
 */
const usePolling = (callback, intervalMs = 30000, enabled = true) => {
  const savedCallback = useRef(callback);

  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (!document.hidden) savedCallback.current();
    };

    const id = setInterval(tick, intervalMs);

    // Pause/resume with tab visibility
    const onVisibilityChange = () => {
      if (!document.hidden) savedCallback.current(); // Sync immediately when tab becomes visible
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [intervalMs, enabled]);
};

export default usePolling;
