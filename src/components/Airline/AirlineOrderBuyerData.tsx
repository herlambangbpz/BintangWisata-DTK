import React, { useEffect, useState } from "react";
import AirlineOrderBuyerDataItem from "./AirlineOrderBuyerDataItem";

import {
  IonAlert,
  IonGrid,
  IonLoading,
  IonText,
  isPlatform,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import { AppId, MainUrl } from "../../AppConfig";
import * as selectors from "../../data/selectors";
import { HTTP } from "@ionic-native/http";
import {
  loadAirlineBookingDataBundleData,
  loadAirlineOrderPassengersData,
} from "../../data/airline/airline.actions";

interface OwnProps {
  domesticTourType: boolean;
}
interface StateProps {
  ABDB?: any;
  AOPD?: any;
  UserData?: any;
}
interface DispatchProps {
  loadAirlineBookingDataBundleData: typeof loadAirlineBookingDataBundleData;
  loadAirlineOrderPassengersData: typeof loadAirlineOrderPassengersData;
}
interface AirlineOrderBuyerDataProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineOrderBuyerData: React.FC<AirlineOrderBuyerDataProps> = ({
  domesticTourType,
  ABDB,
  loadAirlineBookingDataBundleData,
  loadAirlineOrderPassengersData,
  AOPD,
  history,
  UserData,
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
  const [DidEnter, setDidEnter] = useState<boolean>(false);
  const [PassengerTitle, setPassengerTitle] = useState<any>(null);
  const [AirlineOrderPaxData, setAirlineOrderPaxData] = useState<any>(null);
  const [Countries, setCountries] = useState<any>(null);
  const [Nationalities, setNationalities] = useState<any>([]);
  // const [TourOrderPaxData, setTourOrderPaxData] = useState<any>(2);
  // useEffect(() => {
  //   setTourOrderPaxData(
  //     JSON.parse(
  //       localStorage.TourOrderPaxData ? localStorage.TourOrderPaxData : null
  //     )
  //   );
  //   // loadNewTourProdctListData();
  // }, [localStorage.TourOrderPaxData]);
  useEffect(() => {
    if (AOPD && ABDB && DidEnter === false) {
      setDidEnter(true);
      GetPassenger();
    }
  }, [AOPD, ABDB]);
  useIonViewWillEnter(() => {
    loadAirlineOrderPassengersData();
    loadAirlineBookingDataBundleData();
  });

  // useIonViewDidEnter(() => {
  //   GetCountries()
  // })
  // const GetCountries = () => {};
  // const GetCountriesSuccess = () => {};
  const GetPassenger = () => {
    setShowLoading(true);
    var MyHeaders = {
      appid: AppId,
      "Content-Type": "application/json",
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = JSON.stringify({
      AirlineID: ABDB.PreBookingData.AirlineID,
      origin: ABDB.PreBookingData.Origin,
      destination: ABDB.PreBookingData.Destination,
      tripType: ABDB.PreBookingData.TripType,
      DepartDate: ABDB.PreBookingData.DepartDate,
      ReturnDate: ABDB.PreBookingData.ReturnDate,
      PaxAdult: ABDB.PreBookingData.PaxAdult,
      PaxChild: ABDB.PreBookingData.PaxChild,
      PaxInfant: ABDB.PreBookingData.PaxInfant,
      PromoCode: "",
      originDetail: ABDB.PreBookingData.OriginDetail,
      destinationDetail: ABDB.PreBookingData.DestinationDetail,
      SchDeparts: ABDB.PreBookingData.SchDeparts,
      SchReturns: ABDB.PreBookingData.SchReturns,
      XTKN: ABDB.PreBookingData.XTKN,
      accToken: UserData.accessToken,
    });
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("json");
      HTTP.post(MainUrl + "Airline/Passengers", JSON.parse(MyData), MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          GetPassengerSuccess(res);
        })
        .catch((err) => {
          failedAlert(JSON.stringify(err));
        });
    } else {
      fetch(MainUrl + "Airline/Passengers", {
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
          GetPassengerSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };
  const GetPassengerSuccess = (res) => {
    if (res.Data && res.Data.IsAllowBooking === true) {
      setShowLoading(false);
      setPassengerTitle(res.Data.PassengerTitle);
    } else {
      failedAlert("Booking Tiket Pesawat tidak diizinkan");
      history.goBack();
      return;
    }
  };
  React.useEffect(() => {
    fetch("/assets/data/AirlineNationalities.json")
      .then((res) => res.json())
      .then((res) => {
        setNationalities(res);
      });
  }, []);
  return (
    <div>
      <IonText class="ion-padding" color="dark">
        <small>Data Penumpang</small>
      </IonText>
      {AOPD ? (
        AOPD.map((item, index) => (
          // <div></div>
          <AirlineOrderBuyerDataItem
            indexItem={index}
            item={item}
            AOPD={AOPD}
            domesticTourType={domesticTourType}
            PassengerTitle={PassengerTitle}
            key={index}
            Nationalities={Nationalities}
          ></AirlineOrderBuyerDataItem>
        ))
      ) : (
        <>
          <p></p>
          <IonText color="danger">⚠️ Anda belum memilih pax</IonText>
        </>
      )}
      <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={headerAlert}
        message={messageAlert}
        buttons={["OK"]}
      />
    </div>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    ABDB: state.airline.AirlineBookingDataBundle,
    AOPD: state.airline.AirlineOrderPassengersData,
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {
    loadAirlineOrderPassengersData,
    loadAirlineBookingDataBundleData,
  },
  component: React.memo(withRouter(AirlineOrderBuyerData)),
});
