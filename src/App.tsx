import React, { useEffect, useState } from "react";
import { Plugins } from "@capacitor/core";
import { Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  isPlatform,
  useIonViewDidEnter,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import MainTabs from "./pages/MainTabs";
import { connect } from "./data/connect";
import { AppContextProvider } from "./data/AppContext";
import { loadUserData, logoutUser } from "./data/user/user.actions";

//#region Pages & Component
import Login from "./pages/Member/Login";
import ForgotPassword from "./pages/Member/ForgotPassword";
import Signup from "./pages/Member/Register";
import Balance from "./pages/Member/Balance";
import BalanceRequest from "./pages/Member/BalanceRequest";
import BalanceActivities from "./pages/Member/BalanceActivities";
import Tutorial from "./pages/Tutorial";
import HomeOrTutorial from "./components/HomeOrTutorial";
import Tour from "./pages/Tour/Index";
import TourSearch from "./pages/Tour/Search";
import TourDetail from "./pages/Tour/Detail";

import Ecommerce from "./pages/Ecommerce/Index";
import EcommerceSearch from "./pages/Ecommerce/Search";
import EcommerceDetail from "./pages/Ecommerce/Detail";

import TourLightBox from "./pages/Tour/LightBox";
import TourBookingSeries from "./pages/Tour/BookingSeries";
import TourBookingSeriesSelectPax from "./pages/Tour/BookingSeriesSelectPax";
import TourBookingRegular from "./pages/Tour/BookingRegular";
import TourBookingRegularSelectPax from "./pages/Tour/BookingRegularSelectPax";
import TourOrder from "./pages/Tour/Order";
import TourPayment from "./pages/Tour/Payment";
import TourComplete from "./pages/Tour/Complete";

import EcommerceLightBox from "./pages/Ecommerce/LightBox";
import EcommerceBookingSeries from "./pages/Ecommerce/BookingSeries";
import EcommerceBookingSeriesSelectPax from "./pages/Ecommerce/BookingSeriesSelectPax";
import EcommerceBookingRegular from "./pages/Ecommerce/BookingRegular";
import EcommerceBookingRegularSelectPax from "./pages/Ecommerce/BookingRegularSelectPax";
import EcommerceOrder from "./pages/Ecommerce/Order";
import EcommercePayment from "./pages/Ecommerce/Payment";
import EcommerceComplete from "./pages/Ecommerce/Complete";

import AirlineSearch from "./pages/Airline/Search";
import AirlineSearchFirstFlight from "./pages/Airline/SearchFirstFlight";
import AirlineSearchSecondFlight from "./pages/Airline/SearchSecondFlight";
import AirlineFlightInformation from "./pages/Airline/FlightInformation";
import AirlineOrder from "./pages/Airline/Order";
import AirlinePayment from "./pages/Airline/Payment";
import AirlineComplete from "./pages/Airline/Complete";

import HotelSearch from "./pages/Hotel/Search";
import HotelSearchResullt from "./pages/Hotel/SearchResult";
import HotelDetail from "./pages/Hotel/Detail";
import HotelOrder from "./pages/Hotel/Order";
import HotelPayment from "./pages/Hotel/Payment";
import HotelComplete from "./pages/Hotel/Complete";

import TransactionHistoryList from "./pages/Transaction/HistoryList";
import TransactionHistoryDetail from "./pages/Transaction/HistoryDetail";
import TransactionHistoryDetailFlightticket from "./pages/Transaction/HistoryDetailFlightticket";
import TransactionHistoryDetailHotel from "./pages/Transaction/TransactionHistoryDetailHotel";
import EcommerceHistoryDetail from "./pages/Transaction/EcommerceHistoryDetail";

// import DokuComplete from "./pages/DokuComplete";
// import DokuStaging from "./pages/DokuStaging";

// import PaymentDoku from "./pages/payment/Doku";
// import PaymentDokuForm from "./pages/payment/DokuForm";

import ReadPDF from "./pages/ReadPDF";

import AccountEdit from "./pages/AccountEdit";
//#endregion Pages & Component

import { AppId, MainUrl } from "./AppConfig";
import { HTTP } from "@ionic-native/http";
import {
  loadTourBookingData,
  loadTourPaymentData,
  loadTourProductData,
} from "./data/tour/tour.actions";
import { loadProfile } from "./data/profile/profile.actions";
import { read } from "fs";
const App: React.FC = () => {
  return (
    <AppContextProvider>
      <VirtualTravelAppConnected />
    </AppContextProvider>
  );
};
interface StateProps {
  darkMode: boolean;
}
interface DispatchProps {
  loadUserData: typeof loadUserData;
  loadTourProductData: typeof loadTourProductData;
  loadTourBookingData: typeof loadTourBookingData;
  loadTourPaymentData: typeof loadTourPaymentData;
  logoutUser: typeof logoutUser;
  loadProfile: typeof loadProfile;
}

interface VirtualTravelAppProps extends StateProps, DispatchProps {}

const VirtualTravelApp: React.FC<VirtualTravelAppProps> = ({
  darkMode,
  logoutUser,
  loadTourPaymentData,
  loadProfile,
  loadUserData,
  loadTourBookingData,
  loadTourProductData,
}) => {
  const [loggedInStatus, setLoggedInStatus] = useState(false);

  //Get Storage Has Logged In
  Plugins.Storage.get({ key: "isLoggedin" })
    .then((r) => {
      return r.value === "true";
    })
    .then((r) => {
      setLoggedInStatus(r);
    });
  //Load All Important Data For the First Time
  useEffect(() => {
    loadUserData();
    loadTourProductData();
    loadTourBookingData();
    loadTourPaymentData();
    loadProfile();

    Plugins.Storage.get({ key: "isLoggedin" })
      .then((r) => {
        return r.value === "true";
      })
      .then((r) => {
        if (r) {
          AccountInfo();
        }
      });
  }, []);
  // Get Account Info
  const AccountInfo = async () => {
    const AT = await Plugins.Storage.get({ key: "accessToken" });
    const RVT = await Plugins.Storage.get({ key: "requestVerificationToken" });
    const accountInfoFormData = new FormData();
    accountInfoFormData.append("AccToken", AT.value ? AT.value : "");
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "member/accountinfo", accountInfoFormData, {
        appid: AppId ? AppId : "",
        RequestVerificationToken: RVT.value ? RVT.value : "",
      })
        .then((res) => {
          if (res.status !== 200) {
            logoutUser();
          }
        })
        .catch((err) => {
          logoutUser();
        });
    } else {
      fetch(MainUrl + "member/accountinfo", {
        method: "POST",
        body: accountInfoFormData,
        headers: {
          appid: AppId ? AppId : "",
          RequestVerificationToken: RVT.value ? RVT.value : "",
        },
      })
        .then((r) => {
          if (r.status !== 200) {
            logoutUser();
          }
        })
        .catch((err) => {
          logoutUser();
        });
    }
  };
  // useIonViewDidEnter(async () => {
  //   await Plugins.SplashScreen.hide();
  // });
  return (
    <IonApp className={`${darkMode ? "dark-theme" : ""}`}>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonRouterOutlet id="main">
            <Route path="/main" component={MainTabs} />
            {/* User */}
            <Route path="/login" component={Login} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="/register" component={Signup} />
            <Route
              path="/accountEdit"
              component={loggedInStatus ? AccountEdit : Login}
            />
            <Route
              path="/balance"
              component={loggedInStatus ? Balance : Login}
            />
            <Route
              path="/balancerequest"
              component={loggedInStatus ? BalanceRequest : Login}
            />
            <Route
              path="/balanceactivities"
              component={loggedInStatus ? BalanceActivities : Login}
            />
            {/* Pages */}
            <Route path="/tutorial" component={Tutorial} />
            {/*Tour*/}
            <Route path="/tour" component={Tour} />
            <Route path="/tourSearch" component={TourSearch} />
            <Route path="/tourDetail/:title/:code" component={TourDetail} />
            {/*Airline*/}
            <Route path="/airlineSearch" component={AirlineSearch} />
            <Route
              path="/airlineSearchFirstFlight"
              component={AirlineSearchFirstFlight}
            />
            <Route
              path="/airlineSearchSecondFlight"
              component={AirlineSearchSecondFlight}
            />
            <Route
              path="/airlineFlightInformation"
              component={AirlineFlightInformation}
            />
            <Route path="/airlineOrder" component={AirlineOrder} />
            <Route path="/airlinePayment" component={AirlinePayment} />
            <Route path="/airlineComplete" component={AirlineComplete} />
            {/*Hotel*/}
            <Route path="/hotelSearch" component={HotelSearch} />
            <Route path="/hotelSearchResullt" component={HotelSearchResullt} />
            <Route path="/hotelDetail/:hcode/:icode" component={HotelDetail} />
            <Route path="/hotelOrder" component={HotelOrder} />
            <Route path="/hotelPayment" component={HotelPayment} />
            <Route path="/hotelComplete" component={HotelComplete} />
            {/*Ecommerce*/}
            {/* <Route path="/ecommerce" component={Ecommerce} />
            <Route path="/tourSearch" component={EcommerceSearch} />
            <Route path="/ProductDetail/:code" component={EcommerceDetail}/> */}
            <Route path="/tourLightBox" component={TourLightBox} />
            <Route path="/tourBookingSeries" component={TourBookingSeries} />
            <Route
              path="/tourBookingSeriesSelectPax"
              component={TourBookingSeriesSelectPax}
            />
            <Route path="/tourBookingRegular" component={TourBookingRegular} />
            <Route
              path="/tourBookingRegularSelectPax"
              component={TourBookingRegularSelectPax}
            />
            <Route
              path="/tourOrder"
              component={loggedInStatus ? TourOrder : Login}
            />
            <Route
              path="/tourPayment"
              component={loggedInStatus ? TourPayment : Login}
            />
            <Route
              path="/tourComplete"
              component={loggedInStatus ? TourComplete : Login}
            />
            {/* Transaction */}
            <Route
              path="/transactionHistoryList"
              component={loggedInStatus ? TransactionHistoryList : Login}
            />
            <Route
              path="/transactionHistoryDetail/:inv"
              component={loggedInStatus ? TransactionHistoryDetail : Login}
            />
            <Route
              path="/transactionHistoryDetailFlightticket/:inv"
              component={
                loggedInStatus ? TransactionHistoryDetailFlightticket : Login
              }
            />
            <Route
              path="/transactionHistoryDetailHotel/:inv"
              component={loggedInStatus ? TransactionHistoryDetailHotel : Login}
            />

            <Route
              path="/EcommerceHistoryDetail"
              component={loggedInStatus ? EcommerceHistoryDetail : Login}
            />
            {/* Transaction */}
            {/* <Route path="/transactionHistoryList" component={loggedInStatus?TransactionHistoryList:Login} /> */}
            {/* <Route path="/transactionHistoryDetail/:inv" component={loggedInStatus?TransactionHistoryDetail:Login} /> */}
            {/* Doku */}
            {/* <Route path="/DokuComplete" component={DokuComplete} />
            <Route
              path="/DokuStaging/:data/:returnurl"
              component={DokuStaging}
            /> */}
            {/* Payment */}
            {/* <Route path="/payment/doku/" component={PaymentDoku} />
            <Route path="/payment/dokuform/" component={PaymentDokuForm} /> */}
            {/* Read PDF */}
            <Route path="/ReadPDF/:url" component={ReadPDF} />
            <Route path="/" component={HomeOrTutorial} exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
const VirtualTravelAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
  }),
  mapDispatchToProps: {
    loadUserData,
    logoutUser,
    loadTourProductData,
    loadTourBookingData,
    loadTourPaymentData,
    loadProfile,
  },
  component: VirtualTravelApp,
});
