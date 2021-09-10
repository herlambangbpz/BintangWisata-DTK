import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLoading, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from '../data/connect';
import { rupiah } from '../helpers/currency';
import { stringDateConvert } from '../helpers/datetime';
import TourWizard from './TourWizard';
interface OwnProps {
  TourCompleteData:any
  TourCompletePaidAmount:number
  showLoading:boolean
  headerAlert?:string
  showAlert:boolean
  messageAlert?:string
  setShowAlert:any
  TourCompletBookingGuestList:any
};
interface StateProps {
  TourProductDetail? : any
  TourProductPricingIndex?: number
  TourProductStartDate?:string
  TourBookingNumberOfPaxTotal?:number
};
interface DispatchProps {}
interface TourCompleteCashProps extends OwnProps, StateProps, DispatchProps,RouteComponentProps { };
const TourCompleteCash: React.FC<TourCompleteCashProps> = ({
  history,
  TourProductStartDate,
  TourProductDetail,
  TourProductPricingIndex,
  TourBookingNumberOfPaxTotal,
  TourCompletBookingGuestList,
  TourCompleteData,
  setShowAlert,
  showAlert,
  messageAlert,
  TourCompletePaidAmount,
  showLoading,
  headerAlert}) => {
  return (
    //Pembayaran Saldo
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            Selesai
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="TourOrder">
      <TourWizard
        WizardIndex={3}
        TourProductStartDate={stringDateConvert(TourProductStartDate||'')}
        TourProductDetail={TourProductDetail}
        TourBookingNumberOfPaxTotal={TourBookingNumberOfPaxTotal}
        TourProductPricingIndex={TourProductPricingIndex}
        ></TourWizard>
        <IonGrid className="white-bg ion-padding ion-margin-bottom">
          <IonRow>
            <IonCol>
              <IonText>Kode Pesanan</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
                <IonText>{TourCompleteData!==null?localStorage.TourOrderBookingCode:''}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonText class="ion-padding" color="dark">
          <small>Rincian Pesanan</small>
        </IonText>
        <IonGrid className="white-bg ion-padding ion-margin-top">
        <IonRow hidden={TourCompletBookingGuestList.AdultPax>0?false:true}>
            <IonCol>
              <IonText>Dewasa</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText>{TourCompleteData!==null?TourCompletBookingGuestList.AdultPax+' x IDR '+rupiah(TourCompletBookingGuestList.AdultPrice):''}</IonText>
            </IonCol>
          </IonRow>
          <IonRow hidden={TourCompletBookingGuestList.ChildPax>0?false:true}>
            <IonCol>
              <IonText>Anak</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText>{TourCompleteData!==null?TourCompletBookingGuestList.ChildPax+' x IDR '+rupiah(TourCompletBookingGuestList.ChildPrice):''}</IonText>
            </IonCol>
          </IonRow>
          <IonRow hidden={TourCompletBookingGuestList.InfantPax>0?false:true}>
            <IonCol>
              <IonText>Bayi</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText>{TourCompleteData!==null?TourCompletBookingGuestList.AdultPax+' x IDR '+rupiah(TourCompletBookingGuestList.AdultPrice):''}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>Metode Pelunasan</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText>{TourCompleteData!==null?TourCompleteData.payment_type==="100%"? 'Bayar lunas 100%':'Bayar sebagian 50%':''}</IonText>
            </IonCol>
          </IonRow>
          <IonRow class="ion-align-items-center">
            <IonCol>
              <IonText>Total Harga</IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText>{rupiah(TourCompletePaidAmount)}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton
          hidden={TourCompleteData!==null?TourCompleteData.payment_type==="50%"?false:true:true}
          routerLink="/transactionHistoryList" expand="block" className="text-transform-none ion-margin" size="large">
        Pelunasan
        </IonButton>
        <IonButton
          hidden={TourCompleteData!==null?TourCompleteData.payment_type!=="50%"?false:true:true}
          routerLink="/main/transactionList" expand="block" className="text-transform-none ion-margin" size="large">
        Cek Status Pembayaran
        </IonButton>
        <IonButton
          hidden={TourCompleteData!==null?TourCompleteData.payment_type==="50%"?false:true:true}
          routerLink="/main/transactionList" expand="block" className="text-transform-none ion-margin btn-outline-primary" size="large">
        Lihat Daftar Transaksi
        </IonButton>
        <IonButton
          hidden={TourCompleteData!==null?TourCompleteData.payment_type!=="50%"?false:true:true}
          routerLink="/main/index" color="white" expand="block" className="text-transform-none ion-margin btn-outline-primary" size="large">
        Kembali ke Beranda
        </IonButton>
        <IonLoading
          isOpen={showLoading}
          message={'Mohon Tunggu...'}
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={headerAlert}
          message={messageAlert}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    TourBookingNumberOfPaxTotal: state.tour.TourBookingNumberOfPaxTotal,
    TourProductDetail: state.tour.TourProductDetail,
    TourProductPricingIndex: state.tour.TourProductPricingIndex,
    TourProductStartDate: state.tour.TourProductStartDate,
  }),
  component: React.memo(withRouter(TourCompleteCash))
});

