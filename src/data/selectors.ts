import { createSelector } from "reselect";
import { AppState } from "./state";
export const getNews = (state: AppState) => state.data.news;
export const getNewTourProductList = (state: AppState) =>
  state.data.newTourProductList;
export const getNewEcommerceProductList = (state: AppState) =>
  state.data.newEcommerceProductList;
export const getUserName = (state: AppState) => state.user.name;
export const getUserEmail = (state: AppState) => state.user.email;
export const getUserPhoto = (state: AppState) => state.user.photo;
export const getAccessToken = (state: AppState) => state.user.accessToken;
export const getRequestVerificationToken = (state: AppState) =>
  state.user.requestVerificationToken;
export const getBalance = (state: AppState) => state.user.balance;

export const getAirlineBookingOrigin = (state: AppState) =>
  state.airline.AirlineBookingOrigin;
export const getAirlineBookingOriginDetail = (state: AppState) =>
  state.airline.AirlineBookingOriginDetail;
export const getAirlineBookingDestination = (state: AppState) =>
  state.airline.AirlineBookingDestination;
export const getAirlineBookingDestinationDetail = (state: AppState) =>
  state.airline.AirlineBookingDestinationDetail;
export const getAirlineBookingDepartureDate = (state: AppState) =>
  state.airline.AirlineBookingDepartureDate;
export const getAirlineBookingArrivalDate = (state: AppState) =>
  state.airline.AirlineBookingArrivalDate;
export const getAirlineBookingTripType = (state: AppState) =>
  state.airline.AirlineBookingTripType;
export const getAirlineBookingNumberOfAdult = (state: AppState) =>
  state.airline.AirlineBookingNumberOfAdult;
export const getAirlineBookingNumberOfChild = (state: AppState) =>
  state.airline.AirlineBookingNumberOfChild;
export const getAirlineBookingNumberOfInfant = (state: AppState) =>
  state.airline.AirlineBookingNumberOfInfant;
export const getAirlineBookingNumberOfPaxTotal = (state: AppState) =>
  state.airline.AirlineBookingNumberOfPaxTotal;
export const getUserData = createSelector(
  getUserName,
  getUserEmail,
  getUserPhoto,
  getAccessToken,
  getRequestVerificationToken,
  getBalance,
  (name, email, photo, accessToken, requestVerificationToken, balance) => {
    return {
      name: name,
      email: email,
      photo: photo,
      accessToken: accessToken,
      requestVerificationToken: requestVerificationToken,
      balance: balance,
    };
  }
);
export const getAirlineBooking = createSelector(
  getAirlineBookingOrigin,
  getAirlineBookingOriginDetail,
  getAirlineBookingDestination,
  getAirlineBookingDestinationDetail,
  getAirlineBookingDepartureDate,
  getAirlineBookingArrivalDate,
  getAirlineBookingTripType,
  getAirlineBookingNumberOfAdult,
  getAirlineBookingNumberOfChild,
  getAirlineBookingNumberOfInfant,
  getAirlineBookingNumberOfPaxTotal,
  (
    AirlineBookingOrigin,
    AirlineBookingOriginDetail,
    AirlineBookingDestination,
    AirlineBookingDestinationDetail,
    AirlineBookingDepartureDate,
    AirlineBookingArrivalDate,
    AirlineBookingTripType,
    AirlineBookingNumberOfAdult,
    AirlineBookingNumberOfChild,
    AirlineBookingNumberOfInfant,
    AirlineBookingNumberOfPaxTotal
  ) => {
    return {
      AirlineBookingOrigin: AirlineBookingOrigin,
      AirlineBookingOriginDetail: AirlineBookingOriginDetail,
      AirlineBookingDestination: AirlineBookingDestination,
      AirlineBookingDestinationDetail: AirlineBookingDestinationDetail,
      AirlineBookingDepartureDate: AirlineBookingDepartureDate,
      AirlineBookingArrivalDate: AirlineBookingArrivalDate,
      AirlineBookingTripType: AirlineBookingTripType,
      AirlineBookingNumberOfAdult: AirlineBookingNumberOfAdult,
      AirlineBookingNumberOfChild: AirlineBookingNumberOfChild,
      AirlineBookingNumberOfInfant: AirlineBookingNumberOfInfant,
      AirlineBookingNumberOfPaxTotal: AirlineBookingNumberOfPaxTotal,
    };
  }
);
