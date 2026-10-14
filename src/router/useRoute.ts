import { useEffect, useState } from 'react';
import { parseHash, type Route } from './router';

/** Subscribes to `hashchange` and returns the current parsed route. */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/diagnose');
    }
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
