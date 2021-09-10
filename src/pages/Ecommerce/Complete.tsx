import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonToolbar,
  IonCard,
  IonButton,
  IonPage,
  IonHeader,
  IonRow,
  IonGrid,
  IonTitle,
  IonCol,
  IonText,
  IonLoading,
  IonAlert,
  IonIcon,
  IonSpinner,
  isPlatform,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import "./Complete.scss";
import * as selectors from "../../data/selectors";

import ModalTourDetail from "../../components/ModalTourDetail";
import { AppId, MainUrl } from "../../AppConfig";
import { cSharpDateHourCovert } from "../../helpers/datetime";
import { HTTP } from "@ionic-native/http";
// import TourWizard from '../../components/TourWizard';
interface OwnProps {}
interface StateProps {
  TourBookingNumberOfAdult?: number;
  TourBookingNumberOfChild?: number;
  TourBookingNumberOfInfant?: number;
  TourBookingPriceTotal?: number;
  TourProductDetail?: any;
  TourProductPricingIndex?: number;
  TourProductStartDate?: string;
  TourBookingNumberOfPaxTotal?: number;
  UserData: any;
}
interface DispatchProps {}
interface TourCompleteProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const TourComplete: React.FC<TourCompleteProps> = ({
  history,
  TourBookingPriceTotal,
  TourProductStartDate,
  TourProductDetail,
  TourProductPricingIndex,
  TourBookingNumberOfPaxTotal,
  UserData,
}) => {
  const [showModalTourDetail, setShowModalTourDetail] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  const [TourCompleteData, setTourCompleteData] = useState<any>(null);

  const [TimeLimit, setTimeLimit] = useState<string>("");
  React.useEffect(() => {
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = new FormData();
    MyData.append("AccToken", UserData.accessToken);
    MyData.append("booking_code", localStorage.TourOrderBookingCode);
    // MyData.append("payment_type",
    // TourProductDetail.TourProductModels.ProductTourCategory==='Regular'?'100%':
    // paymentRepaymentMethod===2?'50%':'100%');
    if (isPlatform("cordova")) {
      HTTP.get(
        MainUrl + "tour/Payment",
        {
          id: localStorage.TourOrderBookingCode,
          AccToken: UserData.accessToken,
        },
        MyHeaders
      )
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            createTimeLimit(res.Data.BookingLimit);
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        });
    } else {
      fetch(
        MainUrl +
          "tour/complete?id=" +
          localStorage.TourOrderBookingCode +
          "&AccToken=" +
          UserData.accessToken,
        {
          method: "GET",
          headers: MyHeaders,
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            failedAlert("Periksa Koneksi Anda");
          }
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            createTimeLimit(res.Data.BookingLimit);
            setTourCompleteData(res.Data);
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        });
    }
  }, []);
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const createTimeLimit = (BookingLimit) => {
    const BookingTimeLimit = new Date(
      parseInt(BookingLimit.replace(/[^0-9 +]/g, ""))
    ).getTime();

    const x = setInterval(function () {
      const now = new Date().getTime();
      const distance = BookingTimeLimit - now;
      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      setTimeLimit(`${hours}:${minutes}:${seconds}`);

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
          <IonTitle>Selesai</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="TourOrder">
        {/* Wizard Header */}
        <IonGrid className="wizardHeader">
          <IonRow>
            <IonCol className="ion-text-center col-disable">
              <IonText color="light">
                <span>1</span> Pesan
              </IonText>
            </IonCol>
            <IonCol size="1" className="ion-text-center">
              <IonText color="light">--</IonText>
            </IonCol>
            <IonCol className="ion-text-center col-disable">
              <IonText color="light">
                <span>2</span> Bayar
              </IonText>
            </IonCol>
            <IonCol size="1" className="ion-text-center">
              <IonText color="light">--</IonText>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonText color="light">
                <span>3</span> Selesai
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="timeLimitPayment">
          <IonText color="light">Time Limit Pembayaran</IonText>
          <br />
          <IonText color="light">
            <b>
              {TourCompleteData !== null ? (
                cSharpDateHourCovert(TourCompleteData.BookingLimit)
              ) : (
                <IonSpinner name="dots" color="light" />
              )}
            </b>
          </IonText>
          <br />
          <span>
            <b>{TimeLimit || <IonSpinner name="dots" color="primary" />}</b>
          </span>
        </div>
        <IonText class="ion-padding" color="dark">
          <small>Rincian Pesanan</small>
        </IonText>
        <IonGrid className="white-bg ion-padding ion-margin-top">
          <IonRow>
            <IonCol>
              <IonText>Kode Pesanan</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText color="primary" className="copyText">
                <small>salin </small>
              </IonText>
              <IonText>
                {TourCompleteData !== null
                  ? localStorage.TourOrderBookingCode
                  : ""}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>Metode Pembayaran</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText>Mandiri Virtual Account</IonText>
            </IonCol>
          </IonRow>
          <IonRow class="ion-align-items-center">
            <IonCol>
              <IonText>Nomor</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText color="primary" className="copyText">
                <small>salin </small>
              </IonText>
              <IonText>892032231555656</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>Jumlah yang dibayar</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText color="primary" className="copyText">
                <small>salin </small>
              </IonText>
              <IonText>Rp 20.900.000</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton
          routerLink="/transactionHistoryList"
          expand="block"
          className="text-transform-none ion-margin"
          size="large"
        >
          Cek Status Pembayaran
        </IonButton>
        <IonButton
          routerLink="/main/index"
          expand="block"
          className="text-transform-none ion-margin btn-outline-primary"
          size="large"
        >
          Kembali ke beranda
        </IonButton>
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
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    TourBookingNumberOfAdult: state.tour.TourBookingNumberOfAdult,
    TourBookingNumberOfChild: state.tour.TourBookingNumberOfChild,
    TourBookingNumberOfInfant: state.tour.TourBookingNumberOfInfant,
    TourBookingNumberOfPaxTotal: state.tour.TourBookingNumberOfPaxTotal,
    TourBookingPriceTotal: state.tour.TourBookingPriceTotal,
    TourProductDetail: state.tour.TourProductDetail,
    TourProductPricingIndex: state.tour.TourProductPricingIndex,
    TourProductStartDate: state.tour.TourProductStartDate,
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: React.memo(withRouter(TourComplete)),
});
