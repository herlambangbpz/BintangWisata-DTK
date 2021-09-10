import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonLabel, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import { connect } from '../data/connect';
import './Inbox.scss';
import { Tabs } from 'antd';
import 'antd/dist/antd.css';

interface OwnProps { }

interface StateProps {
  locations: Location[];
  mapCenter: Location;
}

interface DispatchProps { }

interface InboxProps extends OwnProps, StateProps, DispatchProps {
};
const Inbox: React.FC<InboxProps> = () => {
  const callback = (key: any) => {
    // console.log(key);
  }
  const { TabPane } = Tabs;

  return (
  <IonPage id="map-view">
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Kotak Masuk</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="map-page">
      <Tabs defaultActiveKey="transaction" onChange={callback} size="large" >
        <TabPane tab="Transaksi" key="transaction" >
          <IonGrid>
          <IonRow className="ion-margin-start ion-margin-end ion-padding-top ion-padding-bottom bb-lightgray-1">
              <IonCol size="12">
                <IonText color="medium"><small>Paket Tur </small></IonText>
                <IonText color="medium"> . </IonText>
                <IonText color="medium"><small> 02 Jun</small></IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="dark">Selamat, pesanan kamu sudah diterima</IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="medium">
                  Transaksi paket tur #DTRVL1209 diterima,
                  segera melakukan pembayaran supaya
                  pesanan segera diproses.
              </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-start ion-margin-end ion-padding-top ion-padding-bottom bb-lightgray-1">
              <IonCol size="12">
                <IonText color="medium"><small>Paket Tur </small></IonText>
                <IonText color="medium"> . </IonText>
                <IonText color="medium"><small> 02 Jun</small></IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="dark">Selamat, pesanan kamu sudah diterima</IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="medium">
                  Transaksi paket tur #DTRVL1209 diterima,
                  segera melakukan pembayaran supaya
                  pesanan segera diproses.
              </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-start ion-margin-end ion-padding-top ion-padding-bottom bb-lightgray-1">
              <IonCol size="12">
                <IonText color="medium"><small>Paket Tur </small></IonText>
                <IonText color="medium"> . </IonText>
                <IonText color="medium"><small> 02 Jun</small></IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="dark">Selamat, pesanan kamu sudah diterima</IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="medium">
                  Transaksi paket tur #DTRVL1209 diterima,
                  segera melakukan pembayaran supaya
                  pesanan segera diproses.
              </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-start ion-margin-end ion-padding-top ion-padding-bottom bb-lightgray-1">
              <IonCol size="12">
                <IonText color="medium"><small>Paket Tur </small></IonText>
                <IonText color="medium"> . </IonText>
                <IonText color="medium"><small> 02 Jun</small></IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="dark">Selamat, pesanan kamu sudah diterima</IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="medium">
                  Transaksi paket tur #DTRVL1209 diterima,
                  segera melakukan pembayaran supaya
                  pesanan segera diproses.
              </IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-start ion-margin-end ion-padding-top ion-padding-bottom bb-lightgray-1">
              <IonCol size="12">
                <IonText color="medium"><small>Paket Tur </small></IonText>
                <IonText color="medium"> . </IonText>
                <IonText color="medium"><small> 02 Jun</small></IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="dark">Selamat, pesanan kamu sudah diterima</IonText>
              </IonCol>
              <IonCol size="12">
                <IonText color="medium">
                  Transaksi paket tur #DTRVL1209 diterima,
                  segera melakukan pembayaran supaya
                  pesanan segera diproses.
              </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </TabPane>
        <TabPane tab="Update" key="update">
          <IonLabel className="ion-margin">Not Ready Yet</IonLabel>
        </TabPane>
      </Tabs>
    </IonContent>
  </IonPage>
)};

export default connect<OwnProps, StateProps, DispatchProps>({
  component: Inbox
});
