import { NewsModel } from "../models/News";
import { MainUrl, AppId } from "../AppConfig";
import { TourProductListModel } from "../models/TourProdctList";
// import '@capacitor-community/http';
import { Plugins } from "@capacitor/core";
import "@capacitor-community/http";
import { HTTP } from "@ionic-native/http";
import { isPlatform } from "@ionic/react";
import { EcommerceProductListModel } from "../models/EcommerceProdctList";
const { Storage } = Plugins;

const dataUrl = "/assets/data/data.json";
const dateNow = new Date();
const newsUrl =
  "https://newsapi.org/v2/everything?q=holiday&from=" +
  dateNow.getFullYear() +
  "-" +
  (dateNow.getMonth() + 1).toString() +
  "-" +
  dateNow.getDate() +
  "&sortBy=publishedAt&apiKey=0da0c39e30b34b23b7655049be60fc14";
const HAS_LOGGED_IN = "isLoggedin";
const HAS_SEEN_TUTORIAL = "hasSeenTutorial";
const USERNAME = "username";
const EMAIL = "email";
const ACCESSTOKEN = "accessToken";
const REQUEST_VERIFICATION_TOKEN = "requestVerificationToken";
const MEMBER_ID = "memberId";
const NAME = "name";
const BALANCE = "balance";
const PHOTO = "photo";

export const getNews = async () => {
  const response = await fetch(newsUrl).then((res) => res.json());
  const news = response.articles.slice(0, 5) as NewsModel[];
  const data = {
    news,
  };
  return data;
};
export const getNewTourProductList = async () => {
  if (isPlatform("cordova")) {
    HTTP.setDataSerializer("json");
    const response = await HTTP.post(
      MainUrl + "tour/search",
      {},
      { appid: AppId }
    )
      .then((data) => JSON.parse(data.data))
      .catch((error) => alert(JSON.stringify(error)));
    const newTourProductList =
      Number(response.StatusCode) === 200
        ? (response.Data.TourProductSearchList.slice(
            0,
            6
          ) as TourProductListModel[])
        : [];
    const data = {
      newTourProductList,
    };
    return data;
  } else {
    const response = await fetch(MainUrl + "tour/search", {
      method: "POST",
    }).then((res) => res.json());
    const newTourProductList =
      Number(response.StatusCode) === 200
        ? (response.Data.TourProductSearchList.slice(
            0,
            6
          ) as TourProductListModel[])
        : [];
    const data = {
      newTourProductList,
    };
    return data;
  }
};

export const getNewEcommerceProductList = async () => {
  if (isPlatform("cordova")) {
    HTTP.setDataSerializer("json");
    const response = await HTTP.post(
      MainUrl + "ecommerce/allproduct",
      {},
      { appid: AppId }
    )
      .then((data) => JSON.parse(data.data))
      .catch((error) => alert(JSON.stringify(error)));
    const newEcommerceProductList =
      Number(response.StatusCode) === 200
        ? (response.Data.ProductList.slice(0, 6) as EcommerceProductListModel[])
        : [];
    const data = {
      newEcommerceProductList,
    };
    return data;
  } else {
    const response = await fetch(MainUrl + "ecommerce/allproduct", {
      method: "GET",
      headers: {
        appid: AppId,
      },
    }).then((res) => res.json());
    const newEcommerceProductList =
      Number(response.StatusCode) === 200
        ? (response.Data.ProductList.slice(0, 6) as EcommerceProductListModel[])
        : [];
    const data = {
      newEcommerceProductList,
    };
    // console.log(data);

    return data;
  }
};

export const getUserPrimaryData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: HAS_SEEN_TUTORIAL }),
    Storage.get({ key: ACCESSTOKEN }),
    Storage.get({ key: REQUEST_VERIFICATION_TOKEN }),
  ]);
  const isLoggedin = (await response[0].value) === "true";
  const hasSeenTutorial = (await response[1].value) === "true";
  const accessToken = (await response[2].value) || undefined;
  const requestVerificationToken = (await response[3].value) || undefined;
  const data = {
    isLoggedin,
    hasSeenTutorial,
    accessToken,
    requestVerificationToken,
  };
  return data;
};
export const getUserSecondaryData = async () => {
  const response = await Promise.all([
    Storage.get({ key: USERNAME }),
    Storage.get({ key: EMAIL }),
    Storage.get({ key: MEMBER_ID }),
    Storage.get({ key: NAME }),
    Storage.get({ key: BALANCE }),
    Storage.get({ key: PHOTO }),
  ]);
  const username = (await response[0].value) || undefined;
  const email = (await response[1].value) || undefined;
  const memberId = (await response[2].value) || undefined;
  const name = (await response[3].value) || undefined;
  const balance = (await response[4].value) || undefined;
  const photo = (await response[5].value) || undefined;

  const data = {
    username,
    email,
    memberId,
    name,
    balance,
    photo,
  };

  return data;
};
export const getAccountInfo = async () => {
  const Credentials = await Promise.all([
    Storage.get({ key: REQUEST_VERIFICATION_TOKEN }),
    Storage.get({ key: ACCESSTOKEN }),
  ]);
  const requestVerificationToken = (await Credentials[0].value) || "";
  const accessToken = (await Credentials[1].value) || "";
  const accountInfoHeader = {
    RequestVerificationToken: requestVerificationToken,
    AppId: AppId,
  };
  // Check Member Data
  const accountInfoFormData = new FormData();
  accountInfoFormData.append("AccToken", accessToken);
  if (isPlatform("cordova")) {
    HTTP.setDataSerializer("multipart");
    const response = await HTTP.post(
      MainUrl + "member/accountinfo",
      accountInfoFormData,
      accountInfoHeader
    )
      // Check Connection
      .then((res) => {
        return JSON.parse(res.data);
      })
      .then((res) => res.json());
    const email = response.Email || "";
    const memberId = response.MemberID || "";
    const name = response.Name || "";
    const balance = response.Saldo || "";
    const photo = response.photo || "";
    const data = {
      email,
      memberId,
      name,
      balance,
      photo,
    };
    return data;
  } else {
    const response = await fetch(MainUrl + "member/accountinfo", {
      method: "POST",
      body: accountInfoFormData,
      // headers: {'appid':AppId,'RequestVerificationToken': RequestVerificationToken}
      headers: accountInfoHeader,
    }).then((res) => res.json());
    const email = response.Email || "";
    const memberId = response.MemberID || "";
    const name = response.Name || "";
    const balance = response.Saldo || "";
    const photo = response.photo || "";
    const data = {
      email,
      memberId,
      name,
      balance,
      photo,
    };
    return data;
  }
};
export const setIsLoggedInData = async (isLoggedIn: boolean) => {
  await Storage.set({ key: HAS_LOGGED_IN, value: JSON.stringify(isLoggedIn) });
};

export const setHasSeenTutorialData = async (hasSeenTutorial: boolean) => {
  await Storage.set({
    key: HAS_SEEN_TUTORIAL,
    value: JSON.stringify(hasSeenTutorial),
  });
};

export const setUsernameData = async (username?: string) => {
  if (!username) {
    await Storage.remove({ key: USERNAME });
  } else {
    await Storage.set({ key: USERNAME, value: username });
  }
};

export const setEmailData = async (email?: string) => {
  if (!email) {
    await Storage.remove({ key: EMAIL });
  } else {
    await Storage.set({ key: EMAIL, value: email });
  }
};
export const setAccessTokenData = async (accessToken?: string) => {
  if (!accessToken) {
    await Storage.remove({ key: ACCESSTOKEN });
  } else {
    await Storage.set({ key: ACCESSTOKEN, value: accessToken });
  }
};
export const setRequestVerificationTokenData = async (
  requestVerificationToken?: string
) => {
  if (!requestVerificationToken) {
    await Storage.remove({ key: REQUEST_VERIFICATION_TOKEN });
  } else {
    await Storage.set({
      key: REQUEST_VERIFICATION_TOKEN,
      value: requestVerificationToken,
    });
  }
};
export const setMemberIdData = async (memberId?: string) => {
  if (!memberId) {
    await Storage.remove({ key: MEMBER_ID });
  } else {
    await Storage.set({ key: MEMBER_ID, value: memberId });
  }
};
export const setNameData = async (name?: string) => {
  if (!name) {
    await Storage.remove({ key: NAME });
  } else {
    await Storage.set({ key: NAME, value: name });
  }
};
export const setBalanceData = async (balance?: string) => {
  if (!balance) {
    await Storage.remove({ key: BALANCE });
  } else {
    await Storage.set({ key: BALANCE, value: balance });
  }
};

export const setPhotoData = async (photo?: any) => {
  if (!photo) {
    await Storage.remove({ key: PHOTO });
  } else {
    await Storage.set({ key: PHOTO, value: photo });
  }
};
