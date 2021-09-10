import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const USERNAME = 'username';
const EMAIL = 'email';
const FULLNAME = 'fullname';
const PHONE = 'phone';
const ADDRESS = 'address';
const CITY = 'city';
const POSTCODE = 'postcode';
export const getProfile = async () => {
  const response = await Promise.all([
    Storage.get({ key: USERNAME }),
    Storage.get({ key: EMAIL }),
    Storage.get({ key: FULLNAME }),
    Storage.get({ key: PHONE }),
    Storage.get({ key: ADDRESS }),
    Storage.get({ key: CITY }),
    Storage.get({ key: POSTCODE }),
  ]);
  const username = await response[0].value || undefined;
  const email = await response[1].value || undefined;
  const fullname = await response[2].value || undefined;
  const phone = await response[3].value || undefined;
  const address = await response[4].value || undefined;
  const city = await response[5].value || undefined;
  const postcode = await response[6].value || undefined;

  const data = {
    username,
    email,
    fullname,
    phone,
    address,
    city,
    postcode,
  }
  return data;
}

export const setUsernameProfileData = async (username?: string) => {
  if (!username) {
    await Storage.remove({ key: USERNAME });
  } else {
    await Storage.set({ key: USERNAME, value :username });
  }
}
export const setEmailProfileData = async (email?: string) => {
  if (!email) {
    await Storage.remove({ key: EMAIL });
  } else {
    await Storage.set({ key: EMAIL, value :email });
  }
}
export const setFullnameProfileData = async (fullname?: string) => {
  if (!fullname) {
    await Storage.remove({ key: FULLNAME });
  } else {
    await Storage.set({ key: FULLNAME, value :fullname });
  }
}
export const setPhoneProfileData = async (phone?: string) => {
  if (!phone) {
    await Storage.remove({ key: PHONE });
  } else {
    await Storage.set({ key: PHONE, value :phone });
  }
}
export const setAddressProfileData = async (address?: string) => {
  if (!address) {
    await Storage.remove({ key: ADDRESS });
  } else {
    await Storage.set({ key: ADDRESS, value :address });
  }
}
export const setCityProfileData = async (city?: string) => {
  if (!city) {
    await Storage.remove({ key: CITY });
  } else {
    await Storage.set({ key: CITY, value :city });
  }
}
export const setPostcodeProfileData = async (postcode?: string) => {
  if (!postcode) {
    await Storage.remove({ key: POSTCODE });
  } else {
    await Storage.set({ key: POSTCODE, value :postcode });
  }
}
