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
import loadingLottie from "../../Lotties/loading_4463.json";
import { chevronDown, chevronUp, timeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { setTourPaymentAllowStatus } from "../../data/tour/tour.actions";
import "./Order.scss";
import HotelWizard from "../../components/Hotel/HotelWizard";
import { Collapse } from "antd";
import { loadAirlineBookingDataBundleData } from "../../data/airline/airline.actions";
import Lottie from "lottie-react";
import { AppId, MainUrl } from "../../AppConfig";
import { HTTP } from "@ionic-native/http";
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
  const [IdOrder, setIdOrder] = useState(
    localStorage.getItem("HotelLastIdOrder") || null
  );
  const [dataOrder, setDataOrder] = useState<any>(null);
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
  });
  useEffect(() => {
    if (IdOrder !== null) {
      getDetailOrder();
    } else {
      history.push("/airlineSearch");
    }
  }, [IdOrder]);
  const getDetailOrder = () => {
    var MyHeaders = {
      appid: AppId,
      "Content-Type": "application/json",
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = JSON.stringify({
      id_order: IdOrder,
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
      setDataOrder(res.Data);
      setHotelPanelData({
        HotelName: res.Data.bookDetail.hotelName || "",
        HotelAddress: res.Data.bookDetail.hotelAddress || "",
        CheckInDate: res.Data.bookDetail.checkInDate || "",
        CheckOutDate: res.Data.bookDetail.checkOutDate || "",
        RoomRequest: res.Data.bookDetail.roomRequest || "",
        TotalPrice: res.Data.bookDetail.totalPrice || 0,
      });
    } else {
      setDataOrder(null);
      failedAlert("Ada Masalah Koneksi");
    }
  };
  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/airlineSearch"></IonBackButton>
          </IonButtons>
          <IonTitle>Selesai</IonTitle>
        </IonToolbar>
        <HotelWizard
          WizardIndex={3}
          HotelPanelData={HotelPanelData}
        ></HotelWizard>
      </IonHeader>
      <IonContent fullscreen={true} className="gray-bg">
        <IonGrid
          className="white-bg ion-padding timer"
          hidden={dataOrder === null}
        >
          <IonRow>
            <IonCol size="4">
              <IonText>Kode Pesanan</IonText>
            </IonCol>
            <IonCol size="8" className="ion-text-right">
              <IonText color="primary">{IdOrder || ""}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="ion-margin" hidden={dataOrder === null}>
          <IonText>Rincian Pesanan</IonText>
        </div>
        <IonGrid
          className="white-bg ion-padding timer"
          hidden={dataOrder === null}
        >
          <IonRow>
            {/* Dewasa */}
            <IonCol
              size="6"
              hidden={
                ABDB && ABDB.PreBookingData && ABDB.PreBookingData.PaxAdult > 0
                  ? false
                  : true
              }
            >
              <IonText>
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
                ABDB && ABDB.PreBookingData && ABDB.PreBookingData.PaxAdult > 0
                  ? false
                  : true
              }
            >
              <IonText>
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
                ABDB && ABDB.PreBookingData && ABDB.PreBookingData.PaxChild > 0
                  ? false
                  : true
              }
            >
              <IonText>
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
                ABDB && ABDB.PreBookingData && ABDB.PreBookingData.PaxChild > 0
                  ? false
                  : true
              }
            >
              <IonText>
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
                ABDB && ABDB.PreBookingData && ABDB.PreBookingData.PaxInfant > 0
                  ? false
                  : true
              }
            >
              <IonText>
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
                ABDB && ABDB.PreBookingData && ABDB.PreBookingData.PaxInfant > 0
                  ? false
                  : true
              }
            >
              <IonText>
                {rupiah(
                  (ABDB &&
                    ABDB.PreBookingData &&
                    ABDB.PreBookingData.PaxInfant > 0 &&
                    ABDB.PreBookingData.PriceDetail[2].totalFare) ||
                    "0"
                )}
              </IonText>
            </IonCol>
            <IonCol size="6">
              <IonText>Total Pembayaran</IonText>
            </IonCol>
            <IonCol size="6" className="ion-text-right">
              <IonText>
                {rupiah(
                  (dataOrder &&
                    dataOrder.paymentDetail &&
                    dataOrder.paymentDetail.paymentAmount) ||
                    "0"
                )}
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* <IonGrid
          className="white-bg ion-padding ion-margin-bottom timer"
          hidden={dataOrder === null}
        >
          {dataOrder !== null &&
          dataOrder.Passengers &&
          dataOrder.Passengers.length > 0
            ? dataOrder.map((item, index) => (
                <IonRow>
                  <IonCol size="6">
                    <IonText>{item.type}</IonText>
                  </IonCol>
                  <IonCol size="6" className="ion-text-right">
                    <IonText color="primary">{IdOrder || ""}</IonText>
                  </IonCol>
                </IonRow>
              ))
            : ""}
        </IonGrid> */}
        <Lottie animationData={loadingLottie} hidden={dataOrder !== null} />
        <IonButton
          routerLink="/main/transactionList"
          expand="block"
          className="text-transform-none ion-margin"
          size="large"
        >
          Cek Status Pembayaran
        </IonButton>
        <IonButton
          routerLink="/main/index"
          color="white"
          expand="block"
          className="text-transform-none ion-margin btn-outline-primary"
          size="large"
        >
          Kembali ke Beranda
        </IonButton>
      </IonContent>
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
