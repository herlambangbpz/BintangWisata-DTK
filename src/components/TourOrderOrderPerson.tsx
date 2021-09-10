import React, { useEffect, useState } from 'react';

import { IonCard, IonGrid, IonRow, IonCol, IonCardContent, IonText, IonList, IonRadioGroup, IonItem, IonLabel, IonRadio, IonModal, IonContent, IonButton, IonInput, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';
import DefaultToolbar from './shared/DefaultToolbar';

export default function TourOrderOrderPerson({name,email}: {name?:any;email?:any;}) {
  const TOOP = localStorage.TourOrderOrderPerson?JSON.parse(localStorage.TourOrderOrderPerson):undefined;
  const [ShowModalOrderPerson, setShowModalOrderPerson] = useState(false);
  const [OrderPersonMethod, setOrderPersonMethod] = useState<string>(TOOP?TOOP.OrderPersonMethod:'');
  const [OrderPersonTitel, setOrderPersonTitel] = useState<string>(TOOP?TOOP.OrderPersonTitel:'');
  const [OrderPersonFullName, setOrderPersonFullName] = useState<string>(TOOP?TOOP.OrderPersonFullName:'');
  const [OrderPersonNationCode, setOrderPersonNationCode] = useState<string>(TOOP?TOOP.OrderPersonNationCode:'+62');
  const [OrderPersonPhoneNumber, setOrderPersonPhoneNumber] = useState<string>(TOOP?TOOP.OrderPersonPhoneNumber:'');
  const [OrderPersonEmail, setOrderPersonEmail] = useState<string>(TOOP?TOOP.OrderPersonEmail:'');

  const switchOrderBy = (val:string) => {
    const TOOP = localStorage.TourOrderOrderPerson?JSON.parse(localStorage.TourOrderOrderPerson):undefined;
    if(TOOP && TOOP.OrderPersonMethod === val){
      setOrderPersonMethod(TOOP?TOOP.OrderPersonMethod:'');
      setOrderPersonTitel(TOOP?TOOP.OrderPersonTitel:'');
      setOrderPersonFullName(TOOP?TOOP.OrderPersonFullName:'');
      setOrderPersonNationCode(TOOP?TOOP.OrderPersonNationCode:'+62');
      setOrderPersonPhoneNumber(TOOP?TOOP.OrderPersonPhoneNumber:'');
      setOrderPersonEmail(TOOP?TOOP.OrderPersonEmail:'');
    }else{
      setOrderPersonTitel('');
      setOrderPersonPhoneNumber('');
      if(val === "0"){
        setOrderPersonFullName(name);
        setOrderPersonEmail(email);
      }else{
        setOrderPersonFullName('');
        setOrderPersonEmail('');
      }
    }
    setShowModalOrderPerson(true)
  }
  const submitOrderPerson = () =>{
    if(!OrderPersonTitel || OrderPersonTitel===''){
      failedAlert('Titel Pemesan Wajib dipilih')
      return;
    }
    if(!OrderPersonFullName || OrderPersonFullName===''){
      failedAlert('Nama Panjang Pemesan Wajib dipilih')
      return;
    }
    if(!OrderPersonNationCode || OrderPersonNationCode===''){
      failedAlert('Kode Negara Pemesan Wajib dipilih')
      return;
    }
    if(!OrderPersonPhoneNumber || OrderPersonPhoneNumber===''){
      failedAlert('Nomor Telepon Pemesan Wajib dipilih')
      return;
    }
    if(!OrderPersonEmail || OrderPersonEmail===''){
      failedAlert('Email Pemesan Wajib dipilih')
      return;
    }
    if(OrderPersonEmail===email) setOrderPersonMethod("0");
    if(OrderPersonEmail!==email) setOrderPersonMethod("1");
    localStorage.setItem("TourOrderOrderPerson",JSON.stringify({
      OrderPersonMethod:OrderPersonEmail===email?"0":"1",
      OrderPersonTitel:OrderPersonTitel,
      OrderPersonFullName:OrderPersonFullName,
      OrderPersonNationCode:OrderPersonNationCode,
      OrderPersonPhoneNumber:OrderPersonPhoneNumber,
      OrderPersonEmail:OrderPersonEmail,
    }))
    setShowModalOrderPerson(false);
  }
  const closeModal = () =>{
    const TOOP = localStorage.TourOrderOrderPerson?JSON.parse(localStorage.TourOrderOrderPerson):undefined;
    if(TOOP){
      setOrderPersonMethod(TOOP?TOOP.OrderPersonMethod:'');
      setOrderPersonTitel(TOOP?TOOP.OrderPersonTitel:'');
      setOrderPersonFullName(TOOP?TOOP.OrderPersonFullName:'');
      setOrderPersonNationCode(TOOP?TOOP.OrderPersonNationCode:'+62');
      setOrderPersonPhoneNumber(TOOP?TOOP.OrderPersonPhoneNumber:'');
      setOrderPersonEmail(TOOP?TOOP.OrderPersonEmail:'');
    }
    setShowModalOrderPerson(false);
  }
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage:string) =>{
    setHeaderAlert('Ups! ada yang kurang');
    setMessageAlert(errorMessage);
    setShowAlert(true);
  }
  return (
    <div className="ion-no-padding">
      <IonText class="ion-padding" color="dark">
          <small>Data Pemesan (Penerima Voucher)</small>
        </IonText>
        <IonCard  className="ion-margin-bottom">
          <IonCardContent>
            <IonText color="dark"><h4>{name}</h4></IonText>
            <IonText color="medium"><small>{email}</small></IonText>
          </IonCardContent>
          <IonList className="card-footer">
            <IonRadioGroup value={OrderPersonMethod}>
              <IonItem lines="none" onClick={()=>switchOrderBy("0")}>
                <IonLabel>Saya sebagai pemesannya</IonLabel>
                <IonRadio slot="start" value="0" className="ion-margin-end"/>
              </IonItem>
              <IonItem  lines="none" onClick={()=>switchOrderBy("1")}>
                <IonLabel>Saya pesan untuk orang lain</IonLabel>
                <IonRadio slot="start" value="1" className="ion-margin-end"/>
              </IonItem>
            </IonRadioGroup>
          </IonList>
        </IonCard>
        {/* Modal Order Person */}
        <IonModal isOpen={ShowModalOrderPerson}>
          <IonContent>
            <DefaultToolbar
              title="Data Pemesan" color="primary" backButtonRoute={() => {closeModal()}}
            />
            <IonGrid>
              <IonRow>
              <IonCol size="12">
                  <IonItem className="ion-no-padding">
                    <IonLabel className="ion-padding-start"><small>Titel</small></IonLabel>
                    <IonSelect value={OrderPersonTitel} placeholder="Select One" onIonChange={e => setOrderPersonTitel(e.detail.value)}>
                      <IonSelectOption value="Mr">Tuan</IonSelectOption>
                      <IonSelectOption value="Mrs">Nyonya</IonSelectOption>
                      <IonSelectOption value="Ms">Nona</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating"><small>Nama Lengkap</small></IonLabel>
                    <IonInput value={OrderPersonFullName} onIonChange={e => setOrderPersonFullName(e.detail.value!)}></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol size="4">
                  <IonItem>
                    <IonLabel position="stacked"><small>Kode Negara</small></IonLabel>
                    <IonInput value={OrderPersonNationCode} onIonChange={e => setOrderPersonNationCode(e.detail.value!)}></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol size="8">
                  <IonItem>
                    <IonLabel position="floating"><small>No. Handphone</small></IonLabel>
                    <IonInput type="number" value={OrderPersonPhoneNumber} onIonChange={e => setOrderPersonPhoneNumber(e.detail.value!)}></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating"><small>Email</small></IonLabel>
                    <IonInput value={OrderPersonEmail} onIonChange={e => setOrderPersonEmail(e.detail.value!)}></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol size="12">
                  <IonButton className="text-transform-none" expand="block" onClick={()=>submitOrderPerson()}>Simpan</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={headerAlert}
          message={messageAlert}
          buttons={['OK']}
        />
    </div>
  );
}
