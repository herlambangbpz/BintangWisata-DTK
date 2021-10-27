import DateFnsUtils from "@date-io/date-fns";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonLabel,
  IonRow,
  IonText,
} from "@ionic/react";
import Grid from "@material-ui/core/Grid";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Switch } from "antd";
import "date-fns";
import idLocale from "date-fns/locale/id";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  setAirlineBookingArrivalDate,
  setAirlineBookingDepartureDate,
  setAirlineBookingNumberOfAdult,
  setAirlineBookingNumberOfChild,
  setAirlineBookingNumberOfInfant,
  setAirlineBookingNumberOfPaxTotal,
  setAirlineBookingTripType,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { stringDateConvert } from "../../helpers/datetime";
import AirlineSearchFormArrival from "./AirlineSearchFormArrival";
import AirlineSearchFormDeparture from "./AirlineSearchFormDeparture";

interface OwnProps {}
interface StateProps {
  AirlineBooking: any;
  ABDD: any;
  ABAD: any;
}
interface DispatchProps {
  setAirlineBookingDepartureDate: typeof setAirlineBookingDepartureDate;
  setAirlineBookingArrivalDate: typeof setAirlineBookingArrivalDate;
  setAirlineBookingTripType: typeof setAirlineBookingTripType;
  setAirlineBookingNumberOfAdult: typeof setAirlineBookingNumberOfAdult;
  setAirlineBookingNumberOfChild: typeof setAirlineBookingNumberOfChild;
  setAirlineBookingNumberOfInfant: typeof setAirlineBookingNumberOfInfant;
  setAirlineBookingNumberOfPaxTotal: typeof setAirlineBookingNumberOfPaxTotal;
}
interface AirlineSearchFromProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineSearchFrom: React.FC<AirlineSearchFromProps> = ({
  AirlineBooking,
  ABDD,
  ABAD,
  setAirlineBookingDepartureDate,
  setAirlineBookingArrivalDate,
  setAirlineBookingTripType,
  setAirlineBookingNumberOfAdult,
  setAirlineBookingNumberOfChild,
  setAirlineBookingNumberOfInfant,
  setAirlineBookingNumberOfPaxTotal,
}) => {
  useEffect(() => {
    setAirlineBookingNumberOfPaxTotal(
      AirlineBooking.AirlineBookingNumberOfAdult +
        AirlineBooking.AirlineBookingNumberOfChild +
        AirlineBooking.AirlineBookingNumberOfInfant
    );
  }, [AirlineBooking]);
  const [DepartureDatepickerOpen, setDepartureDatepickerOpen] = useState(false);
  const [ArrivalDatepickerOpen, setArrivalDatepickerOpen] = useState(false);
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
  const handleDepartureDateChange = (date) => {
    if (date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      alert("Tanggal tidak bisa dipilih");
      return;
    }
    if (date.setHours(0, 0, 0, 0) > ABAD.setHours(0, 0, 0, 0)) {
      const TempDate = new Date(date);
      const AddedDate = new Date(TempDate.setDate(date.getDate() + 1));
      setAirlineBookingArrivalDate(AddedDate);
    }
    setAirlineBookingDepartureDate(date);
  };
  const handleArrivalDateChange = (date) => {
    if (
      date.setHours(0, 0, 0, 0) <
      new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
        0,
        0,
        0,
        0
      )
    ) {
      alert("Tanggal tidak bisa dipilih");
      return;
    }
    if (date.setHours(0, 0, 0, 0) < ABDD.setHours(0, 0, 0, 0)) {
      const TempDate = new Date(date);
      const AddedDate = new Date(TempDate.setDate(date.getDate() + -1));
      setAirlineBookingDepartureDate(AddedDate);
    }
    setAirlineBookingArrivalDate(date);
  };
  // BottomDrawer Style Function
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
  return (
    <>
      <AirlineSearchFormDeparture></AirlineSearchFormDeparture>
      <AirlineSearchFormArrival></AirlineSearchFormArrival>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={idLocale}>
        <Grid container justify="space-around">
          <DatePicker
            margin="normal"
            open={DepartureDatepickerOpen}
            hidden={true}
            onOpen={() => setDepartureDatepickerOpen(true)}
            onClose={() => setDepartureDatepickerOpen(false)}
            format="d MMM yyyy"
            value={AirlineBooking.AirlineBookingDepartureDate}
            onChange={handleDepartureDateChange}
          />
          <DatePicker
            margin="normal"
            open={ArrivalDatepickerOpen}
            hidden={true}
            onOpen={() => setArrivalDatepickerOpen(true)}
            onClose={() => setArrivalDatepickerOpen(false)}
            format="d MMM yyyy"
            value={AirlineBooking.AirlineBookingArrivalDate}
            onChange={handleArrivalDateChange}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <IonRow className="bb-lightgray-1">
        <IonCol size="9">
          <IonLabel color="medium">
            <small>Tanggal Berangkat</small>
          </IonLabel>
        </IonCol>
        <IonCol size="3">
          <IonLabel color="medium">
            <small>Pergi Pulang?</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/Datepicker.svg" alt="" />
        </IonCol>
        <IonCol
          size="8"
          onClick={() => {
            setDepartureDatepickerOpen(true);
          }}
        >
          <IonLabel>
            {stringDateConvert(
              AirlineBooking.AirlineBookingDepartureDate
                ? AirlineBooking.AirlineBookingDepartureDate.toISOString()
                : ""
            )}
          </IonLabel>
        </IonCol>
        <IonCol size="3">
          <Switch
            size="small"
            checked={
              AirlineBooking.AirlineBookingTripType == "RoundTrip"
                ? true
                : false
            }
            onClick={(c) =>
              setAirlineBookingTripType(c ? "RoundTrip" : "OneWay")
            }
          />
        </IonCol>
      </IonRow>
      <IonRow
        className="bb-lightgray-1"
        hidden={
          AirlineBooking.AirlineBookingTripType == "RoundTrip" ? false : true
        }
      >
        <IonCol size="12">
          <IonLabel color="medium">
            <small>Tanggal Pulang</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/Datepicker.svg" alt="" />
        </IonCol>
        <IonCol
          onClick={() => {
            setArrivalDatepickerOpen(true);
          }}
        >
          <IonLabel>
            {stringDateConvert(
              AirlineBooking.AirlineBookingArrivalDate
                ? AirlineBooking.AirlineBookingArrivalDate.toISOString()
                : ""
            )}
          </IonLabel>
        </IonCol>
      </IonRow>
      <IonRow
        className="bb-lightgray-1"
        onClick={() => {
          setBottomDrawerIsDestroy(false);
        }}
      >
        <IonCol size="12">
          <IonLabel color="medium">
            <small>Penumpang</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/User.svg" alt="" />
        </IonCol>
        <IonCol>
          <IonLabel>
            {AirlineBooking.AirlineBookingNumberOfPaxTotal} Penumpang
          </IonLabel>
        </IonCol>
      </IonRow>
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
          <div className="ion-text-center ion-margin">
            <IonLabel>
              <b>Jumlah Penumpang</b>
            </IonLabel>
          </div>
          <IonGrid className="bt-lightgray-1">
            <IonRow>
              <IonCol>
                <p className="ion-no-margin">
                  <IonText>Dewasa</IonText>
                  <br />
                  <IonText color="medium">
                    <small>Usia 12+</small>
                  </IonText>
                </p>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonButton
                  onClick={() =>
                    setAirlineBookingNumberOfAdult(
                      AirlineBooking.AirlineBookingNumberOfPaxTotal > 1 &&
                        AirlineBooking.AirlineBookingNumberOfAdult > 0
                        ? AirlineBooking.AirlineBookingNumberOfAdult - 1
                        : AirlineBooking.AirlineBookingNumberOfAdult
                    )
                  }
                  size="small"
                  color="light"
                  className="btn"
                >
                  -
                </IonButton>
                <IonButton
                  size="small"
                  className="btn btn-outline-primary "
                  disabled={true}
                >
                  {AirlineBooking.AirlineBookingNumberOfAdult}
                </IonButton>
                <IonButton
                  onClick={() =>
                    setAirlineBookingNumberOfAdult(
                      AirlineBooking.AirlineBookingNumberOfAdult + 1
                    )
                  }
                  size="small"
                  className="btn btn-outline-primary "
                >
                  +
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <p className="ion-no-margin">
                  <IonText>Anak</IonText>
                  <br />
                  <IonText color="medium">
                    <small>Usia 2-11</small>
                  </IonText>
                </p>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonButton
                  onClick={() =>
                    setAirlineBookingNumberOfChild(
                      AirlineBooking.AirlineBookingNumberOfPaxTotal > 1 &&
                        AirlineBooking.AirlineBookingNumberOfChild > 0
                        ? AirlineBooking.AirlineBookingNumberOfChild - 1
                        : AirlineBooking.AirlineBookingNumberOfChild
                    )
                  }
                  size="small"
                  color="light"
                  className="btn"
                >
                  -
                </IonButton>
                <IonButton
                  size="small"
                  className="btn btn-outline-primary "
                  disabled={true}
                >
                  {AirlineBooking.AirlineBookingNumberOfChild}
                </IonButton>
                <IonButton
                  onClick={() =>
                    setAirlineBookingNumberOfChild(
                      AirlineBooking.AirlineBookingNumberOfChild + 1
                    )
                  }
                  size="small"
                  className="btn btn-outline-primary "
                >
                  +
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <p className="ion-no-margin">
                  <IonText>Bayi</IonText>
                  <br />
                  <IonText color="medium">
                    <small>Di bawah 2</small>
                  </IonText>
                </p>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonButton
                  onClick={() =>
                    setAirlineBookingNumberOfInfant(
                      AirlineBooking.AirlineBookingNumberOfPaxTotal > 1 &&
                        AirlineBooking.AirlineBookingNumberOfInfant > 0
                        ? AirlineBooking.AirlineBookingNumberOfInfant - 1
                        : AirlineBooking.AirlineBookingNumberOfInfant
                    )
                  }
                  size="small"
                  color="light"
                  className="btn"
                >
                  -
                </IonButton>
                <IonButton
                  size="small"
                  className="btn btn-outline-primary "
                  disabled={true}
                >
                  {AirlineBooking.AirlineBookingNumberOfInfant}
                </IonButton>
                <IonButton
                  onClick={() =>
                    setAirlineBookingNumberOfInfant(
                      AirlineBooking.AirlineBookingNumberOfInfant + 1
                    )
                  }
                  size="small"
                  className="btn btn-outline-primary "
                >
                  +
                </IonButton>
              </IonCol>{" "}
            </IonRow>
          </IonGrid>
          <IonButton
            className="text-transform-none"
            expand="block"
            onClick={() => setBottomDrawerIsDestroy(true)}
          >
            Pilih
          </IonButton>
        </div>
      </div>
    </>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineBooking: selectors.getAirlineBooking(state),
    ABDD: state.airline.AirlineBookingDepartureDate,
    ABAD: state.airline.AirlineBookingArrivalDate,
  }),
  mapDispatchToProps: {
    setAirlineBookingDepartureDate,
    setAirlineBookingArrivalDate,
    setAirlineBookingTripType,
    setAirlineBookingNumberOfAdult,
    setAirlineBookingNumberOfChild,
    setAirlineBookingNumberOfInfant,
    setAirlineBookingNumberOfPaxTotal,
  },
  component: React.memo(withRouter(AirlineSearchFrom)),
});
