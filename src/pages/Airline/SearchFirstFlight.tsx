import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import {
  arrowForward,
  chevronBackOutline,
  ellipse,
  filter,
  funnel,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
// import { AppId, MainUrl } from '../../AppConfig';
// import { HTTP } from '@ionic-native/http';
import AirlineSearchFrom from "../../components/AirlineSearch/AirlineSearchForm";
import AirlineSearchUpdateButton from "../../components/AirlineSearch/AirlineSearchUpdateButton";
import { setAirlineFlightDeparture } from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { rupiah } from "../../helpers/currency";
import { stringDateConvert } from "../../helpers/datetime";
import "./SearchFirstFlight.scss";

interface OwnProps {}
interface StateProps {
  AirlineBooking: any;
  UserData: any;
  AirlineFlightJourney: any;
}
interface DispatchProps {
  setAirlineFlightDeparture: typeof setAirlineFlightDeparture;
}
interface SearchFirstFlightProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineSearchFirstFlight: React.FC<SearchFirstFlightProps> = ({
  AirlineBooking,
  UserData,
  AirlineFlightJourney,
  setAirlineFlightDeparture,
  history,
}) => {
  const [BottomDrawerIsOpen, setBottomDrawerIsOpen] = useState(false);
  const [BottomDrawerIsDestroy, setBottomDrawerIsDestroy] = useState(true);
  const [BottomDrawerOpacityStyle, setBottomDrawerOpacityStyle] = useState({
    opacity: "0",
    "z-index": "-9999",
    display: "none",
  });
  const [BottomDrawerCardStyle, setBottomDrawerCardStyle] = useState({
    bottom: "-100vh",
  });
  useEffect(() => {
    if (BottomDrawerIsDestroy) {
      // open
      setBottomDrawerCardStyle({ bottom: "-100vh" });
      setBottomDrawerOpacityStyle({
        opacity: "0",
        "z-index": "9999",
        display: "block",
      });

      setTimeout(() => {
        setBottomDrawerIsOpen(false);
        setBottomDrawerOpacityStyle({
          opacity: "0",
          "z-index": "-9999",
          display: "none",
        });
      }, 500);
    } else {
      // close
      setBottomDrawerIsOpen(true);
      setBottomDrawerOpacityStyle({
        opacity: "0",
        "z-index": "9999",
        display: "block",
      });
      setTimeout(() => {
        setBottomDrawerCardStyle({ bottom: "0" });
        setBottomDrawerOpacityStyle({
          opacity: "1",
          "z-index": "9999",
          display: "block",
        });
      }, 100);
    }
  }, [BottomDrawerIsDestroy]);
  useEffect(() => {
    if (AirlineFlightJourney) {
      setBottomDrawerIsDestroy(true);
    }
  }, [AirlineFlightJourney]);
  useIonViewDidEnter(() => {
    if (!AirlineFlightJourney) {
      history.replace("/airlineSearch");
    }
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/airlineSearch"
              icon={chevronBackOutline}
            ></IonBackButton>
          </IonButtons>
          <IonTitle className="ion-no-padding">
            <b>
              {AirlineBooking.AirlineBookingOrigin} -{" "}
              {AirlineBooking.AirlineBookingDestination}
            </b>
          </IonTitle>
          <IonTitle className="ion-sub-title ion-no-padding">
            {stringDateConvert(AirlineBooking.AirlineBookingDepartureDate)}{" "}
            <IonIcon icon={ellipse}></IonIcon>{" "}
            {AirlineBooking.AirlineBookingNumberOfPaxTotal} Orang
          </IonTitle>
          <IonButtons slot="end" className="ion-margin-end">
            <IonButton
              className="btn-outline-light text-transform-none"
              onClick={() => {
                setBottomDrawerIsDestroy(false);
              }}
            >
              Ubah
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="airlineSearch gray-bg">
        {AirlineFlightJourney && AirlineFlightJourney.Departure
          ? AirlineFlightJourney.Departure.map((item, index) => (
              <IonCard
                className="ion-p-8"
                key={index}
                onClick={async () => {
                  setAirlineFlightDeparture(item);
                  if (AirlineBooking.AirlineBookingTripType === "OneWay") {
                    history.push("/airlineFlightInformation");
                  } else {
                    history.push("/airlineSearchSecondFlight");
                  }
                }}
              >
                <IonGrid>
                  <IonRow>
                    <IonCol size="2">
                      {/* <img
                        src={
                          "assets/img/domestic-airlines/ic_maskapai_lion.png"
                        }
                        alt=""
                      /> */}
                      <img
                        src={
                          "assets/img/Airlines/" +
                          item.airlineID.toLowerCase() +
                          "/" +
                          item.airlineID.toLowerCase() +
                          ".png"
                        }
                        alt=""
                      />
                    </IonCol>
                    <IonCol>
                      {item.segment[0].flightDetail[0].airlineCode}&nbsp;
                      {item.segment[0].flightDetail[0].flightNumber}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="2">
                      <p className="ion-text-center">
                        <IonText>{item.jiDepartTime.substring(11, 16)}</IonText>
                        <br />
                        <IonBadge color="light">
                          <IonText color="medium">{item.jiOrigin}</IonText>
                        </IonBadge>
                      </p>
                    </IonCol>
                    <IonCol size="2">
                      <img
                        src={"assets/icon/airlinehub.svg"}
                        alt=""
                        width="100%"
                      />
                    </IonCol>
                    <IonCol size="2">
                      <p className="ion-text-center">
                        <IonText>
                          {item.jiArrivalTime.substring(11, 16)}
                        </IonText>
                        <br />
                        <IonBadge color="light">
                          <IonText color="medium">{item.jiDestination}</IonText>
                        </IonBadge>
                      </p>
                    </IonCol>
                    <IonCol className="ion-text-end">
                      <IonIcon
                        size="large"
                        color="primary"
                        icon={arrowForward}
                      ></IonIcon>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonText color="primary">
                        <b>{rupiah(item.sumPrice)}</b>
                      </IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCard>
            ))
          : ""}

        <div className="bottomDrawer" hidden={!BottomDrawerIsOpen}>
          <div
            className="bottomDrawerOpacity"
            onClick={() => {
              setBottomDrawerIsDestroy(true);
            }}
            style={BottomDrawerOpacityStyle}
          ></div>
          <div className="bottomDrawerCard" style={BottomDrawerCardStyle}>
            <div
              className="bottomDrawerDragPad"
              onClick={() => {
                setBottomDrawerIsDestroy(true);
              }}
            ></div>
            <AirlineSearchFrom></AirlineSearchFrom>
            <AirlineSearchUpdateButton></AirlineSearchUpdateButton>
          </div>
        </div>
        <IonCard className="tourSearchFilterSort" hidden={true}>
          <IonCardContent>
            <IonRow>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={filter} color="primary"></IonIcon>
                <IonText color="primary">&nbsp; Urutkan</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={funnel} color="primary"></IonIcon>
                <IonText color="primary">&nbsp; Filter</IonText>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineBooking: selectors.getAirlineBooking(state),
    UserData: selectors.getUserData(state),
    AirlineFlightJourney: state.airline.AirlineFlightJourney,
  }),
  mapDispatchToProps: { setAirlineFlightDeparture },
  component: React.memo(withRouter(AirlineSearchFirstFlight)),
});
