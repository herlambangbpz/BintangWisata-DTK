import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonBackButton,
  IonButtons,
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
import { chevronBackOutline } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useParams } from "react-router-dom";
import TourDetail from "../../components/TourTransactionHistoryDetail/TourDetail";
import TransactionManage from "../../components/TourTransactionHistoryDetail/TransactionManage";
import DetailCard from "../../components/TourTransactionHistoryDetail/DetailCard";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { AppId, MainUrl } from "../../AppConfig";
import "./HistoryList.scss";
import { AppName } from "../../AppConfig";
interface OwnProps {}
interface StateProps {
  UserData: any;
}
interface DispatchProps {}
interface BookingRegularProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const BookingRegular: React.FC<BookingRegularProps> = ({
  history,
  UserData,
}) => {
  const parameters: any = useParams();

  const [TransactionHistoryDetail, setTransactionHistoryDetail] =
    useState<any>(null);

  const [AdultPaxTotal, setAdultPaxTotal] = useState<number>(0);
  const [ChildPaxTotal, setChildPaxTotal] = useState<number>(0);
  const [InfantPaxTotal, setInfantPaxTotal] = useState<number>(0);
  const [AdultPrice, setAdultPrice] = useState<number>(0);
  const [ChildPrice, setChildPrice] = useState<number>(0);
  const [InfantPrice, setInfantPrice] = useState<number>(0);

  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  React.useState(() => {
    setTransactionHistoryDetail(null);
    var MyData = new FormData();
    MyData.append("AccToken", UserData.accessToken);
    MyData.append("id_order", parameters.inv.replace(/-/g, "."));
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "Member/OrderDetail", MyData, {
        appid: AppId,
        RequestVerificationToken: UserData.requestVerificationToken,
      })
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Cek Koneksi Internet Anda");
            // history.push('/transactionHistoryList')
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            setTransactionHistoryDetail(res.Data);
            res.Data.guestModels.forEach((item) => {
              if (item.TourBookingGuestMaturity === "Adult") {
                setAdultPaxTotal(AdultPaxTotal + 1);
                setAdultPrice(item.TourBookingGuestPrice);
              } else if (item.TourBookingGuestMaturity === "Child") {
                setChildPaxTotal(ChildPaxTotal + 1);
                setChildPrice(item.TourBookingGuestPrice);
              } else if (item.TourBookingGuestMaturity === "Infant") {
                setInfantPaxTotal(InfantPaxTotal + 1);
                setInfantPrice(item.TourBookingGuestPrice);
              }
            });
          } else {
            failedAlert("Data Histori Transaksi tidak ditemukan");
            // history.push('/transactionHistoryList')
          }
        })
        .catch((e) => {
          failedAlert(e.error);
          // history.push('/transactionHistoryList')
        });
    } else {
      fetch(MainUrl + "Member/OrderDetail", {
        method: "POST",
        body: MyData,
        headers: {
          appid: AppId,
          RequestVerificationToken: UserData.requestVerificationToken,
        },
      })
        // Check Connection
        .then((res) => {
          if (!res.ok) {
            failedAlert("Periksa Koneksi anda");
            history.push("/transactionHistoryList");
          }
          return res.json();
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            setTransactionHistoryDetail(res.Data);
            res.Data.guestModels.forEach((item) => {
              if (item.TourBookingGuestMaturity === "Adult") {
                setAdultPaxTotal(AdultPaxTotal + 1);
                setAdultPrice(item.TourBookingGuestPrice);
              } else if (item.TourBookingGuestMaturity === "Child") {
                setChildPaxTotal(ChildPaxTotal + 1);
                setChildPrice(item.TourBookingGuestPrice);
              } else if (item.TourBookingGuestMaturity === "Infant") {
                setInfantPaxTotal(InfantPaxTotal + 1);
                setInfantPrice(item.TourBookingGuestPrice);
              }
            });
          } else {
            failedAlert("Data Histori Transaksi tidak ditemukan");
            history.push("/transactionHistoryList");
          }
        })
        .catch((e) => {
          failedAlert("Data Histori Transaksi tidak ditemukan");
          history.push("/transactionHistoryList");
        });
    }
  });

  const failedAlert = (errorMessage: string) => {
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  if (TransactionHistoryDetail !== null) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary" className="">
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/transactionHistoryList"
                icon={chevronBackOutline}
              ></IonBackButton>
            </IonButtons>
            <IonTitle className="ion-no-padding">
              {TransactionHistoryDetail.ProductTourName}
            </IonTitle>
            <IonTitle className="ion-sub-title ion-no-padding">
              No. Pesanan: {TransactionHistoryDetail.TourBookingCode}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true} className="gray-bg">
          <DetailCard
            TransactionHistoryDetail={TransactionHistoryDetail}
            AdultPaxTotal={AdultPaxTotal}
            ChildPaxTotal={ChildPaxTotal}
            InfantPaxTotal={InfantPaxTotal}
            AdultPrice={AdultPrice}
            ChildPrice={ChildPrice}
            InfantPrice={InfantPrice}
          ></DetailCard>
          <TourDetail
            TransactionHistoryDetail={TransactionHistoryDetail}
          ></TourDetail>
          <TransactionManage
            Status={TransactionHistoryDetail.TourBookingStatus}
          ></TransactionManage>
          <p>
            <br />
          </p>
          <IonText className="ion-margin">
            <small>
              <b>Hubungi {AppName}</b>
            </small>
          </IonText>
          <IonGrid className="ion-margin-top white-bg ion-padding ion-margin-bottom">
            <IonRow className="ion-align-items-center">
              <IonCol size="12">
                <IonText>
                  <small>No. Pesanan</small>
                </IonText>
              </IonCol>
              <IonCol size="12">
                <p color="medium">
                  <small>
                    Customer service kami akan menanyakan No. Pesanan tersebut
                    saat Anda menghubungi kami
                  </small>
                </p>
              </IonCol>
              <IonCol size="12">
                <IonText color="primary">
                  <b>HUBUNGI KAMI</b>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
          <p>
            <br />
          </p>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            cssClass="alert"
            header={headerAlert}
            message={messageAlert}
            buttons={["OK"]}
          />
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <div className="loadingData">
        <img src="assets/icon/loading.svg" width="80px" />
        <br />
        Memuat Detail Transaksi
      </div>
    );
  }
};
export default connect<BookingRegularProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: withRouter(BookingRegular),
});
