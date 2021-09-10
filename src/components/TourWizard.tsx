import React, { useState } from "react";

import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
} from "@ionic/react";
import { calendarOutline, timerOutline } from "ionicons/icons";
import ModalTourDetail from "../components/ModalTourDetail";
import { ImageBasePath } from "../AppConfig";

export default function Tourwizard({
  WizardIndex,
  TourProductStartDate,
  TourProductDetail,
  TourBookingNumberOfPaxTotal,
  TourProductPricingIndex,
}: {
  WizardIndex: number;
  TourProductStartDate?: string;
  TourProductDetail: any;
  TourBookingNumberOfPaxTotal?: number;
  TourProductPricingIndex?: number;
}) {
  const [showModalTourDetail, setShowModalTourDetail] = useState(false);
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
              <span>{WizardIndex === 2 ? "✓" : "1"}</span> Bayar
            </IonText>
          </IonCol>
          <IonCol size="1" className="ion-text-center">
            <IonText color="light">--</IonText>
          </IonCol>
          <IonCol className={WizardIndex === 3 ? activeWizard : disableWizard}>
            <IonText color="light">
              <span>{WizardIndex === 3 ? "✓" : "1"}</span> Selesai
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="ion-margin-top">
          <IonCol>
            <IonCard className="product-card ion-no-margin">
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonText>{TourProductStartDate}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="3">
                    <img
                      src={
                        ImageBasePath +
                        TourProductDetail.TourProductModels.Imageheader
                      }
                      alt=""
                    />
                  </IonCol>
                  <IonCol>
                    <IonText>
                      <p className="ion-no-margin">
                        <small>
                          <b>
                            {
                              TourProductDetail.TourProductModels
                                .ProductTourName
                            }
                          </b>
                        </small>
                      </p>
                    </IonText>
                    <IonText>
                      <p className="ion-no-margin">
                        <small>{TourBookingNumberOfPaxTotal} Pax</small>
                      </p>
                    </IonText>
                    <IonText>
                      <a
                        className="ion-no-margin"
                        onClick={() => {
                          setShowModalTourDetail(true);
                        }}
                      >
                        <small>Informasi Produk</small>
                      </a>
                    </IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <div>
                      <IonText color="medium">
                        <h6>
                          <IonIcon icon={calendarOutline}></IonIcon> Hanya
                          berlaku pada tanggal keberangkatan yang dipilih
                        </h6>
                      </IonText>
                      <IonText color="medium">
                        <h6>
                          <IonIcon icon={timerOutline}></IonIcon> Reservasi
                          diharuskan min. 7 hari sebelum hari keberangkatan
                        </h6>{" "}
                      </IonText>{" "}
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
      <ModalTourDetail
        ShowModal={showModalTourDetail}
        TourProductStartDate={TourProductStartDate}
        TourProductDetail={TourProductDetail}
        TourProductPricingMaskapai={
          TourProductDetail.TourProductPricingList[TourProductPricingIndex || 0]
            .TourProductPricingMaskapai
        }
        Close={() => setShowModalTourDetail(false)}
      ></ModalTourDetail>
    </div>
  );
}
