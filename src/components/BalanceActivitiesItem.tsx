import React, { useState } from 'react';
import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonButton,
} from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { rupiah } from '../helpers/currency';
import { cSharpDateCovert, cSharpDateHourCovert } from '../helpers/datetime';
export default function TourOrderBuyerDataItem(
  { itemIndex,setItemActive,itemActive,itemData}
  : { itemIndex:string;setItemActive:any;itemActive:string,itemData:any}) {
  const [Collapsed, setCollapsed] = useState<boolean>(true);
  const setCollapsedNone = () =>{
    setItemActive('none');
    localStorage.setItem('BalanceActivitiesItemActive','none')
  }
  const setCollapsedItem = () =>{
    setItemActive(itemIndex);
    localStorage.setItem('BalanceActivitiesItemActive',itemIndex)
  }
  React.useEffect(()=>{
    if(itemIndex===itemActive){
      setCollapsed(false);
    }else{
      setCollapsed(true);
    }
  },[itemActive])
  return (
    <div>
      <IonCard className="no-shadow ion-text-left">
        <IonGrid className="ion-no-padding">
          <IonRow className="ion-padding">
            <IonCol size="3">
              <IonText ><h6 className="ion-no-margin">ID Deposit</h6></IonText>
              <IonText><h5 className="ion-no-margin">{itemData.DepositID}</h5></IonText>
            </IonCol>
            <IonCol size="3">
              <IonText ><h6 className="ion-no-margin">Nominal</h6></IonText>
              <IonText><h5 className="ion-no-margin">{rupiah(itemData.Amount)}</h5></IonText>
            </IonCol>
            <IonCol size="4">
              <IonText ><h6 className="ion-no-margin">Status</h6></IonText>
              <IonText><h5 className="ion-no-margin">{itemData.Paid?'Sudah Dibayar':'Belum Dibayar'}</h5></IonText>
            </IonCol>
            <IonCol size="2" hidden={Collapsed}  className="ion-text-right" onClick={()=>setCollapsedNone()}>
              <IonIcon icon={chevronUp} color="primary" style={{'fontSize':'19px'}}></IonIcon>
            </IonCol>
            <IonCol size="2" hidden={!Collapsed}  className="ion-text-right" onClick={()=>setCollapsedItem()}>
              <IonIcon icon={chevronDown} color="primary" style={{'fontSize':'19px'}}></IonIcon>
            </IonCol>
          </IonRow>
          <IonRow hidden={Collapsed} className="bt-lightgray-1 ion-padding">
            <IonCol size="7">
              <IonText ><h6 className="ion-no-margin">Permintaan</h6></IonText>
              <IonText><h5 className="ion-no-margin">{cSharpDateHourCovert(itemData.CreateOn)}</h5></IonText>
            </IonCol>
            <IonCol>
              <IonText ><h6 className="ion-no-margin">Metode</h6></IonText>
              <IonText><h5 className="ion-no-margin">{itemData.DepositPaymentMethod==="TT"?"Transfer Bank":"Cash"}</h5></IonText>
            </IonCol>
          </IonRow>
          <IonRow hidden={Collapsed} className="ion-no-padding ion-padding-bottom ion-padding-horizontal" >
          <IonCol size="7">
            <IonText ><h6 className="ion-no-margin">Kadaluarsa</h6></IonText>
            <IonText><h5 className="ion-no-margin">{cSharpDateHourCovert(itemData.ExpiredDateTime)}</h5></IonText>
            </IonCol>
            <IonCol>
              <IonButton className="btn-outline-primary text-transform-none" size="small">Upload Bukti</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
    </div>
  );
}

