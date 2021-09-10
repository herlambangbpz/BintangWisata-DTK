import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonBadge,
  IonSlides,
  IonSlide,
  IonToolbar,
  IonPage,
  IonHeader,
  IonCol,
  IonRow,
  IonGrid,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { connect } from "../../data/connect";
import { RouteComponentProps, withRouter } from "react-router";

import "./LightBox.scss";
import { ImageBasePath } from "../../AppConfig";
interface OwnProps {}
interface StateProps {
  TourProductDetail?: any;
}
interface DispatchProps {}
interface TourLightBoxProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
interface TourLightBoxProps extends RouteComponentProps {}
const TourLightBox: React.FC<TourLightBoxProps> = ({
  history,
  TourProductDetail,
}) => {
  localStorage.setItem("fromLightBox", "true");
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const fullSlideRef = useRef<HTMLIonSlidesElement>(null);
  const thumbSlideRef = useRef<HTMLIonSlidesElement>(null);
  const changeSlide = (index: number) => {
    fullSlideRef.current!.slideTo(index);
    thumbSlideRef.current!.slideTo(index);
    setSlideIndex(index);
    localStorage.setItem("activeTourSlider", `${index}`);
  };
  const changeFullSlider = () => {
    fullSlideRef.current!.getActiveIndex().then((index) => {
      thumbSlideRef.current!.slideTo(index);
      setSlideIndex(index);
      localStorage.setItem("activeTourSlider", `${index}`);
    });
  };
  const fullLightBoxSlides = {
    slidesPerView: 1,
    initialSlide: localStorage.getItem("activeTourSlider")
      ? parseInt(localStorage.activeTourSlider)
      : 0,
  };
  const thumbLightBoxSlides = {
    freeMode: true,
    slidesPerView: 3.2,
    spaceBetween: 10,
    initialSlide: localStorage.getItem("activeTourSlider")
      ? parseInt(localStorage.activeTourSlider)
      : 0,
  };
  return (
    <IonPage>
      <IonContent fullscreen={true} className="tourLightBox">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/main/index"
                color="light"
                icon={close}
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="full-lightbox-slides">
          {TourProductDetail ? (
            <IonSlides
              options={fullLightBoxSlides}
              ref={fullSlideRef}
              onIonSlideDidChange={() => changeFullSlider()}
            >
              {TourProductDetail.TourProductImageList.map(
                (item: any, index: number) => (
                  <IonSlide key={index}>
                    <img
                      src={ImageBasePath + item.TPImageImagePath}
                      width="100%"
                      alt=""
                    />
                  </IonSlide>
                )
              )}
            </IonSlides>
          ) : (
            ""
          )}
        </div>
        <div className="thumb-lightbox-slides">
          <IonGrid className="imageIndex">
            <IonRow>
              <IonCol className="ion-text-right">
                <IonBadge color="dark">
                  {slideIndex + 1}/
                  {TourProductDetail !== null
                    ? TourProductDetail.TourProductImageList.length
                    : 1}
                </IonBadge>
              </IonCol>
            </IonRow>
          </IonGrid>
          {TourProductDetail ? (
            <IonSlides options={thumbLightBoxSlides} ref={thumbSlideRef}>
              {TourProductDetail.TourProductImageList.map(
                (item: any, index: number) => (
                  <IonSlide key={index} onClick={() => changeSlide(index)}>
                    <img
                      src={ImageBasePath + item.TPImageImagePath}
                      width="100%"
                      alt=""
                    />
                  </IonSlide>
                )
              )}
            </IonSlides>
          ) : (
            ""
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    TourProductDetail: state.tour.TourProductDetail,
  }),
  mapDispatchToProps: {},
  component: React.memo(withRouter(TourLightBox)),
});
