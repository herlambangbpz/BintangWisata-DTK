import React, { useState } from 'react';

import { IonCard, IonGrid, IonRow, IonCol, IonCardContent, IonText,  IonItem,  IonModal, IonContent, IonButton,  IonRippleEffect, IonIcon, IonTextarea } from '@ionic/react';
import DefaultToolbar from './shared/DefaultToolbar';
import { add } from 'ionicons/icons';

export default function TourOrderSpecialRequest({}: {}) {
  const [Modal, setModal] = useState(false);
  const [SpecialRequest, setSpecialRequest] = useState<string>(localStorage.TourOrderSpecialRequest||'');
  const submitSpecialRequest = () =>{
    localStorage.setItem("TourOrderSpecialRequest",SpecialRequest)
    setModal(false);
  }
  const closeModal = () =>{
    setSpecialRequest(localStorage.TourOrderSpecialRequest||'')
    setModal(false);
  }
  return (
    <div className="ion-no-padding">
      <IonText class="ion-padding" color="dark">
          <small>Permintaan Khusus (Opsional)</small>
        </IonText>
        <IonCard className="ion-activatable ripple-parent ion-margin-bottom" onClick={()=>setModal(true)}>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <h6>Permintaan khusus (Opsional)</h6>
                  </IonText>
                  <IonText><small>Opsional</small></IonText>
                </IonCol>
                <IonCol className="ion-text-right">
                  <IonIcon icon={add} color="primary" size="large"></IonIcon>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonRippleEffect></IonRippleEffect>
          </IonCardContent>
        </IonCard>
        {/* Modal Order Special Requests */}
        <IonModal isOpen={Modal}>
          <IonContent className="gray-bg">
            <DefaultToolbar
              title="Permintaan Khusus (Opsional)" color="primary" backButtonRoute={() => {closeModal()}}
            />
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonItem lines="none">
                    <IonTextarea placeholder="Tulis permintaan khusus atau catatan tentang perjalanan Anda di sini" value={SpecialRequest} onIonChange={e => setSpecialRequest(e.detail.value!)}></IonTextarea>
                  </IonItem>
                  <IonText>
                    <p className="ion-no-margin ion-margin-bottom">
                      <small>
                      Format: Tulis catatan dalam bahasa Inggris atau bahasa lokal tujuan.
                    Permintaan bergantung pada ketersediaan operator.
                      </small>
                    </p>
                  </IonText>
                </IonCol>
                <IonCol size="12">
                  <IonButton className="text-transform-none" expand="block" onClick={()=>submitSpecialRequest()}>Simpan</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
    </div>
  );
}
