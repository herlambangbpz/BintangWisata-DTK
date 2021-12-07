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
} from "@ionic/react";

import { chevronDown, chevronUp } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { logoutUser } from "../../data/user/user.actions";
import "./Order.scss";
import { Collapse } from "antd";
import { DefaultAva } from "../../AppConfig";
import AirlineWizard from "../../components/Airline/AirlineWizard";
import AirlineOrderBuyerData from "../../components/Airline/AirlineOrderBuyerData";
import AirlineOrderOrderPerson from "../../components/Airline/AirlineOrderOrderPerson";
import AirlineOrderBaggage from "../../components/Airline/AirlineOrderBaggage";
import { rupiah } from "../../helpers/currency";
import {
  loadAirlineBookingDataBundleData,
  loadAirlineOrderPassengersBaggage,
} from "../../data/airline/airline.actions";
import { AppId, MainUrl } from "../../AppConfig";
import { HTTP } from "@ionic-native/http";

const { Panel } = Collapse;
interface OwnProps {}
interface StateProps {
  UserData: any;
  ABDB: any;
  AOPD: any;
  AOPB?: any;
}
interface DispatchProps {
  // setTourPaymentAllowStatus: typeof setTourPaymentAllowStatus;
  logoutUser: typeof logoutUser;
  loadAirlineBookingDataBundleData: typeof loadAirlineBookingDataBundleData;
  loadAirlineOrderPassengersBaggage: typeof loadAirlineOrderPassengersBaggage;
}
interface OrderProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Order: React.FC<OrderProps> = ({
  history,
  UserData,
  ABDB,
  AOPD,
  AOPB,
  logoutUser,
  loadAirlineBookingDataBundleData,
  loadAirlineOrderPassengersBaggage,
}) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Ups! ada yang kurang");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const [UseLionOrBatik, setUseLionOrBatik] = useState(
    (ABDB &&
      ABDB.AirlineFlightDeparture &&
      ABDB.AirlineFlightDeparture.airlineID === "JT") ||
      (ABDB &&
        ABDB.AirlineFlightDeparture &&
        ABDB.AirlineFlightDeparture.airlineID === "ID")
      ? true
      : false
  );
  const [UseGaruda, setUseGaruda] = useState(
    ABDB &&
      ABDB.AirlineFlightDeparture &&
      ABDB.AirlineFlightDeparture.airlineID === "GA"
      ? true
      : false
  );
  const [BaggageTotalPrice, setBaggageTotalPrice] = useState(null);
  const [hiddenDetailPrice, setHiddenDetailPrice] = useState(true);
  const [hiddenDetailPriceChevronUp, setHiddenDetailPriceChevronUp] =
    useState(false);
  const [hiddenDetailPriceChevronDown, setHiddenDetailPriceChevronDown] =
    useState(true);
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
  useIonViewDidEnter(() => {
    loadAirlineBookingDataBundleData();
    loadAirlineOrderPassengersBaggage();
  });
  useEffect(() => {
    if (!UseLionOrBatik) {
      setUseLionOrBatik(
        (ABDB &&
          ABDB.AirlineFlightArrival &&
          ABDB.AirlineFlightArrival.airlineID === "JT") ||
          (ABDB &&
            ABDB.AirlineFlightArrival &&
            ABDB.AirlineFlightArrival.airlineID === "ID")
          ? true
          : false
      );
    }
  }, [UseLionOrBatik]);
  useEffect(() => {
    if (!UseGaruda) {
      setUseGaruda(
        ABDB &&
          ABDB.AirlineFlightDeparture &&
          ABDB.AirlineFlightDeparture.airlineID === "GA"
          ? true
          : false
      );
    }
  }, [UseGaruda]);
  const calculateBaggageAirlineTotal = (t) => {
    setBaggageTotalPrice(t);
  };
  const AOPDCheck = () => {
    let count = 0;
    AOPD.forEach((i) => {
      if (i.PaxFirstName !== "") {
        count = count + 1;
      }
    });
    if (count >= AOPD.length) {
      return true;
    } else {
      return false;
    }
  };
  const logout = async () => {
    logoutUser();
  };
  const submitBooking = () => {
    const AOBS = JSON.parse(localStorage.AirlineOrderBaggageSelected);
    const AOOP = JSON.parse(localStorage.AirlineOrderOrderPerson);
    setShowLoading(true);
    if (AOPDCheck()) {
      let PaxDetailArray = new Array();
      AOPD.forEach((PaxDetail, indexItem) => {
        const PaxType =
          PaxDetail.PaxType === "Adult"
            ? 0
            : PaxDetail.PaxType === "Child"
            ? 1
            : PaxDetail.PaxType === "Infant"
            ? 2
            : 0;
        let PaxAddOnsDeparture =
          PaxType === 2
            ? { baggageDetailString: "", baggageString: "" }
            : {
                aoOrigin: ABDB.PreBookingData.SchDeparts[0].schOrigin,
                aoDestination: ABDB.PreBookingData.SchDeparts[0].schDestination,
                baggageDetailString:
                  (AOBS[0][indexItem] && AOBS[0][indexItem].desc) || "",
                baggageString:
                  (AOBS[0][indexItem] && AOBS[0][indexItem].code) || "",
                baggagePrice:
                  (AOBS[0][indexItem] && AOBS[0][indexItem].fare) || 0,
                meals: null,
                mealsDetail: null,
                mealsPrice: null,
              };
        let PaxAddOnsArrival = ABDB.PreBookingData.SchReturns
          ? PaxType === 2
            ? { baggageDetailString: "", baggageString: "" }
            : {
                aoOrigin: ABDB.PreBookingData.SchReturns[0].schOrigin,
                aoDestination: ABDB.PreBookingData.SchReturns[0].schDestination,
                baggageDetailString:
                  (AOBS[1][indexItem] && AOBS[1][indexItem].desc) || "",
                baggageString:
                  (AOBS[1][indexItem] && AOBS[1][indexItem].code) || "",
                baggagePrice:
                  (AOBS[1][indexItem] && AOBS[1][indexItem].fare) || 0,
                meals: null,
                mealsDetail: null,
                mealsPrice: null,
              }
          : null;
        let PaxAddOns = ABDB.PreBookingData.SchReturns
          ? [PaxAddOnsDeparture, PaxAddOnsArrival]
          : [PaxAddOnsDeparture];
        // if (AOBS[0][indexItem]) {
        //   PaxAddOns[0] = AOBS[0][indexItem]||'asd';
        //   if (AOBS[1][indexItem]) {
        //     PaxAddOns.push(AOBS[1][indexItem]||{});
        //   }
        // }
        const tempdata = {
          IDNumber: null,
          addOns: PaxAddOns,
          batikMilesNo: null,
          birthCountry: PaxDetail.PaxBirthCountry,
          birthDate: new Date(PaxDetail.PaxBirthDate).toISOString(),
          firstName: PaxDetail.PaxFirstName,
          gender: PaxDetail.PaxGender,
          lastName: PaxDetail.PaxLastName,
          nationality: PaxDetail.PaxNationality,
          parent: PaxDetail.PaxParent,
          passportExpiredDate:
            PaxDetail.PaxPassportExpiredDate === ""
              ? null
              : PaxDetail.PaxPassportExpiredDate,
          passportIssuedCountry:
            PaxDetail.PaxPassportIssuedCountry === ""
              ? null
              : PaxDetail.PaxPassportIssuedCountry,
          passportIssuedDate:
            PaxDetail.PaxPassportIssuedDate === ""
              ? null
              : PaxDetail.PaxPassportIssuedDate,
          passportNumber:
            PaxDetail.PaxPassportNumber === ""
              ? null
              : PaxDetail.PaxPassportNumber,
          garudaFrequentFlyer:
            PaxDetail.PaxGarudaFrequentFlyer === ""
              ? null
              : PaxDetail.PaxGarudaFrequentFlyer,
          title: PaxDetail.PaxTitle,
          type: PaxType,
        };
        PaxDetailArray.push(tempdata);
      });
      var MyHeaders = {
        appid: AppId,
        "Content-Type": "application/json",
        RequestVerificationToken: UserData.requestVerificationToken,
      };
      var MyData = JSON.stringify({
        PaxDetail: PaxDetailArray,
        XTKN: ABDB.PreBookingData.XTKN,
        accToken: UserData.accessToken,
      });
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("json");
        HTTP.post(MainUrl + "Airline/Booking", JSON.parse(MyData), MyHeaders)
          .then((res) => {
            if (res.status !== 200) {
              if (res.status === 401) {
                failedAlert(
                  "Session anda telah berakhir, lakukan login ulang terlebih dahulu"
                );
                logout();
              }
              alert("Periksa Koneksi anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            BookingSuccess(res);
          })
          .catch((err) => {
            failedAlert(JSON.stringify(err));
          });
      } else {
        fetch(MainUrl + "Airline/Booking", {
          method: "POST",
          headers: MyHeaders,
          body: MyData,
        })
          .then((r) => {
            if (r.ok) {
              return r.json();
            } else {
              if (r.status === 401) {
                failedAlert(
                  "Session anda telah berakhir, lakukan login ulang terlebih dahulu"
                );
                logout();
              }
              failedAlert("Periksa Koneksi Anda");
            }
          })
          .then((res) => {
            BookingSuccess(res);
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
          });
      }
    } else {
      failedAlert("Mohon Lengkapi Data terlebih dahulu");
    }
  };
  const BookingSuccess = (res) => {
    if (res.Data && res.Data.RespStatus === "OK") {
      setShowLoading(false);
      localStorage.setItem("AirlineBookingId", res.Data.Id);
      localStorage.setItem(
        "AirlineBaggageTotalPrice",
        (BaggageTotalPrice || 0).toString()
      );
      history.push("/airlinePayment");
    } else {
      failedAlert(res.ErrorMessage);
    }
  };
  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/airlineFlightInformation"></IonBackButton>
          </IonButtons>
          <IonTitle>Data Pesanan</IonTitle>
        </IonToolbar>
        <AirlineWizard WizardIndex={1}></AirlineWizard>
      </IonHeader>
      <IonContent fullscreen={true} className="AirlineOrder">
        {/* Login As */}
        <IonGrid className="white-bg ion-padding ion-margin-bottom">
          <IonRow>
            <IonCol size="2" className="avatar">
              <img src={UserData.photo || DefaultAva} alt="" />
            </IonCol>
            <IonCol>
              <div>
                <IonText>
                  <p className="ion-no-margin">Login sebagai {UserData.name}</p>
                </IonText>
                <IonText color="medium">
                  <p className="ion-no-margin"> {UserData.email}</p>
                </IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <AirlineOrderOrderPerson
          name={UserData.name}
          email={UserData.email}
        ></AirlineOrderOrderPerson>

        <AirlineOrderBuyerData
          UseLionOrBatik={UseLionOrBatik}
          UseGaruda={UseGaruda}
        ></AirlineOrderBuyerData>
        <AirlineOrderBaggage
          AOPB={AOPB}
          calculateBaggageAirlineTotal={(t) => {
            calculateBaggageAirlineTotal(t);
          }}
          // TourProductAddOnList={TourProductDetail.TourProductAddOnList}
          // TourBookingPriceTotal={TourBookingPriceTotal}
          // SetAddOnPrice={setAddOnPrice}
        ></AirlineOrderBaggage>
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
                      ? rupiah(ABDB.PriceData.SumFare + BaggageTotalPrice)
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
                  {ABDB &&
                  ABDB.PreBookingData &&
                  ABDB.PreBookingData.TripType === "RoundTrip"
                    ? "Pergi - Pulang"
                    : "Pergi"}
                </IonText>
              </IonCol>
              {/* Dewasa */}
              <IonCol
                size="6"
                hidden={
                  ABDB &&
                  ABDB.PreBookingData &&
                  ABDB.PreBookingData.PaxAdult > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {(ABDB &&
                    ABDB.PreBookingData &&
                    ABDB.PreBookingData.PaxAdult) ||
                    0}
                  {"x "}
                  Dewasa
                </IonText>
              </IonCol>
              <IonCol
                size="6"
                className="ion-text-right"
                hidden={
                  ABDB &&
                  ABDB.PreBookingData &&
                  ABDB.PreBookingData.PaxAdult > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {rupiah(
                    (ABDB &&
                      ABDB.PreBookingData &&
                      ABDB.PreBookingData.PaxAdult > 0 &&
                      ABDB.PreBookingData.PriceDetail[0].totalFare) ||
                      "0"
                  )}
                </IonText>
              </IonCol>
              {/* Anak-anak */}
              <IonCol
                size="6"
                hidden={
                  ABDB &&
                  ABDB.PreBookingData &&
                  ABDB.PreBookingData.PaxChild > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {(ABDB &&
                    ABDB.PreBookingData &&
                    ABDB.PreBookingData.PaxChild) ||
                    0}
                  {"x "}
                  Anak
                </IonText>
              </IonCol>
              <IonCol
                size="6"
                className="ion-text-right"
                hidden={
                  ABDB &&
                  ABDB.PreBookingData &&
                  ABDB.PreBookingData.PaxChild > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {rupiah(
                    (ABDB &&
                      ABDB.PreBookingData &&
                      ABDB.PreBookingData.PaxChild > 0 &&
                      ABDB.PreBookingData.PriceDetail[1].totalFare) ||
                      "0"
                  )}
                </IonText>
              </IonCol>
              {/* Bayi */}
              <IonCol
                size="6"
                hidden={
                  ABDB &&
                  ABDB.PreBookingData &&
                  ABDB.PreBookingData.PaxInfant > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {(ABDB &&
                    ABDB.PreBookingData &&
                    ABDB.PreBookingData.PaxInfant) ||
                    0}
                  {"x "}
                  Bayi
                </IonText>
              </IonCol>
              <IonCol
                size="6"
                className="ion-text-right"
                hidden={
                  ABDB &&
                  ABDB.PreBookingData &&
                  ABDB.PreBookingData.PaxInfant > 0
                    ? false
                    : true
                }
              >
                <IonText color="medium">
                  {rupiah(
                    (ABDB &&
                      ABDB.PreBookingData &&
                      ABDB.PreBookingData.PaxInfant > 0 &&
                      ABDB.PreBookingData.PriceDetail[2].totalFare) ||
                      "0"
                  )}
                </IonText>
              </IonCol>
              {/* Baggage */}
              <IonCol size="6">
                <IonText color="medium">Bagasi</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-right">
                <IonText color="medium">
                  {rupiah(BaggageTotalPrice || 0)}
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
                  onClick={() => submitBooking()}
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
    ABDB: state.airline.AirlineBookingDataBundle,
    AOPD: state.airline.AirlineOrderPassengersData,
    AOPB: state.airline.AirlineOrderPassengersBaggage,
  }),
  mapDispatchToProps: {
    logoutUser,
    loadAirlineBookingDataBundleData,
    loadAirlineOrderPassengersBaggage,
  },
  component: React.memo(withRouter(Order)),
});
