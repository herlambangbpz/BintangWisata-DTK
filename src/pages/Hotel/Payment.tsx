import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonRippleEffect,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonViewDidEnter,
} from "@ionic/react";

import { chevronDown, chevronUp, timeOutline } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { setTourPaymentAllowStatus } from "../../data/tour/tour.actions";
import "./Order.scss";
import AirlineWizard from "../../components/Airline/AirlineWizard";
import AirlinePaymentChoosePayment from "../../components/Airline/AirlinePaymentChoosePayment";
import AirlinePaymentVoucherCode from "../../components/Airline/AirlinePaymentVoucherCode";
import { Collapse } from "antd";
import { AppId, MainUrl } from "../../AppConfig";
import { HTTP } from "@ionic-native/http";
import { loadAirlineBookingDataBundleData } from "../../data/airline/airline.actions";
import { rupiah } from "../../helpers/currency";
const { Panel } = Collapse;
interface OwnProps {}
interface StateProps {
  UserData: any;
  ABDB: any;
}
interface DispatchProps {
  loadAirlineBookingDataBundleData: typeof loadAirlineBookingDataBundleData;
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
  loadAirlineBookingDataBundleData,
}) => {
  const [hiddenDetailPrice, setHiddenDetailPrice] = useState(true);
  const [hiddenDetailPriceChevronUp, setHiddenDetailPriceChevronUp] =
    useState(false);
  const [hiddenDetailPriceChevronDown, setHiddenDetailPriceChevronDown] =
    useState(true);
  const [PaymentMethodSelected, setPaymentMethodSelected] = useState<any>(null);
  const [TimeLimit, setTimeLimit] = useState<string>("");
  const [BaggageTotalPrice, setBaggageTotalPrice] = useState<any>(null);

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
  useIonViewDidEnter(() => {
    bookDetail();
    loadAirlineBookingDataBundleData();
    const btp = localStorage.getItem("AirlineBaggageTotalPrice");
    setBaggageTotalPrice(btp ? parseInt(btp) : 0);
  });
  const bookDetail = () => {
    setShowLoading(true);
    var MyHeaders = {
      appid: AppId,
      "Content-Type": "application/json",
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = JSON.stringify({
      Id: localStorage.getItem("AirlineBookingId"),
      accToken: UserData.accessToken,
    });
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("json");
      HTTP.post(
        MainUrl + "Member/AirlineBookingDetail",
        JSON.parse(MyData),
        MyHeaders
      )
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          BookDetailSuccess(res);
        })
        .catch((err) => {
          failedAlert(JSON.stringify(err));
        });
    } else {
      fetch(MainUrl + "Member/AirlineBookingDetail", {
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
          BookDetailSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };
  const submitPayment = () => {
    setShowLoading(true);
    if (PaymentMethodSelected === null) {
      failedAlert("Pilih metode pembayaran terlebih dahulu");
      return false;
    }
    var MyHeaders = {
      appid: AppId,
      "Content-Type": "application/json",
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = JSON.stringify({
      product_category: "flightTicket",
      payment_method: PaymentMethodSelected.Code,
      id_order: localStorage.getItem("AirlineTransactionID"),
      accToken: UserData.accessToken,
    });
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("json");
      HTTP.post(
        MainUrl + "Payment/paymentProceed",
        JSON.parse(MyData),
        MyHeaders
      )
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          SubmitSuccess(res);
        })
        .catch((err) => {
          failedAlert(JSON.stringify(err));
        });
    } else {
      fetch(MainUrl + "Payment/paymentProceed", {
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
          SubmitSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };
  const SubmitSuccess = (res) => {
    if (res.StatusCode === 200) {
      setShowLoading(false);
      localStorage.setItem("AirlineLastIdOrder", res.Data.id_order);
      history.push("/airlineComplete");
    } else {
      failedAlert("Ada Masalah Koneksi");
    }
  };
  const BookDetailSuccess = (res) => {
    setShowLoading(false);
    createTimeLimit(res.PaymentLimit);
    localStorage.setItem("AirlineTransactionID", res.TransactionID);
  };
  const createTimeLimit = (PaymentLimit) => {
    const BookingTimeLimit = new Date(PaymentLimit).getTime();
    const x = setInterval(function () {
      const now = new Date().getTime();
      const distance = BookingTimeLimit - now;
      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      // const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      setTimeLimit(`${hours} jam ${minutes} menit`);
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        setTimeLimit(`Expired`);
      }
    }, 1000);
    setShowLoading(false);
  };
  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/airlineSearch"></IonBackButton>
          </IonButtons>
          <IonTitle>Konfirmasi Pembayaran</IonTitle>
        </IonToolbar>
        <AirlineWizard WizardIndex={2}></AirlineWizard>
      </IonHeader>
      <IonContent fullscreen={true} className="AirlineOrder">
        <IonGrid className="orange-bg ion-padding ion-margin-bottom timer">
          <IonRow>
            <IonCol size="2" className="avatar">
              <IonIcon icon={timeOutline} size="large" color="light"></IonIcon>
            </IonCol>
            <IonCol>
              <div>
                <IonText color="light">
                  <p>
                    <small>Selesaikan pembayaran dalam {TimeLimit}</small>
                    {/* <small>Selesaikan pembayaran dalam {"5 menit"}</small> */}
                  </p>
                </IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <AirlinePaymentChoosePayment
          UserData={UserData}
          setPaymentMethodSelected={(e: any) => {
            setPaymentMethodSelected(e);
          }}
        ></AirlinePaymentChoosePayment>
        {/* <AirlinePaymentVoucherCode></AirlinePaymentVoucherCode> */}
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
                      ? rupiah(
                          ABDB.PriceData.SumFare +
                            BaggageTotalPrice +
                            ((PaymentMethodSelected &&
                              PaymentMethodSelected.Fee) ||
                              0)
                        )
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
              <IonCol size="6">
                <IonText color="medium">Admin Fee</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-right">
                <IonText color="medium">
                  {rupiah(
                    (PaymentMethodSelected && PaymentMethodSelected.Fee) || 0
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
            <IonRow>
              <IonCol>
                <IonButton
                  className="text-transform-none"
                  size="large"
                  expand="block"
                  // onClick={() => Pay()}
                  onClick={() => submitPayment()}
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
  }),
  mapDispatchToProps: {
    loadAirlineBookingDataBundleData,
  },
  component: React.memo(withRouter(Order)),
});
