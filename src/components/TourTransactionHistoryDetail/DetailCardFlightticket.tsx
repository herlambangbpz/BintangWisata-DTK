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
import { cSharpDateCovert, cSharpDateHourCovert } from "../../helpers/datetime";
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
  AdultPaxTotal: number;
  ChildPaxTotal: number;
  InfantPaxTotal: number;
  AdultPrice: number;
  ChildPrice: number;
  InfantPrice: number;
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
  AdultPaxTotal,
  ChildPaxTotal,
  InfantPaxTotal,
  AdultPrice,
  ChildPrice,
  InfantPrice,
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
                TransactionHistoryDetail.TicketStatus,
                "flightticket"
              )}
            >
              Status:{" "}
              {getHistoryTransactionStatusName(
                TransactionHistoryDetail.TicketStatus,
                "flightticket"
              )}
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText color="dark">
              <small>Kode Booking</small>
            </IonText>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonText color="dark">
              <small>{TransactionHistoryDetail.BookingCode}</small>
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
                {cSharpDateCovert(TransactionHistoryDetail.BookingDate)}
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
                {cSharpDateHourCovert(TransactionHistoryDetail.PaymentLimit)}
              </small>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText color="dark">
              <small>Batas Waktu Maskapai</small>
            </IonText>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonText color="dark">
              <small>
                {cSharpDateHourCovert(TransactionHistoryDetail.TimeLimit)}
              </small>
            </IonText>
          </IonCol>
        </IonRow>
        {/* <IonRow className="ion-mb-8">
          <IonCol>
            <IonText color="medium">Metode pelunasan</IonText>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonText color="medium">
              Bayar {TransactionHistoryDetail.payment_type}
            </IonText>
          </IonCol>
        </IonRow> */}
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
              <small>{rupiah(TransactionHistoryDetail.TicketPrice)}</small>
            </IonText>
            {/* <IonIcon
              icon={iconCollapse}
              color="primary"
              className="ion-margin-start"
            ></IonIcon> */}
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonGrid hidden={hiddenCollapse} className="bt-lightgray-1">
        {TransactionHistoryDetail.Passengers !== null
          ? TransactionHistoryDetail.Passengers.map((item, index) => (
              <IonRow key={index}>
                <IonCol>
                  <IonRow className="ion-mb-8">
                    <IonCol>
                      <IonText color="medium">
                        {item.Title + " " + item.Name}
                      </IonText>
                    </IonCol>
                    <IonCol className="ion-text-right">
                      <IonText color="medium">
                        {/* {AdultPaxTotal === 0
                          ? 0
                          : `${AdultPaxTotal} X ${rupiah(AdultPrice)}`} */}
                      </IonText>
                    </IonCol>
                  </IonRow>
                </IonCol>
              </IonRow>
            ))
          : ""}
        {/* <IonRow>
          <IonCol>
            <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="medium">Dewasa</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {AdultPaxTotal === 0
                    ? 0
                    : `${AdultPaxTotal} X ${rupiah(AdultPrice)}`}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="medium">Anak-anak</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {ChildPaxTotal === 0
                    ? 0
                    : `${ChildPaxTotal} X ${rupiah(AdultPrice)}`}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="medium">Bayi</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {InfantPaxTotal === 0
                    ? 0
                    : `${InfantPaxTotal} X ${rupiah(InfantPrice)}`}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8 align">
              <IonCol>
                <IonText color="medium">Layanan tambahan </IonText>
                {TransactionHistoryDetail.tourBookingAddOnList !== null
                  ? TransactionHistoryDetail.tourBookingAddOnList.map(
                      (item, index) => (
                        <IonText color="medium" className="d-block" key={index}>
                          ({item.NumberOfAddOn} x {item.AddOnFacility})
                        </IonText>
                      )
                    )
                  : ""}
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {TransactionHistoryDetail.tourBookingAddOnList !== null
                    ? rupiah(
                        TransactionHistoryDetail.tourBookingAddOnList.reduce(
                          function (prev, cur) {
                            return prev + cur.AddOnPrice * cur.NumberOfAddOn;
                          },
                          0
                        )
                      )
                    : ""}
                </IonText>
              </IonCol>
            </IonRow> */}
        {/* <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="medium">Harga Reseller</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {rupiah(TransactionHistoryDetail.TourBookingAgentPrice)}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="medium">Komisi Reseller</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {rupiah(TransactionHistoryDetail.TourBookingCommission)}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="primary">Total Pembelian</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="primary">
                  {rupiah(TransactionHistoryDetail.TourBookingPrice)}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow
              className="ion-mb-8"
              hidden={
                TransactionHistoryDetail.payment_type === "100%" ? true : false
              }
            >
              <IonCol>
                <IonText color="medium">Pembayaran Awal</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {rupiah(TransactionHistoryDetail.TourBookingPrice / 2)}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow
              className="ion-mb-8"
              hidden={
                TransactionHistoryDetail.payment_type === "100%" ? true : false
              }
            >
              <IonCol>
                <IonText color="medium">Pembayaran Akhir</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="medium">
                  {rupiah(TransactionHistoryDetail.TourBookingPrice / 2)}
                </IonText>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow> */}
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
