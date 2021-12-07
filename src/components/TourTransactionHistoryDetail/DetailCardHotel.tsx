import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import { chevronDown, chevronUp } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import { rupiah } from "../../helpers/currency";
import {
  cSharpDateCovert,
  cSharpDateHourCovert,
  stringDateHoursConvert,
} from "../../helpers/datetime";
import { setTourPaymentAllowStatus } from "../../data/tour/tour.actions";
import {
  getHistoryTransactionCtaLabel,
  getHistoryTransactionCtaTarget,
  getHistoryTransactionStatusColor,
  getHistoryTransactionStatusName,
} from "../../helpers/HistoryTransaction";
import {
  EvoucherButtonStatus,
  PaymentFinishingButtonStatus,
  PaymentProofButtonStatus,
  RePaymentButtonStatus,
  StartTransactionButtonStatus,
} from "../../helpers/TourHistoryTransactionDetailAllowStatus";
interface OwnProps {
  TransactionHistoryDetail: any;
}
interface StateProps {}
interface DispatchProps {
  setTourPaymentAllowStatus: typeof setTourPaymentAllowStatus;
}
interface DetailCardFlightticketProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const DetailCardFlightticket: React.FC<DetailCardFlightticketProps> = ({
  history,
  setTourPaymentAllowStatus,
  TransactionHistoryDetail,
}) => {
  const [hiddenCollapse, setHiddenCollapse] = useState<boolean>(true);
  const [iconCollapse, setIconCollapse] = useState<string>(chevronDown);
  const [RepaymentButtonText, setRepaymentButtonText] = useState<string>(
    "Lanjutkan Pelunasan"
  );
  const [RepaymentButtonDisableStatus, setRepaymentButtonDisableStatus] =
    useState<boolean>(false);
  const toggleCollapse = () => {
    if (hiddenCollapse === false) {
      setHiddenCollapse(true);
      setIconCollapse(chevronDown);
    } else {
      setHiddenCollapse(false);
      setIconCollapse(chevronUp);
    }
  };
  const Repayment = () => {
    setTourPaymentAllowStatus(true);
    setRepaymentButtonText("Menuju halaman pelunasan...");
    setRepaymentButtonDisableStatus(true);
    setTimeout(() => {
      localStorage.setItem("RepaymentStatus", "1");
      localStorage.setItem(
        "TourOrderBookingCode",
        TransactionHistoryDetail.TourBookingCode
      );
      setRepaymentButtonText("Lanjutkan Pelunasan");
      setRepaymentButtonDisableStatus(false);
      history.push("/tourPayment");
    }, 2000);
  };
  return (
    <IonCard className="ion-p-8 ion-margin-bottom ion-margin">
      <IonGrid>
        <IonRow className="ion-mb-8">
          <IonCol>
            <IonText
              color={getHistoryTransactionStatusColor(
                TransactionHistoryDetail.bookDetail.bookingStatus,
                "hotelbooking"
              )}
            >
              Status :{" "}
              {getHistoryTransactionStatusName(
                TransactionHistoryDetail.bookDetail.bookingStatus,
                "hotelbooking"
              )}
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow hidden={TransactionHistoryDetail.bookDetail.reservationNo===""}>
          <IonCol>
            <IonText color="dark">
              <small>Kode Booking</small>
            </IonText>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonText color="dark">
              <small>{TransactionHistoryDetail.bookDetail.reservationNo}</small>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText color="dark">
              <small>Tanggal Transaksi</small>
            </IonText>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonText color="dark">
              <small>
                {stringDateHoursConvert(
                  TransactionHistoryDetail.bookDetail.bookingDate
                )}
              </small>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText color="dark">
              <small>Batas Waktu Pembayaran</small>
            </IonText>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonText color="dark">
              <small>
                {stringDateHoursConvert(TransactionHistoryDetail.paymentDetail&&
                  TransactionHistoryDetail.paymentDetail.paymentTimeLimit||""
                )}
              </small>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow
        // onClick={() => toggleCollapse()}
        >
          <IonCol>
            <IonText color="dark">
              <small>Total pembelian</small>
            </IonText>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonText color="dark">
              <small>{rupiah(TransactionHistoryDetail.paymentDetail&&TransactionHistoryDetail.paymentDetail.paymentAmount||0)}</small>
            </IonText>
            {/* <IonIcon
              icon={iconCollapse}
              color="primary"
              className="ion-margin-start"
            ></IonIcon> */}
          </IonCol>
        </IonRow>
      </IonGrid>
      {/* <IonButton expand="block"
              disabled={getHistoryTransactionCtaTarget(TransactionHistoryDetail.TourBookingStatus,'tour')===''?true:false}
              onClick={()=>{
                if(getHistoryTransactionCtaTarget(TransactionHistoryDetail.TourBookingStatus,'tour')){
                  history.push(getHistoryTransactionCtaTarget(TransactionHistoryDetail.TourBookingStatus,'tour'))
                }}}>
              {getHistoryTransactionCtaLabel(TransactionHistoryDetail.TourBookingStatus,'tour')}
            </IonButton> */}
      {/* <IonButton
        hidden={
          TransactionHistoryDetail.TourBookingStatus.toLowerCase() !== "booked"
        }
        expand="block"
        disabled={true}
      >
        Menunggu Konfirmasi
      </IonButton>
      <IonButton
        hidden={
          !PaymentFinishingButtonStatus(
            TransactionHistoryDetail.TourBookingStatus
          )
        }
        expand="block"
        onClick={() => {}}
      >
        Lanjutkan Pembayaran
      </IonButton>
      <IonButton
        disabled={RepaymentButtonDisableStatus}
        hidden={
          !RePaymentButtonStatus(TransactionHistoryDetail.TourBookingStatus)
        }
        expand="block"
        onClick={() => {
          Repayment();
        }}
      >
        {RepaymentButtonText}
      </IonButton>
      <IonButton
        hidden={
          !EvoucherButtonStatus(TransactionHistoryDetail.TourBookingStatus)
        }
        expand="block"
        onClick={() => {}}
      >
        Lihat E-Voucher
      </IonButton>
      <IonButton
        hidden={
          !PaymentProofButtonStatus(TransactionHistoryDetail.TourBookingStatus)
        }
        expand="block"
        onClick={() => {}}
      >
        Kirim Bukti Pembayaran
      </IonButton>
      <IonButton
        hidden={
          !StartTransactionButtonStatus(
            TransactionHistoryDetail.TourBookingStatus
          )
        }
        expand="block"
        routerLink="/main/index"
      >
        Transaksi Kembali
      </IonButton> */}
    </IonCard>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    setTourPaymentAllowStatus,
  },
  component: React.memo(withRouter(DetailCardFlightticket)),
});
