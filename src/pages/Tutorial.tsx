import React, { useRef } from "react";
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonButton,
  IonSlides,
  IonSlide,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { ellipse } from "ionicons/icons";
import { setHasSeenTutorial } from "../data/user/user.actions";
import "./Tutorial.scss";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setHasSeenTutorial: typeof setHasSeenTutorial;
}
interface OwnProps {}
interface StateProps {
  TourBookingNumberOfAdult?: number;
  TourBookingNumberOfChild?: number;
  TourBookingNumberOfInfant?: number;
  TourBookingPriceTotal?: number;
  TourProductDetail?: any;
  TourProductPricingIndex?: number;
  TourProductStartDate?: string;
  TourBookingNumberOfPaxTotal?: number;
  UserData: any;
}
interface DispatchProps {}
interface TourCompleteProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
interface TutorialProps extends OwnProps, DispatchProps {}

const Tutorial: React.FC<TutorialProps> = ({ history, setHasSeenTutorial }) => {
  // const [showSkip, setShowSkip] = useState(true);
  const slideRef = useRef<HTMLIonSlidesElement>(null);

  const startApp = async () => {
    await setHasSeenTutorial(true);
    history.push("/main/index", { direction: "none" });
  };
  const nextSlide = () => {
    slideRef.current!.slideNext();
  };

  // const handleSlideChangeStart = () => {
  //   slideRef.current!.isEnd().then(isEnd => setShowSkip(!isEnd));
  // };

  return (
    <IonPage id="tutorial-page">
      <IonContent>
        <IonSlides ref={slideRef} pager={false}>
          <IonSlide>
            <img
              src="assets/img/Tutorial/onBoarding1.jpg"
              alt=""
              className="slide-image"
              width="100%"
            />
            <IonRow>
              <IonCol onClick={startApp}>Lewati</IonCol>
              <IonCol>
                <IonIcon icon={ellipse} color="primary"></IonIcon>
                <IonIcon icon={ellipse} color="medium"></IonIcon>
                <IonIcon icon={ellipse} color="medium"></IonIcon>
              </IonCol>
              <IonCol onClick={nextSlide}>Lanjutkan</IonCol>
            </IonRow>
          </IonSlide>

          <IonSlide>
            <img
              src="assets/img/Tutorial/onBoarding2.jpg"
              alt=""
              className="slide-image"
              width="100%"
            />
            <IonRow>
              <IonCol onClick={startApp}>Lewati</IonCol>
              <IonCol>
                <IonIcon icon={ellipse} color="medium"></IonIcon>
                <IonIcon icon={ellipse} color="primary"></IonIcon>
                <IonIcon icon={ellipse} color="medium"></IonIcon>
              </IonCol>
              <IonCol onClick={nextSlide}>Lanjutkan</IonCol>
            </IonRow>
          </IonSlide>

          <IonSlide>
            <img
              src="assets/img/Tutorial/onBoarding3.jpg"
              alt=""
              className="slide-image"
              width="100%"
            />
            <IonRow>
              <IonCol size="2"></IonCol>
              <IonCol>
                <IonButton
                  color="primary"
                  expand="block"
                  size="large"
                  onClick={startApp}
                >
                  MULAI SEKARANG
                </IonButton>
              </IonCol>
              <IonCol size="2"></IonCol>
            </IonRow>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setHasSeenTutorial,
  },
  component: Tutorial,
});
