import { combineReducers } from "./combineReducers";
import { appReducer } from "./app/app.reducer";
import { userReducer } from "./user/user.reducer";
import { profileReducer } from "./profile/profile.reducer";
import { tourReducer } from "./tour/tour.reducer";
import { airlineReducer } from "./airline/airline.reducer";
import { hotelReducer } from "./hotel/hotel.reducer";
var datenow = new Date();
var datetomorrow = new Date();
datetomorrow.setDate(datetomorrow.getDate() + 1);
export const initialState: AppState = {
  data: {
    news: [],
    newTourProductList: [],
    newEcommerceProductList: [],
  },
  user: {
    hasSeenTutorial: false,
    darkMode: false,
    isLoggedin: false,
    loading: false,
  },
  profile: {},
  tour: {
    TourPaymentAllowStatus: false,
  },
  airline: {
    AirlinePaymentAllowStatus: false,
    AirlineBookingDepartureDate: datenow,
    AirlineBookingArrivalDate: datetomorrow,
    // AirlineBookingOrigin: "SUB",
    // AirlineBookingDestination: "CGK",
    // AirlineBookingOriginDetail: "Indonesia, Surabaya (SUB)",
    // AirlineBookingDestinationDetail: "Indonesia, Jakarta,Soekarno Hatta (CGK)",
    AirlineBookingTripType: "RoundTrip",
    AirlineBookingNumberOfAdult: 1,
    AirlineBookingNumberOfChild: 0,
    AirlineBookingNumberOfInfant: 0,
    AirlineBookingNumberOfPaxTotal: 1,
  },
  hotel: {},
};

export const reducers = combineReducers({
  data: appReducer,
  user: userReducer,
  profile: profileReducer,
  tour: tourReducer,
  airline: airlineReducer,
  hotel: hotelReducer,
});

export type AppState = ReturnType<typeof reducers>;
