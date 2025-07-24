import { useEffect } from 'react';

function ScrollRestoration() {
  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}

export default ScrollRestoration;