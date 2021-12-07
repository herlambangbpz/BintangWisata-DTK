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
import { AppId, AppName, ContactUsLink, MainUrl } from "../../AppConfig";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import "./TransactionHistoryDetailHotel.scss";
import TransactionManage from "../../components/TourTransactionHistoryDetail/TransactionManage";
import DetailCardHotel from "../../components/TourTransactionHistoryDetail/DetailCardHotel";
import { getHistoryTransactionIcon } from "../../helpers/HistoryTransaction";
import { cSharpDateHourCovert } from "../../helpers/datetime";

interface OwnProps {}
interface StateProps {
  UserData: any;
}
interface DispatchProps {}
interface TransactionHistoryDetailHotelProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const TransactionHistoryDetailHotel: React.FC<TransactionHistoryDetailHotelProps> =
  ({ history, UserData }) => {
    const parameters: any = useParams();

    const [TransactionHistoryDetail, setTransactionHistoryDetail] =
      useState<any>(null);

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
              // history.push("/transactionHistoryList");
            }
            return res.json();
          })
          .then((res) => {
            getOrderDetailSuccess(res);
          })
          .catch((e) => {
            failedAlert("Data Histori Transaksi tidak ditemukan");
            // history.push("/transactionHistoryList");
          });
      }
    };
    const getOrderDetailSuccess = (res: any) => {
      if (res.StatusCode === 200) {
        setTransactionHistoryDetail(res.Data);
      } else {
        failedAlert("Data Histori Transaksi tidak ditemukan");
        // history.push("/transactionHistoryList");
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
                {TransactionHistoryDetail.bookDetail.hotelName}
              </IonTitle>
              <IonTitle className="ion-sub-title ion-no-padding">
                No. Pesanan : {parameters.inv}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen={true} className="gray-bg">
            <DetailCardHotel
              TransactionHistoryDetail={TransactionHistoryDetail}
            ></DetailCardHotel>
            <IonText className="ion-margin">
              <small>
                <b>Data Penerbangan</b>
              </small>
            </IonText>
            <IonGrid className="ion-margin-top white-bg ion-padding ion-margin-bottom">
              <IonRow className="ion-align-items-center">
                <IonCol size="2">
                  <img
                    src={getHistoryTransactionIcon("hotelbooking")}
                    alt=""
                    width="50%"
                    className="ion-mt-16 ion-mb-16"
                  />
                </IonCol>
                <IonCol size="10">
                  <IonText>{TransactionHistoryDetail.name}</IonText>
                  <br />
                  <IonText color="medium">
                    <small>{TransactionHistoryDetail.address}</small>
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonText className="ion-margin">
              <small>
                <b>Data Tamu</b>
              </small>
            </IonText>
            {TransactionHistoryDetail.paxList.map((item, index) => (
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
                      {item.Title}. {item.FirstName} {item.LastName}
                    </IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            ))}
            {/* <TourDetail
              TransactionHistoryDetail={TransactionHistoryDetail}
            ></TourDetail> */}
            <TransactionManage
              Status={TransactionHistoryDetail.bookDetail.bookingStatus}
            ></TransactionManage>
            <IonText
              className="ion-margin"
              hidden={
                TransactionHistoryDetail.bookDetail.bookingStatus !== "booked"
              }
            >
              <small>
                <b>Pembayaran</b>
              </small>
            </IonText>
            <IonGrid
              className="ion-margin-top white-bg ion-padding ion-margin-bottom"
              hidden={
                TransactionHistoryDetail.bookDetail.bookingStatus !== "booked"
              }
            >
              <IonRow className="ion-align-items-center">
                <IonCol size="9">
                  <IonText>
                    <small>
                      {TransactionHistoryDetail.paymentDetail &&
                        TransactionHistoryDetail.paymentDetail
                          .paymentMethod}{" "}
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
                    <small>No. Pesanan : {parameters.inv}</small>
                  </IonText>
                </IonCol>
                <IonCol size="12">
                  <p color="medium">
                    <small>
                      Customer service kami akan menanyakan Kode Booking
                      tersebut saat Anda menghubungi kami
                    </small>
                  </p>
                </IonCol>
                <IonCol size="12">
                  <IonText color="primary">
                    <a href={ContactUsLink}>
                      <b>HUBUNGI KAMI</b>
                    </a>
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
export default connect<TransactionHistoryDetailHotelProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: withRouter(TransactionHistoryDetailHotel),
});
