import React from 'react';
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton
} from '@ionic/react';
import { close, chevronBackOutline} from 'ionicons/icons';
export default function DefaultToolbar({ title, color,backButtonRoute}: { title: any; color: any;backButtonRoute:any;}) {
  if(typeof backButtonRoute === "function"){
    return (
      <IonToolbar color={color}>
        <IonButtons slot="start">
          <IonButton onClick={backButtonRoute} >
          <IonIcon icon={close}>
          </IonIcon>
          </IonButton>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    );
  }else{
    return (
      <IonToolbar className="center-title-toolbar" color={color}>
        <IonButtons slot="start">
          <IonBackButton defaultHref={backButtonRoute} icon={chevronBackOutline}/>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    );
  }
}
