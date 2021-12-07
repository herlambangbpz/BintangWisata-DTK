import React, { useState } from "react";
import { IonGrid, IonRow, IonCol, IonText } from "@ionic/react";
import { Collapse } from "antd";
import HotelPanel from "./HotelPanel";
const { Panel } = Collapse;
export default function HotelWizard({
  WizardIndex,
  HotelPanelData,
}: {
  WizardIndex: number;
  HotelPanelData: any;
}) {
  const disableWizard = "ion-text-center col-disable";
  const activeWizard = "ion-text-center";
  return (
    <div>
      {/* Wizard Header */}
      <IonGrid className="wizardHeader">
        <IonRow>
          <IonCol className={WizardIndex === 1 ? activeWizard : disableWizard}>
            <IonText color="light">
              <span>{WizardIndex === 1 ? "✓" : "1"} </span> Pesan
            </IonText>
          </IonCol>
          <IonCol size="1" className="ion-text-center">
            <IonText color="light">--</IonText>
          </IonCol>
          <IonCol className={WizardIndex === 2 ? activeWizard : disableWizard}>
            <IonText color="light">
              <span>{WizardIndex === 2 ? "✓" : "2"}</span> Bayar
            </IonText>
          </IonCol>
          <IonCol size="1" className="ion-text-center">
            <IonText color="light">--</IonText>
          </IonCol>
          <IonCol className={WizardIndex === 3 ? activeWizard : disableWizard}>
            <IonText color="light">
              <span>{WizardIndex === 3 ? "✓" : "3"}</span> Selesai
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="ion-margin-top">
          <IonCol>
            <HotelPanel
              Open={false}
              HotelPanelData={HotelPanelData}
            ></HotelPanel>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
}
