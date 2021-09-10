import { getUserPrimaryData,getUserSecondaryData,setIsLoggedInData, setUsernameData, setHasSeenTutorialData, setAccessTokenData, setRequestVerificationTokenData, setMemberIdData, setNameData, setBalanceData, setEmailData, setPhotoData, getAccountInfo } from '../dataApi';import { ActionType } from '../../util/types';
import { UserState } from './user.state';
import { CustomRedirect } from '../services';
// import { resolve } from 'dns';

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const primaryData = await getUserPrimaryData();
  const secondaryData = await getUserSecondaryData();
  dispatch(setData(primaryData));
  dispatch(setData(secondaryData));
  dispatch(setLoading(false));
}
export const setAccountInfo = () => async (dispatch: React.Dispatch<any>) => {
  const AccountInfoData = await getAccountInfo();
  setBalanceData(AccountInfoData.balance);
  setEmailData(AccountInfoData.email);
  setMemberIdData(AccountInfoData.memberId);
  setNameData(AccountInfoData.name);
  setPhotoData(AccountInfoData.photo);
  const secondaryData = await getUserSecondaryData();
  dispatch(setData(secondaryData));
}
export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  await setIsLoggedInData(false);
  await setUsernameData(undefined);
  await setEmailData(undefined);
  await setAccessTokenData(undefined);
  await setRequestVerificationTokenData(undefined);
  await setMemberIdData(undefined);
  await setNameData(undefined);
  await setBalanceData(undefined);
  await setPhotoData(undefined);
  await setHasSeenTutorialData(true);
  CustomRedirect();
};

export const setIsLoggedIn = (loggedIn: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setIsLoggedInData(loggedIn);
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const)
};

export const setUsername = (username?: string) => async (dispatch: React.Dispatch<any>) => {
  await setUsernameData(username);
  return ({
    type: 'set-username',
    username
  } as const);
};

export const setEmail = (email?: string) => async (dispatch: React.Dispatch<any>) => {
  await setEmailData(email);
  return ({
    type: 'set-email',
    email
  } as const);
};

export const setAccessToken = (accessToken?: string) => async (dispatch: React.Dispatch<any>) => {
  await setAccessTokenData(accessToken);
  return ({
    type: 'set-access-token',
    accessToken
  } as const);
};

export const setRequestVerificationToken = (requestVerificationToken?: string) => async (dispatch: React.Dispatch<any>) => {
  await setRequestVerificationTokenData(requestVerificationToken);
  return ({
    type: 'set-request-verification-token',
    requestVerificationToken
  } as const);
};

export const setMemberId = (memberId?: string) => async (dispatch: React.Dispatch<any>) => {
  await setMemberIdData(memberId);
  return ({
    type: 'set-member-id',
    memberId
  } as const);
};

export const setName = (name?: string) => async (dispatch: React.Dispatch<any>) => {
  await setNameData(name);
  return ({
    type: 'set-name',
    name
  } as const);
};

export const setBalance = (balance?: string) => async (dispatch: React.Dispatch<any>) => {
  await setBalanceData(balance);
  return ({
    type: 'set-balance',
    balance
  } as const);
};
export const setPhoto = (photo?: any) => async (dispatch: React.Dispatch<any>) => {
  await setPhotoData(photo);
  return ({
    type: 'set-photo',
    photo
  } as const);
};

export const setHasSeenTutorial = (hasSeenTutorial: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setHasSeenTutorialData(hasSeenTutorial);
  return ({
    type: 'set-has-seen-tutorial',
    hasSeenTutorial
  } as const);
}

export const setDarkMode = (darkMode: boolean) => ({
  type: 'set-dark-mode',
  darkMode
} as const);


export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setUsername>
  | ActionType<typeof setEmail>
  | ActionType<typeof setAccessToken>
  | ActionType<typeof setRequestVerificationToken>
  | ActionType<typeof setMemberId>
  | ActionType<typeof setName>
  | ActionType<typeof setBalance>
  | ActionType<typeof setPhoto>
  | ActionType<typeof setHasSeenTutorial>
  | ActionType<typeof setDarkMode>
