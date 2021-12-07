import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonLoading,
  IonPage,
  isPlatform,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
// import { AppId, MainUrl } from '../../AppConfig';
// import { rupiah } from '../../helpers/currency';
// import { HTTP } from '@ionic-native/http';
import AirlineSearchFrom from "../../components/AirlineSearch/AirlineSearchForm";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import {
  setAirlineBookingDataBundle,
  setAirlineFlightArrival,
  setAirlineFlightDeparture,
  setAirlineFlightJourney,
  setAirlineOrderPassengersBaggage,
  setAirlineOrderPassengersData,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { AppId, MainUrl } from "../../AppConfig";
import { stringDateConvertDashSeparate } from "../../helpers/datetime";
import "./Search.scss";

interface OwnProps {}
interface StateProps {
  AirlineBooking: any;
  UserData: any;
}
interface DispatchProps {
  setAirlineFlightJourney: typeof setAirlineFlightJourney;
  setAirlineFlightDeparture: typeof setAirlineFlightDeparture;
  setAirlineFlightArrival: typeof setAirlineFlightArrival;
  setAirlineBookingDataBundle: typeof setAirlineBookingDataBundle;
  setAirlineOrderPassengersBaggage: typeof setAirlineOrderPassengersBaggage;
  setAirlineOrderPassengersData: typeof setAirlineOrderPassengersData;
}
interface SearchProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Search: React.FC<SearchProps> = ({
  AirlineBooking,
  UserData,
  history,
  setAirlineFlightJourney,
  setAirlineFlightDeparture,
  setAirlineFlightArrival,
  setAirlineBookingDataBundle,
  setAirlineOrderPassengersBaggage,
  setAirlineOrderPassengersData,
}) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const AirlineBookingSubmit = () => {
    setAirlineFlightJourney(undefined);
    setAirlineFlightDeparture(undefined);
    setAirlineFlightArrival(undefined);
    setAirlineBookingDataBundle(undefined);
    setAirlineOrderPassengersBaggage(undefined);
    setAirlineOrderPassengersData(undefined);
    localStorage.removeItem("AirlineBaggageTotalPrice");
    localStorage.removeItem("AirlineBookingId");
    localStorage.removeItem("AirlineLastIdOrder");
    localStorage.removeItem("AirlineTransactionID");
    if (!UserData.accessToken) {
      failedAlert("Login Terlebih Dahulu");
      history.push("/login");
      return;
    }
    setShowLoading(true);
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = new FormData();
    // MyData.append("airlineAccessCode", "null");
    MyData.append("airlineDetail", "Semua Maskapai");
    // MyData.append("airlineFlightClass", "null");
    MyData.append("airlineID", "ALL");
    MyData.append(
      "departDate",
      stringDateConvertDashSeparate(AirlineBooking.AirlineBookingDepartureDate)
    );
    MyData.append("destination", AirlineBooking.AirlineBookingDestination);
    MyData.append(
      "destinationDetail",
      AirlineBooking.AirlineBookingDestinationDetail
    );
    MyData.append("origin", AirlineBooking.AirlineBookingOrigin);
    MyData.append("originDetail", AirlineBooking.AirlineBookingOriginDetail);
    MyData.append("paxAdult", AirlineBooking.AirlineBookingNumberOfAdult);
    MyData.append("paxChild", AirlineBooking.AirlineBookingNumberOfChild);
    MyData.append("paxInfant", AirlineBooking.AirlineBookingNumberOfInfant);
    MyData.append("progressPercent", "0");
    // MyData.append("promoCode", "null");
    MyData.append(
      "returnDate",
      AirlineBooking.AirlineBookingTripType === "RoundTrip"
        ? stringDateConvertDashSeparate(
            AirlineBooking.AirlineBookingArrivalDate
          )
        : "null"
    );
    MyData.append("tripType", AirlineBooking.AirlineBookingTripType);
    MyData.append("accToken", UserData.accessToken);
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.setRequestTimeout(180);
      HTTP.post(MainUrl + "Airline/ScheduleAll", MyData, MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            if (res.status === 401) {
              failedAlert("Session telah habis, silahkan login ulang");
              history.push("/login");
            } else {
              alert("Periksa Koneksi anda");
            }
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          AirlineBookingSubmitSuccess(res);
        })
        .catch((err) => {
          failedAlert("Session telah habis, silahkan login ulang");
          history.push("/login");
        });
    } else {
      fetch(MainUrl + "Airline/ScheduleAll", {
        method: "POST",
        headers: MyHeaders,
        body: MyData,
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            if (r.status === 401) {
              failedAlert("Session telah habis, silahkan login ulang");
              history.push("/login");
            } else {
              failedAlert(r.statusText);
            }
            return r.json();
          }
        })
        .then((res) => {
          AirlineBookingSubmitSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };
  const AirlineBookingSubmitSuccess = async (res: any) => {
    if (res.StatusCode == 200) {
      await setAirlineFlightJourney({
        Departure: res.Data.LowFareJourneyDepart,
        Return: res.Data.LowFareJourneyReturn,
      });
      localStorage.removeItem("AirlineOrderBaggageSelected");
      localStorage.removeItem("AirlineOrderOrderPerson");
      setShowLoading(false);
      history.push("/airlineSearchFirstFlight");
    } else {
      failedAlert("Penerbangan tidak ditemukan");
    }
  };
  return (
    <IonPage>
      <IonHeader translucent>
        <DefaultToolbar
          title={"Tiket Pesawat"}
          color="primary"
          backButtonRoute="/main/index"
        />
      </IonHeader>
      <IonContent fullscreen={true} class="airlineSearch">
        <IonGrid className="ion-padding">
          <AirlineSearchFrom></AirlineSearchFrom>
          <IonButton
            className="ion-margin-top text-transform-none"
            expand="block"
            size="large"
            // routerLink="/airlineSearchFirstFlight"
            onClick={() => AirlineBookingSubmit()}
          >
            Cari Tiket Pesawat
          </IonButton>
        </IonGrid>
        <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={headerAlert}
          message={messageAlert}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineBooking: selectors.getAirlineBooking(state),
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {
    setAirlineFlightJourney,
    setAirlineFlightDeparture,
    setAirlineFlightArrival,
    setAirlineBookingDataBundle,
    setAirlineOrderPassengersBaggage,
    setAirlineOrderPassengersData,
  },
  component: React.memo(withRouter(Search)),
});
