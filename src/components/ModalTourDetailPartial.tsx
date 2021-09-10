import React from "react";
import {
  IonModal,
  IonContent,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import DefaultToolbar from "./shared/DefaultToolbar";
import { ImageBasePath } from "../AppConfig";
export default function ModalTourDetailPartial({
  ShowModal,
  CloseModalFunction,
  Name,
  Date,
  Duration,
  Airlines,
  Country,
  TourCategory,
  Activity,
  GuideLeanguage,
  Image,
}: {
  ShowModal: boolean;
  CloseModalFunction: any;
  Name: string;
  Date: string;
  Duration: string;
  Airlines: string;
  Country: string;
  TourCategory: string;
  Activity: string;
  GuideLeanguage: string;
  Image: string;
}) {
  return (
    <IonModal isOpen={ShowModal}>
      <IonContent>
        <DefaultToolbar
          title="Informasi Produk"
          color="primary"
          backButtonRoute={CloseModalFunction}
        />
        <img src={ImageBasePath + Image} width="100%" alt="" />
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonText>{Name}</IonText>
            </IonCol>
            <IonCol>
              <IonCol size="12">
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Berangkat</small>
                    </IonText>
                    <IonText>
                      <h6>{Date}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Durasi</small>
                    </IonText>
                    <IonText>
                      <h6>{Duration}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Maskapai</small>
                    </IonText>
                    <IonText>
                      <h6>{Airlines}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Lokasi</small>
                    </IonText>
                    <IonText>
                      <h6>{Country}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Tipe</small>
                    </IonText>
                    <IonText>
                      <h6>{TourCategory}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Pengalaman</small>
                    </IonText>
                    <IonText>
                      <h6>{Activity}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Pemandu</small>
                    </IonText>
                    <IonText>
                      <h6>{GuideLeanguage}</h6>
                    </IonText>
                  </div>
                </IonItem>
              </IonCol>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}
