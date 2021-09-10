import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLoading,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../data/connect";
import { rupiah } from "../helpers/currency";
import { cSharpDateHourCovert } from "../helpers/datetime";
interface OwnProps {
  TourCompleteData: any;
  TimeLimit: string;
  TourCompletePaidAmount: number;
  showLoading: boolean;
  headerAlert?: string;
  showAlert: boolean;
  messageAlert?: string;
  setShowAlert: any;
}
interface StateProps {}
interface DispatchProps {}
interface TourCompleteTransferProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const TourCompleteTransfer: React.FC<TourCompleteTransferProps> = ({
  history,
  TourCompleteData,
  setShowAlert,
  showAlert,
  messageAlert,
  TimeLimit,
  TourCompletePaidAmount,
  showLoading,
  headerAlert,
}) => {
  const TransactionHistoryDetail = (key: string) => {
    setShowPopover({ open: false, event: undefined });
    history.push("/transactionHistoryDetail/" + key.replace(/\./g, "-"));
  };
  const [showPopover, setShowPopover] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({
    open: false,
    event: undefined,
  });
  console.log(TimeLimit);

  return (
    //Pembayaran Doku
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
              <CopyToClipboard
                text={
                  TourCompleteData !== null
                    ? localStorage.TourOrderBookingCode
                    : ""
                }
                onCopy={() => alert("Berhasil menyalin")}
              >
                <IonText color="primary" className="copyText">
                  <small>salin </small>
                </IonText>
              </CopyToClipboard>
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
              <IonText>
                {TourCompleteData !== null
                  ? TourCompleteData.paymentData.length > 1
                    ? TourCompleteData.paymentData[1].method
                    : TourCompleteData.paymentData[0].method
                  : ""}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow class="ion-align-items-center">
            <IonCol>
              <IonText>Nomor</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <CopyToClipboard
                text={
                  TourCompleteData !== null
                    ? TourCompleteData.paymentData.length > 1
                      ? TourCompleteData.paymentData[1].VANumber
                      : TourCompleteData.paymentData[0].VANumber
                    : ""
                }
                onCopy={() => alert("Berhasil menyalin")}
              >
                <IonText color="primary" className="copyText">
                  <small>salin </small>
                </IonText>
              </CopyToClipboard>
              <IonText>
                {TourCompleteData !== null
                  ? TourCompleteData.paymentData.length > 1
                    ? TourCompleteData.paymentData[1].VANumber
                    : TourCompleteData.paymentData[0].VANumber
                  : ""}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>Jumlah yang dibayar</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <CopyToClipboard
                text={rupiah(TourCompletePaidAmount)}
                onCopy={() => alert("Berhasil menyalin")}
              >
                <IonText color="primary" className="copyText">
                  <small>salin </small>
                </IonText>
              </CopyToClipboard>
              <IonText>{rupiah(TourCompletePaidAmount)}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton
          hidden={
            TourCompleteData !== null
              ? TourCompleteData.payment_type === "50%"
                ? false
                : true
              : true
          }
          routerLink="/transactionHistoryList"
          expand="block"
          className="text-transform-none ion-margin"
          size="large"
        >
          Pelunasan
        </IonButton>
        <IonButton
          hidden={
            TourCompleteData !== null
              ? TourCompleteData.payment_type !== "50%"
                ? false
                : true
              : true
          }
          routerLink="/main/transactionList"
          expand="block"
          className="text-transform-none ion-margin"
          size="large"
        >
          Cek Status Pembayaran
        </IonButton>
        <IonButton
          hidden={
            TourCompleteData !== null
              ? TourCompleteData.payment_type === "50%"
                ? false
                : true
              : true
          }
          routerLink="/main/transactionList"
          color="white"
          expand="block"
          className="text-transform-none ion-margin btn-outline-primary"
          size="large"
        >
          Lihat Daftar Transaksi
        </IonButton>
        <IonButton
          hidden={
            TourCompleteData !== null
              ? TourCompleteData.payment_type !== "50%"
                ? false
                : true
              : true
          }
          routerLink="/main/index"
          color="white"
          expand="block"
          className="text-transform-none ion-margin btn-outline-primary"
          size="large"
        >
          Kembali ke Beranda
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
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({}),
  component: React.memo(withRouter(TourCompleteTransfer)),
});
