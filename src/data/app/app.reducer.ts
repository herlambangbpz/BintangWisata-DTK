import { AppActions } from './app.actions';
import { AppState } from './app.state';

export const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case 'set-conf-data': {
      return { ...state, ...action.data };
    }
  }
}
