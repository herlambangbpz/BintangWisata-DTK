import {
  setUsernameProfileData,
  setEmailProfileData,
  setFullnameProfileData,
  setPhoneProfileData,
  setAddressProfileData,
  setCityProfileData,
  setPostcodeProfileData,
  getProfile,
} from "../profileApi";
import { ActionType } from "../../util/types";
import { ProfileState } from "./profile.state";
import { resolve } from "dns";

export const setAllProfile =
  (ProfileData: any) => async (dispatch: React.Dispatch<any>) => {
    setUsernameProfileData(ProfileData.userName);
    setEmailProfileData(ProfileData.email);
    setFullnameProfileData(ProfileData.memberFullName);
    setPhoneProfileData(ProfileData.phone);
    setAddressProfileData(ProfileData.memberAddress);
    setCityProfileData(ProfileData.memberAddressCity);
    setPostcodeProfileData(ProfileData.memberAddressPostalCode);
  };
export const loadProfile = () => async (dispatch: React.Dispatch<any>) => {
  const data = await getProfile();
  dispatch(setData(data));
};
export const setData = (data: Partial<ProfileState>) =>
  ({
    type: "set-profile-data",
    data,
  } as const);
export const setUsername =
  (username?: string) => async (dispatch: React.Dispatch<any>) => {
    await setUsernameProfileData(username);
    return {
      type: "set-username",
      username,
    } as const;
  };
export const setEmail =
  (email?: string) => async (dispatch: React.Dispatch<any>) => {
    await setEmailProfileData(email);
    return {
      type: "set-email",
      email,
    } as const;
  };
export const setFullname =
  (fullname?: string) => async (dispatch: React.Dispatch<any>) => {
    await setFullnameProfileData(fullname);
    return {
      type: "set-fullname",
      fullname,
    } as const;
  };
export const setPhone =
  (phone?: string) => async (dispatch: React.Dispatch<any>) => {
    await setPhone(phone);
    return {
      type: "set-phone",
      phone,
    } as const;
  };
export const setAddress =
  (address?: string) => async (dispatch: React.Dispatch<any>) => {
    await setAddressProfileData(address);
    return {
      type: "set-address",
      address,
    } as const;
  };
export const setCity =
  (city?: string) => async (dispatch: React.Dispatch<any>) => {
    await setCityProfileData(city);
    return {
      type: "set-city",
      city,
    } as const;
  };
export const setPostcode =
  (postcode?: string) => async (dispatch: React.Dispatch<any>) => {
    await setPostcodeProfileData(postcode);
    return {
      type: "set-postcode",
      postcode,
    } as const;
  };
export type ProfileActions =
  | ActionType<typeof setUsername>
  | ActionType<typeof setEmail>
  | ActionType<typeof setFullname>
  | ActionType<typeof setPhone>
  | ActionType<typeof setAddress>
  | ActionType<typeof setCity>
  | ActionType<typeof setPostcode>
  | ActionType<typeof setData>;
