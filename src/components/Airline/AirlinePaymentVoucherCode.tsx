import React, { useState } from "react";

import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonText,
  IonModal,
  IonContent,
  IonRippleEffect,
  IonIcon,
  IonButton,
  IonFooter,
  IonSlides,
  IonSlide,
  isPlatform,
  IonItem,
  IonInput,
  IonLabel,
} from "@ionic/react";
import DefaultToolbar from "../shared/DefaultToolbar";

export default function AirlinePaymentVoucherCode({}: // TourProductAddOnList,
// TourBookingPriceTotal,
// SetAddOnPrice,
{
  // TourProductAddOnList: any;
  // TourBookingPriceTotal?: number;
  // SetAddOnPrice: any;
}) {
  const [ModalVoucher, setModalVoucher] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <>
      <IonText class="ion-padding">Kode Voucher</IonText>
      <IonCard
        className="ion-activatable ripple-parent ion-margin-bottom"
        onClick={() => setModalVoucher(true)}
      >
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonText color="dark">
                  {/* <h6>
                      {paymentPaymentMethod !== ""
                        ? paymentPaymentMethod
                        : "Pilih metode pembayaran"}
                    </h6> */}
                  <h6>{"Masukan Kode Voucher di sini"}</h6>
                </IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText color="primary">
                  <b>Pilih</b>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonRippleEffect></IonRippleEffect>
        </IonCardContent>
      </IonCard>
      {/* Modal Choose Payment */}
      <IonModal isOpen={ModalVoucher}>
        <IonContent className="gray-bg">
          <DefaultToolbar
            title="Kode Voucher"
            color="primary"
            backButtonRoute={() => {
              setModalVoucher(false);
            }}
          />
          <IonGrid className="ion-padding white-bg ion-margin-top">
            <IonRow>
              <IonCol size="7">
                <IonItem>
                  <IonLabel position="floating">
                    <small>Masukkan voucher di sini</small>
                  </IonLabel>
                  <IonInput></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="5">
                <IonButton
                  className="text-transform-none ion-margin-top"
                  expand="block"
                  onClick={() => setModalVoucher(false)}
                >
                  Pakai Voucher
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </>
  );
}
