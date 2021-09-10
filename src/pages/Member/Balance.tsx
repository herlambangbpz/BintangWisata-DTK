import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonContent, IonPage, IonButtons, IonButton, IonList, IonItem, IonLabel, IonTitle, IonBackButton, IonInput, IonIcon, IonCard, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Balance.scss';
import { connect } from '../../data/connect';
import { chevronBackOutline, chevronForwardOutline, newspaper } from 'ionicons/icons';

interface StateProps {
  balance? : string
};
interface BalanceProps extends RouteComponentProps,StateProps{ }

const Balance: React.FC<BalanceProps> = ({history,balance}) => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
      <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton icon={chevronBackOutline} defaultHref="/main/account"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={()=>{history.push('/balanceactivities')}}>
              <IonIcon icon={newspaper} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>
            Saldo
          </IonTitle>
        </IonToolbar>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">
            Rp {balance?balance:0}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="gray-bg">
      <IonCard className="ion-margin-top ion-margin-bottom no-shadow" onClick={()=>history.push('/balancerequest')}>
          <IonGrid>
            <IonRow className="ion-align-items-center">
            <IonCol size="10">
              <IonText color="medium"><h6 className="ion-no-margin">Permintaan Deposit</h6></IonText>
              <IonText color="medium"><small><small>Permintaan kode deposit untuk nominal yang harus ditransfer</small></small></IonText>
            </IonCol>
            <IonCol size="2" className="ion-text-right">
              <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
            </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonCard className="ion-margin-top ion-margin-bottom no-shadow" onClick={()=>history.push('/balanceactivities')}>
          <IonGrid>
            <IonRow className="ion-align-items-center">
            <IonCol size="10">
              <IonText color="medium"><h6 className="ion-no-margin">Laporan</h6></IonText>
              <IonText color="medium"><small>Riwayat permintaan deposit</small></IonText>
            </IonCol>
            <IonCol size="2" className="ion-text-right">
              <IonIcon icon={chevronForwardOutline} color="medium" size="large"></IonIcon>
            </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonGrid className="ion-padding">
          <IonLabel color="dark" className="fw-500">Cara Isi Ulang Saldo :</IonLabel>
          <IonList lines="full" className="ion-p-8 ion-margin-top">
            <IonItem>
              <IonLabel color="dark"><small>Transfer Bank</small></IonLabel>
            </IonItem>
            <IonItem>
              <img height="32px" slot="start" src="assets/img/payment/BCA.png"/>
              <IonLabel color="dark">BCA</IonLabel>
            </IonItem>
            <IonItem>
              <img height="32px" slot="start" src="assets/img/payment/BRI.png"/>
              <IonLabel color="dark">BRI</IonLabel>
            </IonItem>
            <IonItem>
              <img height="32px" slot="start" src="assets/img/payment/BNI.png"/>
              <IonLabel color="dark">BNI</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <img height="32px" slot="start" src="assets/img/payment/Mandiri.png"/>
              <IonLabel color="dark">Transfer Mandiri</IonLabel>
            </IonItem>
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    balance: state.user.balance,
  }),
  component: React.memo(withRouter(Balance))
});
