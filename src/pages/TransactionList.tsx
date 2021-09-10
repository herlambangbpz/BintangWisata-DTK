import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  isPlatform,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { connect } from "../data/connect";
import "./TransactionList.scss";
import { RouteComponentProps, withRouter } from "react-router";
import { Icon } from "ionicons/dist/types/components/icon/icon";
import { newspaper, ellipsisVertical } from "ionicons/icons";
import { HTTP } from "@ionic-native/http";
import { AppId, MainUrl } from "../AppConfig";
import TransactionHistoryItem from "../components/TransactionHistoryItem";
import { Helmet } from "react-helmet";

interface OwnProps {}
interface StateProps {}

interface DispatchProps {}

interface TransactionListProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const TransactionList: React.FC<TransactionListProps> = ({ history }) => {
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const [showAlert, setShowAlert] = useState(false);
  const [ActiveTransaction, setActiveTransaction] = useState<any>("pending");

  React.useEffect(() => {
    if (history.location.pathname !== "/main/transactionList") {
      return;
    }
    if (isPlatform("cordova")) {
      HTTP.get(MainUrl + "/member/ActiveOrder", {}, { appid: AppId })
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            // createTimeLimit(res.Data.BookingLimit)
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    } else {
      fetch(MainUrl + "member/ActiveOrder", {
        method: "GET",
        headers: { appid: AppId },
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            failedAlert("Periksa Koneksi Anda");
          }
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            if (res.Data.length > 0) {
              setActiveTransaction(res.Data);
            } else {
              setActiveTransaction(null);
            }
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  }, [history.location.pathname]);
  const failedAlert = (errorMessage: string) => {
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      {/* <Helmet>
        <link
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css"
          }
          rel="stylesheet"
          type="text/css"
        />
        <link
          href={"https://staging.doku.com/doku-js/assets/css/doku.css"}
          rel="stylesheet"
          type="text/css"
        />
      </Helmet> */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/transactionHistoryList")}>
              <IonIcon icon={newspaper} size="large"></IonIcon>
            </IonButton>
            {/* <IonButton>
              <IonIcon icon={ellipsisVertical} size="large"></IonIcon>
            </IonButton> */}
          </IonButtons>
          <IonTitle>Pesanan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} className="transaction-list">
        <div
          className="no-transaction ion-text-center"
          hidden={ActiveTransaction === "pending" ? false : true}
        >
          <p>Sedang Menarik Data...</p>
        </div>
        <div
          className="no-transaction ion-text-center"
          hidden={ActiveTransaction === null ? false : true}
        >
          <p>Tidak ada pesanan</p>
        </div>
        <IonGrid
          className="serachTourList ion-no-padding"
          hidden={
            ActiveTransaction !== null && ActiveTransaction !== "pending"
              ? false
              : true
          }
        >
          <IonRow className="ion-margin-bottom ">
            <IonCol size="12" className="ion-padding ion-pb-80">
              {ActiveTransaction !== null && ActiveTransaction !== "pending"
                ? ActiveTransaction.map(
                    (transaction: any, transactionIndex: any) => {
                      return (
                        <TransactionHistoryItem
                          key={transactionIndex}
                          TransactionID={transaction.transactionID}
                          ProductCategory={transaction.productCategory}
                          TransactionCode={transaction.transactionCode}
                          Price={transaction.price}
                          ProductName={transaction.productName}
                          Status={transaction.status}
                          BuyingDate={transaction.buyingDate}
                        />
                      );
                    }
                  )
                : ""}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton
          expand="block"
          color="primary"
          className="ion-margin"
          size="large"
          routerLink="/main/index"
          class="no-shadow"
        >
          MULAI MEMESAN
        </IonButton>
        <IonButton
          expand="block"
          color="light"
          className="ion-margin"
          size="large"
          onClick={() => {
            history.push("/transactionHistoryList");
          }}
        >
          Lihat Riwayat Pesanan
        </IonButton>
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

export default connect<OwnProps, StateProps, DispatchProps>({
  component: React.memo(withRouter(TransactionList)),
});
