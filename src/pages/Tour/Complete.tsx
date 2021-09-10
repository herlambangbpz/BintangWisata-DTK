import { HTTP } from "@ionic-native/http";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import Lottie from "lottie-react";
import React, { useState } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import TourCompleteTransfer from "../../components/TourCompleteTransfer";
import TourCompleteCash from "../../components/TourCompleteCash";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { AppId, MainUrl } from "../../AppConfig";
import loadingLottie from "../../Lotties/loading_4463.json";
import "./Complete.scss";

interface OwnProps {}
interface StateProps {
  UserData: any;
}
interface DispatchProps {}
interface TourCompleteProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const TourComplete: React.FC<TourCompleteProps> = ({ history, UserData }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  const [TourCompleteData, setTourCompleteData] = useState<any>(null);
  const [TourCompletePaymentMethod, setTourCompletePaymentMethod] =
    useState<any>(null);
  const [TourCompletePaidAmount, setTourCompletePaidAmount] =
    useState<number>(0);
  const [TourCompletBookingGuestList, setTourCompletBookingGuestList] =
    useState<any>({
      AdultPax: 0,
      ChildPax: 0,
      InfantPax: 0,
      AdultPrice: 0,
      ChildPrice: 0,
      InfantPrice: 0,
    });

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
        MainUrl + "tour/complete",
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
            SuccessGetTourComplete(res.Data);
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        })
        .catch((res) => {
          alert(res.error);
          alert(JSON.stringify(res.error));
          alert(JSON.stringify(res));
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
            SuccessGetTourComplete(res.Data);
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        });
    }
  }, []);
  const SuccessGetTourComplete = (TCD: any) => {
    // if (TCD.tourBookingProductModels.TourBookingType !== "Series") {
    //   createTimeLimit(TCD.BookingLimit);
    // }
    // Must Find The Answer
    // if (TCD.tourBookingProductModels.TourBookingType !== "Series") {
    createTimeLimit(TCD.BookingLimit);
    // }
    setTourCompleteData(TCD);
    if (TCD.paymentData && TCD.paymentData.length > 0) {
      setTourCompletePaymentMethod(TCD.paymentData[0].method);
      setTourCompletePaidAmount(TCD.paymentData[0].PaidAmount);
    }
    if (TCD.tourBookingGuestList && TCD.tourBookingGuestList.length > 0) {
      let AdultPax = 0,
        ChildPax = 0,
        InfantPax = 0;
      let AdultPrice = 0,
        ChildPrice = 0,
        InfantPrice = 0;
      TCD.tourBookingGuestList.forEach((data) => {
        if (data.TourBookingGuestMaturity === "Adult") {
          AdultPax = AdultPax + 1;
          AdultPrice = data.TourBookingGuestAgentPrice;
        }
        if (data.TourBookingGuestMaturity === "Child") {
          ChildPax = ChildPax + 1;
          ChildPrice = data.TourBookingGuestAgentPrice;
        }
        if (data.TourBookingGuestMaturity === "Infant") {
          InfantPax = InfantPax + 1;
          InfantPrice = data.TourBookingGuestAgentPrice;
        }
      });
      setTourCompletBookingGuestList({
        AdultPax: AdultPax,
        ChildPax: ChildPax,
        InfantPax: InfantPax,
        AdultPrice: AdultPrice,
        ChildPrice: ChildPrice,
        InfantPrice: InfantPrice,
      });
    }
  };
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
    console.log(BookingTimeLimit);

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
  return TourCompletePaymentMethod !== null ? (
    TourCompletePaymentMethod === "" ? (
      <Redirect to="/tour"></Redirect>
    ) : TourCompletePaymentMethod !== "CASH" ? (
      <TourCompleteTransfer
        TourCompleteData={TourCompleteData}
        TourCompletePaidAmount={TourCompletePaidAmount}
        showLoading={showLoading}
        headerAlert={headerAlert}
        showAlert={showAlert}
        messageAlert={messageAlert}
        setShowAlert={setShowAlert}
        TimeLimit={TimeLimit}
      ></TourCompleteTransfer>
    ) : (
      <TourCompleteCash
        TourCompletBookingGuestList={TourCompletBookingGuestList}
        TourCompleteData={TourCompleteData}
        TourCompletePaidAmount={TourCompletePaidAmount}
        showLoading={showLoading}
        headerAlert={headerAlert}
        showAlert={showAlert}
        messageAlert={messageAlert}
        setShowAlert={setShowAlert}
      ></TourCompleteCash>
    )
  ) : (
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
        <Lottie animationData={loadingLottie} />
      </IonContent>
    </IonPage>
  );
};
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: React.memo(withRouter(TourComplete)),
});
