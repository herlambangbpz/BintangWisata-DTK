import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from '../../data/connect';
import { CancelTransactionAllowStatus, PaymentFinishingAllowStatus, RePaymentFinishingAllowStatus, TourManageAllowStatus, ViewEvoucherAllowStatus, ViewInvoice1AllowStatus, ViewInvoice2AllowStatus } from '../../helpers/TourHistoryTransactionDetailAllowStatus';
interface OwnProps {
  Status:string
};
interface StateProps { };
interface DispatchProps {}
interface TransactionManageProps extends OwnProps, StateProps, DispatchProps,RouteComponentProps { };
const TransactionManage: React.FC<TransactionManageProps> = ({
  history,Status}) => {
  return (
    <div hidden={TourManageAllowStatus(Status)}>
      <p><br/></p>
    <IonText className="ion-margin">
      <small><b>Atur Pesanan</b></small>
    </IonText>
    <IonGrid className="ion-margin-top white-bg">
    <IonRow className="ion-align-items-center" hidden={!PaymentFinishingAllowStatus(Status)}>
        <IonCol>
          <IonText color="dark"><small>Lanjutkan pembayaran</small></IonText>
        </IonCol>
        <IonCol size="2" className="ion-text-right">
          <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
        </IonCol>
      </IonRow>
      <IonRow className="ion-align-items-center" hidden={!RePaymentFinishingAllowStatus(Status)}>
        <IonCol>
          <IonText color="dark"><small>Lanjutkan pelunasan</small></IonText>
        </IonCol>
        <IonCol size="2" className="ion-text-right">
          <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
        </IonCol>
      </IonRow>
      <IonRow className="ion-align-items-center"  hidden={!ViewInvoice1AllowStatus(Status)}>
        <IonCol>
          <IonText color="dark"><small>Lihat invoice 1</small></IonText>
        </IonCol>
        <IonCol size="2" className="ion-text-right">
          <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
        </IonCol>
      </IonRow>
      <IonRow className="ion-align-items-center" hidden={!ViewInvoice2AllowStatus(Status)}>
        <IonCol>
          <IonText color="dark"><small>Lihat invoice 2</small></IonText>
        </IonCol>
        <IonCol size="2" className="ion-text-right">
          <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
        </IonCol>
      </IonRow>
      <IonRow className="ion-align-items-center" hidden={!ViewEvoucherAllowStatus(Status)}>
        <IonCol>
          <IonText color="dark"><small>Lihat E-Voucher</small></IonText>
        </IonCol>
        <IonCol size="2" className="ion-text-right">
          <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
        </IonCol>
      </IonRow>
      <IonRow className="ion-align-items-center" hidden={!CancelTransactionAllowStatus(Status)}>
        <IonCol>
          <IonText color="dark"><small>Batalkan Pesanan</small></IonText>
        </IonCol>
        <IonCol size="2" className="ion-text-right">
          <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
        </IonCol>
      </IonRow>
    </IonGrid>
    </div>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: React.memo(withRouter(TransactionManage))
});
