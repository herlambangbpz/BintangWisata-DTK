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
} from "@ionic/react";
import { Collapse } from "antd";
import { timeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { AppId, MainUrl } from "../../AppConfig";
import HotelPaymentChoosePayment from "../../components/Hotel/HotelPaymentChoosePayment";
import HotelWizard from "../../components/Hotel/HotelWizard";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { rupiah } from "../../helpers/currency";
import "./Order.scss";

const { Panel } = Collapse;
interface OwnProps {}
interface StateProps {
  UserData: any;
}
interface DispatchProps {}
interface OrderProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Order: React.FC<OrderProps> = ({ history, UserData }) => {
  const [HotelBookingData, setHotelBookingData] = useState<any>(
    localStorage.getItem("HotelBookingData")
      ? JSON.parse(localStorage.getItem("HotelBookingData") || "")
      : null
  );
  useEffect(() => {
    if (HotelBookingData) {
      createTimeLimit(HotelBookingData.payment_time_limit);
      getDetailOrder();
    }
  }, [HotelBookingData]);
  const [PaymentMethodSelected, setPaymentMethodSelected] = useState<any>(null);
  const [TimeLimit, setTimeLimit] = useState<string>("");
  const [HotelPanelData, setHotelPanelData] = useState<any>(null);

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
      product_category: "HotelBooking",
      payment_method: PaymentMethodSelected.Code,
      id_order: HotelBookingData.id_order,
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
      localStorage.setItem("HotelLastIdOrder", res.Data.id_order);
      history.push("/hotelComplete");
    } else {
      failedAlert("Ada Masalah Koneksi");
    }
  };
  const getDetailOrder = () => {
    var MyHeaders = {
      appid: AppId,
      "Content-Type": "application/json",
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = JSON.stringify({
      id_order: HotelBookingData.id_order,
      accToken: UserData.accessToken,
    });
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("json");
      HTTP.post(MainUrl + "Member/OrderDetail", JSON.parse(MyData), MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          getOrderDetailSuccess(res);
        })
        .catch((err) => {
          failedAlert(JSON.stringify(err));
        });
    } else {
      fetch(MainUrl + "Member/OrderDetail", {
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
          getOrderDetailSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };
  const getOrderDetailSuccess = (res) => {
    if (res.StatusCode === 200) {
      setHotelPanelData({
        HotelName: res.Data.bookDetail.hotelName || "",
        HotelAddress: res.Data.bookDetail.hotelAddress || "",
        CheckInDate: res.Data.bookDetail.checkInDate || "",
        CheckOutDate: res.Data.bookDetail.checkOutDate || "",
        RoomRequest: res.Data.bookDetail.roomRequest || "",
        TotalPrice: res.Data.bookDetail.totalPrice || 0,
      });
    } else {
      failedAlert("Ada Masalah Koneksi");
    }
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
            <IonBackButton defaultHref="/hotelSearch"></IonBackButton>
          </IonButtons>
          <IonTitle>Konfirmasi Pembayaran</IonTitle>
        </IonToolbar>
        <HotelWizard
          WizardIndex={2}
          HotelPanelData={HotelPanelData}
        ></HotelWizard>
      </IonHeader>
      <IonContent fullscreen={true} className="HotelOrder">
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
        <HotelPaymentChoosePayment
          UserData={UserData}
          setPaymentMethodSelected={(e: any) => {
            setPaymentMethodSelected(e);
          }}
        ></HotelPaymentChoosePayment>
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
                  <h6 className="ion-no-margin ion-no-padding">
                    {HotelBookingData && HotelBookingData.payment_amount
                      ? rupiah(HotelBookingData.payment_amount || 0)
                      : "Rp 0"}
                  </h6>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  className="text-transform-none"
                  size="large"
                  expand="block"
                  disabled={TimeLimit === "Expired"}
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
  }),
  mapDispatchToProps: {},
  component: React.memo(withRouter(Order)),
});
