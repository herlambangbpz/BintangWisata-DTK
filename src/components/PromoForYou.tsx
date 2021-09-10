import React from "react";
import {
  IonSlides,
  IonSlide,
  IonGrid,
  IonRow,
  IonCol,
  IonTitle,
  IonRouterLink,
  IonIcon,
} from "@ionic/react";
import { chevronForward } from "ionicons/icons";
const slideOpts = {
  freeMode: true,
  slidesPerView: 1.2,
  spaceBetween: 20,
};
export default function PromoForYou() {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="8">
          <IonTitle className="ion-no-padding">Promo buat kamu</IonTitle>
        </IonCol>
        <IonCol size="4" className="ion-text-right">
          <IonRouterLink>
            lihat semua <IonIcon icon={chevronForward}></IonIcon>
          </IonRouterLink>
        </IonCol>
        <IonCol size="12">
          <IonSlides options={slideOpts} class="customFreeSlides">
            <IonSlide>
              <img
                src="assets/img/promo/Promo-1.jpg"
                alt="promo-1"
                width="100%"
                className="shadow-card"
              />
            </IonSlide>
            <IonSlide>
              <img
                src="assets/img/promo/Promo-2.jpg"
                alt="promo-2"
                width="100%"
                className="shadow-card"
              />
            </IonSlide>
          </IonSlides>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
