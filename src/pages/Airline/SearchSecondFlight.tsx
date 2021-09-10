import {
  IonAlert,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  arrowForward,
  chevronBackOutline,
  ellipse,
  filter,
  funnel,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
// import { HTTP } from '@ionic-native/http';
import AirlineSearchFrom from "../../components/AirlineSearch/AirlineSearchForm";
import { setAirlineFlightArrival } from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
// import { AppId, MainUrl } from '../../AppConfig';
import { rupiah } from "../../helpers/currency";
import { stringDateConvert } from "../../helpers/datetime";
import "./Search.scss";
interface OwnProps {}
interface StateProps {
  AirlineBooking: any;
  UserData: any;
  AirlineFlightJourney: any;
  AirlineFlightDeparture: any;
}
interface DispatchProps {
  setAirlineFlightArrival: typeof setAirlineFlightArrival;
}
interface AirlineSearchSecondFlightProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineSearchSecondFlight: React.FC<AirlineSearchSecondFlightProps> = ({
  AirlineBooking,
  UserData,
  AirlineFlightDeparture,
  AirlineFlightJourney,
  setAirlineFlightArrival,
  history,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string>("biff");

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
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  // datepicker
  const today: Date = new Date();
  const tomorrow: Date = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    today.toISOString()
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    tomorrow.toISOString()
  );
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
  useIonViewDidEnter(() => {
    if (!AirlineFlightJourney) {
      history.replace("/airlineSearch");
    } else if (!AirlineFlightDeparture) {
      history.replace("/airlineSearchFirstFlight");
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/airlineSearchFirstFlight"
              icon={chevronBackOutline}
            ></IonBackButton>
          </IonButtons>
          <IonTitle className="ion-no-padding">
            <b>
              {AirlineBooking.AirlineBookingDestination} -{" "}
              {AirlineBooking.AirlineBookingOrigin}
            </b>
          </IonTitle>
          <IonTitle className="ion-sub-title ion-no-padding">
            {stringDateConvert(AirlineBooking.AirlineBookingArrivalDate)}{" "}
            <IonIcon icon={ellipse}></IonIcon>{" "}
            {AirlineBooking.AirlineBookingNumberOfPaxTotal} Orang
          </IonTitle>
          <IonButtons slot="end" className="ion-margin-end" hidden={true}>
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
        <IonGrid className="white-bg ion-padding">
          <IonRow className="ion-align-items-center">
            <IonCol size="2">
              <img src={"assets/icon/PlaneIcon.svg"} alt="" width="100%" />
            </IonCol>
            <IonCol size="8" style={{ fontSize: "12px" }}>
              <p className="ion-no-margin">
                <IonText color="medium">
                  {AirlineFlightDeparture
                    ? AirlineFlightDeparture.jiOrigin
                    : ""}{" "}
                  &nbsp;-&nbsp;
                  {AirlineFlightDeparture
                    ? AirlineFlightDeparture.jiDestination
                    : ""}
                  &nbsp; |&nbsp;
                </IonText>
                <IonText>
                  {AirlineFlightDeparture
                    ? AirlineFlightDeparture.jiDepartTime.substring(11, 16)
                    : ""}{" "}
                  &nbsp;-&nbsp;
                  {AirlineFlightDeparture
                    ? AirlineFlightDeparture.jiArrivalTime.substring(11, 16)
                    : ""}
                </IonText>
                <br />
                <IonText color="medium">
                  {AirlineFlightDeparture
                    ? AirlineFlightDeparture.segment[0].flightDetail[0]
                        .airlineCode
                    : ""}
                  &nbsp;
                  {AirlineFlightDeparture
                    ? AirlineFlightDeparture.segment[0].flightDetail[0]
                        .flightNumber
                    : ""}
                  &nbsp; |&nbsp; Sub Total &nbsp;
                </IonText>
                <IonText>
                  {rupiah(
                    AirlineFlightDeparture ? AirlineFlightDeparture.sumPrice : 0
                  )}
                </IonText>
                <IonText color="medium">/org</IonText>
              </p>
            </IonCol>
            <IonCol
              size="2"
              className="ion-text-right"
              onClick={() => {
                history.goBack();
              }}
            >
              <IonText color="primary">Ganti</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonHeader>
      <IonContent fullscreen={true} class="airlineSearch gray-bg">
        {AirlineFlightJourney && AirlineFlightJourney.Return
          ? AirlineFlightJourney.Return.map((item, index) => (
              <IonCard
                className="ion-p-8"
                key={index}
                onClick={() => {
                  setAirlineFlightArrival(item);
                  history.push("/airlineFlightInformation");
                }}
              >
                <IonGrid>
                  <IonRow>
                    <IonCol size="2">
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
          </div>
        </div>
        <IonCard
          className="tourSearchFilterSort"
          hidden={true}
          onClick={() => setShowModal(true)}
        >
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
        <IonModal isOpen={showModal}>
          <IonContent>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  <b>Urutkan</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="MustNoPadding">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonRadioGroup
                        value={selected}
                        onIonChange={(e) => setSelected(e.detail.value)}
                      >
                        <IonItem>
                          <IonLabel>Harga Terendah</IonLabel>
                          <IonRadio slot="end" value="price" />
                        </IonItem>
                        <IonItem>
                          <IonLabel>Berangkat Paling Awal</IonLabel>
                          <IonRadio slot="end" value="departuredesc" />
                        </IonItem>
                        <IonItem>
                          <IonLabel>Berangkat Paling Akhir</IonLabel>
                          <IonRadio slot="end" value="departureasc" />
                        </IonItem>
                        <IonItem>
                          <IonLabel>Tiba Paling Awal</IonLabel>
                          <IonRadio slot="end" value="arrivaldesc" />
                        </IonItem>
                        <IonItem>
                          <IonLabel>Tiba Paling Akhir</IonLabel>
                          <IonRadio slot="end" value="arrivaldasc" />
                        </IonItem>
                        <IonItem>
                          <IonLabel>Durasi Tersingkat</IonLabel>
                          <IonRadio slot="end" value="duration" />
                        </IonItem>
                      </IonRadioGroup>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Tipe Produk</Typography>
              </AccordionSummary>
              <AccordionDetails className="MustNoPadding">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonItem lines="full">
                        <img
                          slot="start"
                          src="assets/img/Services/Airplane.svg"
                          alt=""
                          width="24px"
                        />
                        <IonLabel slot="start">Pesawat</IonLabel>
                        <IonCheckbox slot="end" value="Airplane" />
                      </IonItem>
                      <IonItem lines="full">
                        <img
                          slot="start"
                          src="assets/img/Services/Hotel.svg"
                          alt=""
                          width="24px"
                        />
                        <IonLabel slot="start">Hotel</IonLabel>
                        <IonCheckbox slot="end" value="Hotel" />
                      </IonItem>
                      <IonItem lines="full">
                        <img
                          slot="start"
                          src="assets/img/Services/Tour.svg"
                          alt=""
                          width="24px"
                        />
                        <IonLabel slot="start">Tur</IonLabel>
                        <IonCheckbox slot="end" value="Tur" />
                      </IonItem>
                      <IonItem lines="full">
                        <img
                          slot="start"
                          src="assets/img/Services/Bus.svg"
                          alt=""
                          width="24px"
                        />
                        <IonLabel slot="start">Bus</IonLabel>
                        <IonCheckbox slot="end" value="Bus" />
                      </IonItem>
                      <IonItem lines="full">
                        <img
                          slot="start"
                          src="assets/img/Services/Ship.svg"
                          alt=""
                          width="24px"
                        />
                        <IonLabel slot="start">PELNI</IonLabel>
                        <IonCheckbox slot="end" value="PELNI" />
                      </IonItem>
                      <IonItem lines="full">
                        <img
                          slot="start"
                          src="assets/img/Services/Phone.svg"
                          alt=""
                          width="24px"
                        />
                        <IonLabel slot="start">Top up</IonLabel>
                        <IonCheckbox slot="end" value="Top up" />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </AccordionDetails>
            </Accordion>
            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              cssClass="alert"
              header={headerAlert}
              message={messageAlert}
              buttons={["OK"]}
            />
          </IonContent>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => setShowModal(false)}
                color="light"
                expand="block"
              >
                Reset
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={() => setShowModal(false)}
                color="primary"
                expand="block"
                className="text-transform-none"
              >
                Simpan
              </IonButton>
            </IonCol>
          </IonRow>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineBooking: selectors.getAirlineBooking(state),
    UserData: selectors.getUserData(state),
    AirlineFlightJourney: state.airline.AirlineFlightJourney,
    AirlineFlightDeparture: state.airline.AirlineFlightDeparture,
  }),
  mapDispatchToProps: { setAirlineFlightArrival },
  component: React.memo(withRouter(AirlineSearchSecondFlight)),
});
