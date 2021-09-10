import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { chevronDown, chevronUp } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import AirlineFlightPanel from "../../components/Airline/AirlineFlightPanel";
import {
  loadAirlineBookingDataBundleData,
  setAirlineBookingDataBundle,
  setAirlineOrderPassengersBaggage,
  setAirlineOrderPassengersData,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { AppId, MainUrl } from "../../AppConfig";
import { rupiah } from "../../helpers/currency";
import { stringDateConvertDashSeparate } from "../../helpers/datetime";
import "./FlightInformation.scss";

interface OwnProps {}
interface StateProps {
  UserData: any;
  AB: any;
  AFD: any;
  AFA: any;
  ABDB: any;
}
interface DispatchProps {
  // setTourPaymentAllowStatus: typeof setTourPaymentAllowStatus;
  setAirlineBookingDataBundle: typeof setAirlineBookingDataBundle;
  loadAirlineBookingDataBundleData: typeof loadAirlineBookingDataBundleData;
  setAirlineOrderPassengersData: typeof setAirlineOrderPassengersData;
  setAirlineOrderPassengersBaggage: typeof setAirlineOrderPassengersBaggage;
}
interface FlightInformationProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const FlightInformation: React.FC<FlightInformationProps> = ({
  history,
  UserData,
  AB,
  AFD,
  AFA,
  ABDB,
  setAirlineBookingDataBundle,
  loadAirlineBookingDataBundleData,
  setAirlineOrderPassengersData,
  setAirlineOrderPassengersBaggage,
}) => {
  const [hiddenDetailPrice, setHiddenDetailPrice] = useState(true);
  const [hiddenDetailPriceChevronUp, setHiddenDetailPriceChevronUp] =
    useState(false);
  const [hiddenDetailPriceChevronDown, setHiddenDetailPriceChevronDown] =
    useState(true);
  const [PriceUpdated, setPriceUpdated] = useState<boolean>(false);
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
  const seeDetailPrice = () => {
    setHiddenDetailPrice(false);
    setHiddenDetailPriceChevronUp(true);
    setHiddenDetailPriceChevronDown(false);
  };
  const hideDetailPrice = () => {
    setHiddenDetailPrice(true);
    setHiddenDetailPriceChevronUp(false);
    setHiddenDetailPriceChevronDown(true);
  };
  const AirlinePreBooking = () => {
    setPriceUpdated(false);
    setShowLoading(true);
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = new FormData();
    MyData.append("Airline", AFD.airlineID);
    MyData.append(
      "OneWayTrip",
      AB.AirlineBookingTripType === "OneWay" ? "true" : "false"
    );
    MyData.append(
      "DateDeparture",
      stringDateConvertDashSeparate(AB.AirlineBookingDepartureDate)
    );
    MyData.append(
      "DateReturn",
      AB.AirlineBookingTripType === "OneWay"
        ? "null"
        : stringDateConvertDashSeparate(AB.AirlineBookingArrivalDate)
    );
    MyData.append("PaxAdult", AB.AirlineBookingNumberOfAdult);
    MyData.append("PaxChild", AB.AirlineBookingNumberOfChild);
    MyData.append("PaxInfant", AB.AirlineBookingNumberOfInfant);
    MyData.append("origin", AB.AirlineBookingOrigin);
    MyData.append("destination", AB.AirlineBookingDestination);
    MyData.append("PromoCode", "");
    MyData.append("originDetail", AB.AirlineBookingOriginDetail);
    MyData.append("destinationDetail", AB.AirlineBookingDestinationDetail);
    MyData.append("journeyDepartReference", AFD.journeyReference);

    MyData.append(
      "departAirlineCodePreBook",
      AFD.segment[0].flightDetail[0].airlineCode
    );
    MyData.append("departDepartTimeCode", AFD.jiDepartTime);
    MyData.append("departArrivalTimeCode", AFD.jiArrivalTime);
    MyData.append(
      "departFlightClassCode",
      AFD.segment[0].availableDetail[0].flightClass
    );
    if (AFA) {
      MyData.append("journeyReturnReference", AFA.journeyReference);
      MyData.append(
        "returnAirlineCodePreBook",
        AFA.segment[0].flightDetail[0].airlineCode
      );
      MyData.append("returnDepartTimeCode", AFA.jiDepartTime);
      MyData.append("returnArrivalTimeCode", AFA.jiArrivalTime);
      MyData.append(
        "returnFlightClassCode",
        AFA.segment[0].availableDetail[0].flightClass
      );
    }

    MyData.append("airlineAccessCode", "");
    MyData.append("accToken", UserData.accessToken);
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "Airline/Prebooking", MyData, MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          AirlinePreBookingSuccess(res);
        })
        .catch((err) => {
          failedAlert(JSON.stringify(err));
        });
    } else {
      fetch(MainUrl + "Airline/Prebooking", {
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
          AirlinePreBookingSuccess(res);
        })
        .catch((err) => {
          failedAlert(err);
        });
    }
  };
  const AirlinePreBookingSuccess = (res: any) => {
    if (res.ErrorMessage) {
      failedAlert(res.ErrorMessage);
    } else {
      const PBD = res.Data;
      var MyHeaders = {
        appid: AppId,
        "Content-Type": "application/json",
        RequestVerificationToken: UserData.requestVerificationToken,
      };
      var MyData = JSON.stringify({
        AirlineID: res.Data.AirlineID,
        origin: res.Data.Origin,
        destination: res.Data.Destination,
        tripType: res.Data.TripType,
        DepartDate: res.Data.DepartDate,
        ReturnDate: res.Data.TripType === "OneWay" ? null : res.Data.ReturnDate,
        PaxAdult: res.Data.PaxAdult,
        PaxChild: res.Data.PaxChild,
        PaxInfant: res.Data.PaxInfant,
        PromoCode: "",
        originDetail: res.Data.OriginDetail,
        destinationDetail: res.Data.DestinationDetail,
        SchDeparts: res.Data.SchDeparts,
        SchReturns: res.Data.SchReturns,
        XTKN: res.Data.XTKN,
        accToken: UserData.accessToken,
      });
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("json");
        HTTP.post(MainUrl + "Airline/Price", JSON.parse(MyData), MyHeaders)
          .then((res) => {
            if (res.status !== 200) {
              alert("Periksa Koneksi anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            getPriceSuccess(res, PBD);
          })
          .catch((err) => {
            failedAlert(JSON.stringify(err));
          });
      } else {
        fetch(MainUrl + "Airline/Price", {
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
            getPriceSuccess(res, PBD);
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
          });
      }
    }
  };
  const getPriceSuccess = (res: any, PBD: any) => {
    setPriceUpdated(true);
    let BookingArray = new Array();
    let BaggageSelected = new Array();
    let PassengersData = new Array();
    const Adult = AB.AirlineBookingNumberOfAdult;
    const Child = AB.AirlineBookingNumberOfChild;
    const Infant = AB.AirlineBookingNumberOfInfant;
    for (let index = 0; index < Adult; index++) {
      BookingArray.push("Dewasa " + (index + 1));
    }
    for (let index = 0; index < Child; index++) {
      BookingArray.push("Anak " + (index + 1));
    }
    for (let index = 0; index < Infant; index++) {
      BookingArray.push("Bayi " + (index + 1));
    }
    BookingArray.map((item, index) => {
      const Data = {
        PaxIDNumber: null,
        PaxAddOns: null,
        PaxBatikMilesNo: "",
        PaxBirthCountry: "ID",
        PaxBirthDate: new Date().toString(),
        PaxFirstName: "",
        PaxGarudaFrequentFlyer: null,
        PaxGender: "",
        PaxLastName: "",
        PaxNationality: "ID",
        PaxParent: null,
        PaxPassportExpiredDate: "",
        PaxPassportIssuedCountry: "",
        PaxPassportIssuedDate: "",
        PaxPassportNumber: "",
        PaxTitle: "",
        PaxType:
          item.split(" ")[0] === "Dewasa"
            ? "Adult"
            : item.split(" ")[0] === "Anak"
            ? "Child"
            : item.split(" ")[0] === "Bayi"
            ? "Infant"
            : "Adult",
        PaxLabel: item,
      };
      PassengersData.push(Data);
      if (Data.PaxType !== "Infant") {
        BaggageSelected.push(null);
      }
    });
    if (res && res.TripType === "RoundTrip") {
      setAirlineOrderPassengersBaggage([BaggageSelected, BaggageSelected]);
      localStorage.setItem(
        "AirlineOrderBaggageSelected",
        JSON.stringify([BaggageSelected, BaggageSelected])
      );
    } else {
      setAirlineOrderPassengersBaggage([BaggageSelected]);
      localStorage.setItem(
        "AirlineOrderBaggageSelected",
        JSON.stringify([BaggageSelected])
      );
    }
    setAirlineBookingDataBundle({
      PreBookingData: PBD,
      PriceData: res,
      AirlineBooking: AB,
      AirlineFlightDeparture: AFD,
      AirlineFlightArrival: AFA || undefined,
    });
    setAirlineOrderPassengersData(PassengersData);
    setShowLoading(false);
  };
  const submitFlight = () => {
    history.push("/airlineOrder");
  };
  useIonViewWillEnter(() => {});
  useIonViewDidEnter(() => {
    loadAirlineBookingDataBundleData();
    if (AFD) {
      AirlinePreBooking();
    } else {
      setPriceUpdated(true);
    }
  });
  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/airlineSearchFirstFlight"></IonBackButton>
          </IonButtons>
          <IonTitle>Informasi Penerbangan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <div
          hidden={!PriceUpdated}
          className="successToast ion-padding ion-margin-bottom"
        >
          <IonText color="light">Harga tiket pesawat telah diperbarui</IonText>
        </div>
        <AirlineFlightPanel Open={true}></AirlineFlightPanel>
        <IonText color="medium">
          <p className="ion-margin-start">
            *harga masih dapat berubah, harga final maskapai akan dikonfirmasi
            kembali saat proses pembayaran
          </p>
        </IonText>
      </IonContent>

      <IonFooter>
        <IonCard className="ion-no-margin ion-no-padding footerPrice">
          <IonGrid>
            <IonRow class="priceCollapse">
              <IonCol size="6">
                <IonText color="medium">Harga yang harus dibayar</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-right">
                <IonText>
                  <h5 className="ion-no-margin">
                    {ABDB && ABDB.PriceData
                      ? rupiah(ABDB.PriceData.SumFare)
                      : "Rp 0"}
                    {/* {Price !== null ? rupiah(Price || 0) : "Rp 0"} */}
                    <IonIcon
                      icon={chevronUp}
                      hidden={hiddenDetailPriceChevronUp}
                      size="large"
                      color="primary"
                      onClick={() => seeDetailPrice()}
                    ></IonIcon>
                    <IonIcon
                      icon={chevronDown}
                      hidden={hiddenDetailPriceChevronDown}
                      size="large"
                      color="primary"
                      onClick={() => hideDetailPrice()}
                    ></IonIcon>
                  </h5>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow hidden={hiddenDetailPrice}>
              <IonCol size="12">
                <IonText color="dark">
                  {ABDB && ABDB.PriceData.TripType === "RoundTrip"
                    ? "Pergi - Pulang"
                    : "Pergi"}
                </IonText>
              </IonCol>
              {/* Dewasa */}
              <IonCol
                size="6"
                hidden={
                  ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfAdult > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {(ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfAdult) ||
                    0}
                  {"x "}
                  Dewasa
                </IonText>
              </IonCol>
              <IonCol
                size="6"
                className="ion-text-right"
                hidden={
                  ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfAdult > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {rupiah(
                    (ABDB &&
                      ABDB.AirlineBooking.AirlineBookingNumberOfAdult > 0 &&
                      ABDB.PreBookingData.PriceDetail[0].totalFare) ||
                      "0"
                  )}
                </IonText>
              </IonCol>
              {/* Anak-anak */}
              <IonCol
                size="6"
                hidden={
                  ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfChild > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {(ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfChild) ||
                    0}
                  {"x "}
                  Anak
                </IonText>
              </IonCol>
              <IonCol
                size="6"
                className="ion-text-right"
                hidden={
                  ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfChild > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {rupiah(
                    (ABDB &&
                      ABDB.AirlineBooking.AirlineBookingNumberOfChild > 0 &&
                      ABDB.PreBookingData.PriceDetail[1].totalFare) ||
                      "0"
                  )}
                </IonText>
              </IonCol>
              {/* Anak-anak */}
              <IonCol
                size="6"
                hidden={
                  ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfInfant > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {(ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfInfant) ||
                    0}
                  {"x "}
                  Bayi
                </IonText>
              </IonCol>
              <IonCol
                size="6"
                className="ion-text-right"
                hidden={
                  ABDB && ABDB.AirlineBooking.AirlineBookingNumberOfInfant > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {rupiah(
                    (ABDB &&
                      ABDB.AirlineBooking.AirlineBookingNumberOfInfant > 0 &&
                      ABDB.PreBookingData.PriceDetail[2].totalFare) ||
                      "0"
                  )}
                </IonText>
              </IonCol>
              {/* <IonCol
                size="12"
                hidden={
                  ABDB && ABDB.PriceData.TripType === "RoundTrip" ? false : true
                }
              >
                <IonText color="medium">Pulang</IonText>
              </IonCol> */}
            </IonRow>
          </IonGrid>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  className="text-transform-none"
                  size="large"
                  expand="block"
                  onClick={() => submitFlight()}
                >
                  Bayar
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      </IonFooter>
      <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={headerAlert}
        message={messageAlert}
        buttons={["OK"]}
      />
    </IonPage>
  );
};
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
    AB: selectors.getAirlineBooking(state),
    AFD: state.airline.AirlineFlightDeparture,
    AFA: state.airline.AirlineFlightArrival,
    ABDB: state.airline.AirlineBookingDataBundle,
  }),
  mapDispatchToProps: {
    setAirlineBookingDataBundle,
    loadAirlineBookingDataBundleData,
    setAirlineOrderPassengersData,
    setAirlineOrderPassengersBaggage,
  },
  component: React.memo(withRouter(FlightInformation)),
});
