import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { chevronBackOutline, person } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useParams } from "react-router-dom";
import TourDetail from "../../components/TourTransactionHistoryDetail/TourDetail";
import TransactionManage from "../../components/TourTransactionHistoryDetail/TransactionManage";
import DetailCardFlightticket from "../../components/TourTransactionHistoryDetail/DetailCardFlightticket";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { AppId, MainUrl } from "../../AppConfig";
import "./HistoryDetailFlightticket.scss";
import { getHistoryTransactionIcon } from "../../helpers/HistoryTransaction";
import { cSharpDateHourCovert } from "../../helpers/datetime";
import { AppName } from "../../AppConfig";
interface OwnProps {}
interface StateProps {
  UserData: any;
}
interface DispatchProps {}
interface HistoryDetailFlightticketProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const HistoryDetailFlightticket: React.FC<HistoryDetailFlightticketProps> = ({
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

  const getOrderDetail = () => {
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
          getOrderDetailSuccess(res);
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
          getOrderDetailSuccess(res);
        })
        .catch((e) => {
          failedAlert("Data Histori Transaksi tidak ditemukan");
          history.push("/transactionHistoryList");
        });
    }
  };
  const getOrderDetailSuccess = (res: any) => {
    if (res.StatusCode === 200) {
      setTransactionHistoryDetail(res.Data);
      res.Data.Passengers.forEach((item) => {
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
  };
  React.useState(() => {
    setTransactionHistoryDetail(null);
    getOrderDetail();
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
              {TransactionHistoryDetail.Origin} -{" "}
              {TransactionHistoryDetail.Destination}
            </IonTitle>
            <IonTitle className="ion-sub-title ion-no-padding">
              No. Pesanan: {TransactionHistoryDetail.BookingCode}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true} className="gray-bg">
          <DetailCardFlightticket
            TransactionHistoryDetail={TransactionHistoryDetail}
            AdultPaxTotal={AdultPaxTotal}
            ChildPaxTotal={ChildPaxTotal}
            InfantPaxTotal={InfantPaxTotal}
            AdultPrice={AdultPrice}
            ChildPrice={ChildPrice}
            InfantPrice={InfantPrice}
          ></DetailCardFlightticket>
          <IonText className="ion-margin">
            <small>
              <b>Data Penerbangan</b>
            </small>
          </IonText>
          <IonGrid className="ion-margin-top white-bg ion-padding ion-margin-bottom">
            <IonRow className="ion-align-items-center">
              <IonCol size="2">
                <img
                  src={getHistoryTransactionIcon("flightticket")}
                  alt=""
                  width="50%"
                  className="ion-mt-16 ion-mb-16"
                />
              </IonCol>
              <IonCol size="10">
                <IonText>
                  {TransactionHistoryDetail.Origin} -{" "}
                  {TransactionHistoryDetail.Destination}
                </IonText>
                <br />
                <IonText color="medium">
                  <small>
                    {TransactionHistoryDetail.Airline +
                      " - " +
                      cSharpDateHourCovert(TransactionHistoryDetail.DepartDate)}
                  </small>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonText className="ion-margin">
            <small>
              <b>Data Penumpang </b>
            </small>
          </IonText>
          {TransactionHistoryDetail.Passengers.map((item, index) => (
            <IonGrid
              className="ion-margin-top white-bg ion-padding ion-margin-bottom"
              key={index}
            >
              <IonRow className="ion-align-items-center">
                <IonCol size="1">
                  <IonIcon icon={person} color="medium"></IonIcon>
                </IonCol>
                <IonCol size="11">
                  <IonText>
                    {item.Title}. {item.Name}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          ))}
          {TransactionHistoryDetail.Passengers.map((item, index) => (
            <IonGrid
              className="ion-margin-top white-bg ion-padding ion-margin-bottom"
              key={index}
            >
              <IonRow className="ion-align-items-center">
                <IonCol size="1">
                  <IonIcon icon={person} color="medium"></IonIcon>
                </IonCol>
                <IonCol size="11">
                  <IonText>
                    {item.Title}. {item.Name}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          ))}
          {TransactionHistoryDetail.Passengers.map((item, index) => (
            <IonGrid
              className="ion-margin-top white-bg ion-padding ion-margin-bottom"
              key={index}
            >
              <IonRow className="ion-align-items-center">
                <IonCol size="1">
                  <IonIcon icon={person} color="medium"></IonIcon>
                </IonCol>
                <IonCol size="11">
                  <IonText>
                    {item.Title}. {item.Name}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          ))}
          {/* <TourDetail
            TransactionHistoryDetail={TransactionHistoryDetail}
          ></TourDetail>
          <TransactionManage
            Status={TransactionHistoryDetail.TourBookingStatus}
          ></TransactionManage> */}
          <IonText
            className="ion-margin"
            hidden={TransactionHistoryDetail.TicketStatus !== "booked"}
          >
            <small>
              <b>Pembayaran</b>
            </small>
          </IonText>
          <IonGrid
            className="ion-margin-top white-bg ion-padding ion-margin-bottom"
            hidden={TransactionHistoryDetail.TicketStatus !== "booked"}
          >
            <IonRow className="ion-align-items-center">
              <IonCol size="9">
                <IonText>
                  <small>
                    {TransactionHistoryDetail.paymentDetail &&
                      TransactionHistoryDetail.paymentDetail.paymentMethod}{" "}
                    :{" "}
                    {TransactionHistoryDetail.paymentDetail &&
                      TransactionHistoryDetail.paymentDetail.paymentCode}
                  </small>
                </IonText>
              </IonCol>
              <IonCol size="3" className="ion-text-right">
                <CopyToClipboard
                  text={
                    TransactionHistoryDetail.paymentDetail &&
                    TransactionHistoryDetail.paymentDetail.paymentCode
                  }
                  onCopy={() => alert("Berhasil menyalin kode")}
                >
                  <IonText color="primary">
                    <small>Salin Kode</small>
                  </IonText>
                </CopyToClipboard>
              </IonCol>
            </IonRow>
          </IonGrid>
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
export default connect<HistoryDetailFlightticketProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: withRouter(HistoryDetailFlightticket),
});
