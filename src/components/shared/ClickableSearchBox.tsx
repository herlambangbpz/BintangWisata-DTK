import React from 'react';
import {
  IonToolbar,
  IonSearchbar
} from '@ionic/react';
export default function ClickableSearchBox({ placeholder, color}: { placeholder: any; color: any;clickRoute:any; }) {
  return (
      <IonToolbar color={color} className="search">
        <IonSearchbar placeholder={placeholder} mode="ios" className="ion-padding-top"></IonSearchbar>
      </IonToolbar>
  );
}
