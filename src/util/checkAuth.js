import { isLoaded } from './loadingObject';
import store from '../store';
import config from '../config/';

/*
 * Check authentication, and navigate to /login if not authenticated
 * To be used with router onEnter
 */
export function checkAuth (nextState, replace) {
  const state = store.getState();
  if (isLoaded(state.auth))
    return;

  replace({
    pathname: `${config.publicUrl}/login`,
    query: {...nextState.location.query, next: nextState.location.pathname}
  })
}
