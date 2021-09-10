export interface UserState {
  isLoggedin: boolean;
  darkMode: boolean;
  hasSeenTutorial: boolean;
  loading: boolean;
  username?: string;
  email?: string;
  accessToken?: string;
  requestVerificationToken?: string;
  memberId?: string;
  name?: string;
  balance?:string;
  photo?:string;
};
