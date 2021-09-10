import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  isPlatform,
  IonLoading,
  IonAlert,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
// import { AppId, MainUrl } from '../../AppConfig';
// import { rupiah } from '../../helpers/currency';
// import { HTTP } from '@ionic-native/http';
import AirlineSearchFrom from "../../components/AirlineSearch/AirlineSearchForm";
import { HTTP } from "@ionic-native/http";
import { AppId, MainUrl } from "../../AppConfig";
import { setAirlineFlightJourney } from "../../data/airline/airline.actions";
import { stringDateConvertDashSeparate } from "../../helpers/datetime";

interface OwnProps {}
interface StateProps {
  AirlineBooking: any;
  UserData: any;
}
interface DispatchProps {
  setAirlineFlightJourney: typeof setAirlineFlightJourney;
}
interface SearchUpdateButtonProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const SearchUpdateButton: React.FC<SearchUpdateButtonProps> = ({
  AirlineBooking,
  UserData,
  history,
  setAirlineFlightJourney,
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
      HTTP.post(MainUrl + "Airline/ScheduleAll", MyData, MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          AirlineBookingSubmitSuccess(res);
        })
        .catch((err) => {
          failedAlert(JSON.stringify(err));
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
            failedAlert("Periksa Koneksi Anda");
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
      setShowLoading(false);
    } else {
      failedAlert("Penerbangan tidak ditemukan");
    }
  };
  return (
    <IonGrid className="ion-padding">
      <IonButton
        className="ion-margin-top text-transform-none"
        expand="block"
        size="large"
        // routerLink="/airlineSearchFirstFlight"
        onClick={() => AirlineBookingSubmit()}
      >
        Cari Tiket Pesawat
      </IonButton>
      <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={headerAlert}
        message={messageAlert}
        buttons={["OK"]}
      />
    </IonGrid>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineBooking: selectors.getAirlineBooking(state),
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {
    setAirlineFlightJourney,
  },
  component: React.memo(withRouter(SearchUpdateButton)),
});
