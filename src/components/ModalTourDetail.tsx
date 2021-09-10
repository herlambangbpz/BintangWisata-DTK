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
export default function ModalTourDetail({
  ShowModal,
  Close,
  TourProductDetail,
  TourProductStartDate,
  TourProductPricingMaskapai,
}: {
  ShowModal: boolean;
  Close: any;
  TourProductDetail?: any;
  TourProductStartDate?: string;
  TourProductPricingMaskapai?: string;
}) {
  return (
    <IonModal isOpen={ShowModal}>
      <IonContent>
        <DefaultToolbar
          title="Informasi Produk"
          color="primary"
          backButtonRoute={Close}
        />
        <img
          src={ImageBasePath + TourProductDetail.TourProductModels.Imageheader}
          width="100%"
          alt=""
        />

        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonText>
                {TourProductDetail.TourProductModels.ProductTourName}
              </IonText>
            </IonCol>
            <IonCol>
              <IonCol size="12">
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Berangkat</small>
                    </IonText>
                    <IonText>
                      <h6>{TourProductStartDate}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Durasi</small>
                    </IonText>
                    <IonText>
                      <h6>
                        {
                          TourProductDetail.TourProductModels
                            .ProductTourDuration
                        }
                      </h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Maskapai</small>
                    </IonText>
                    <IonText>
                      <h6>{TourProductPricingMaskapai}</h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Lokasi</small>
                    </IonText>
                    <IonText>
                      <h6>
                        {TourProductDetail.TourProductModels.ProductTourCountry}
                      </h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Tipe</small>
                    </IonText>
                    <IonText>
                      <h6>
                        {
                          TourProductDetail.TourProductModels
                            .ProductTourCategory
                        }
                      </h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Pengalaman</small>
                    </IonText>
                    <IonText>
                      <h6>
                        {
                          TourProductDetail.TourProductModels
                            .ProductTourActivity
                        }
                      </h6>
                    </IonText>
                  </div>
                </IonItem>
                <IonItem>
                  <div>
                    <IonText color="medium">
                      <small>Pemandu</small>
                    </IonText>
                    <IonText>
                      <h6>
                        {
                          TourProductDetail.TourProductModels
                            .ProductTourTourGuideLanguage
                        }
                      </h6>
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
