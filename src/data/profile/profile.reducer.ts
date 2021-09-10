import { ProfileActions } from './profile.actions';
import { ProfileState } from './profile.state';

export function profileReducer(state: ProfileState, action: ProfileActions): ProfileState {
  switch (action.type) {
    case 'set-profile-data':
      return { ...state, ...action.data };
    case 'set-username':
      return { ...state, username: action.username };
    case 'set-email':
      return { ...state, email: action.email };
    case 'set-fullname':
      return { ...state, fullname: action.fullname };
    case 'set-phone':
      return { ...state, phone: action.phone };
    case 'set-address':
      return { ...state, address: action.address };
    case 'set-city':
      return { ...state, city: action.city };
    case 'set-postcode':
      return { ...state, postcode: action.postcode };

  }
}
