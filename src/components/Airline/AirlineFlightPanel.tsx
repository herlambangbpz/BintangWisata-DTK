import { IonText } from "@ionic/react";
import { Collapse } from "antd";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  setAirlineBookingDestination,
  setAirlineBookingDestinationDetail,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import { stringDateHoursConvert } from "../../helpers/datetime";

const { Panel } = Collapse;
interface OwnProps {
  Open: boolean;
}
interface StateProps {
  AirlineFlightDeparture?: any;
  AirlineFlightArrival?: any;
  AirlineBookingTripType?: string;
  AirlineBookingOrigin?: string;
  AirlineBookingDestination?: string;
  ABDB?: any;
}
interface DispatchProps {
  setAirlineBookingDestination: typeof setAirlineBookingDestination;
  setAirlineBookingDestinationDetail: typeof setAirlineBookingDestinationDetail;
}
interface AirlineFlightPanelProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const AirlineFlightPanel: React.FC<AirlineFlightPanelProps> = ({
  Open,
  AirlineFlightDeparture,
  AirlineFlightArrival,
  AirlineBookingTripType,
  AirlineBookingOrigin,
  AirlineBookingDestination,
  ABDB,
}) => {
  if (ABDB) {
    return (
      <Collapse
        expandIconPosition={"right"}
        defaultActiveKey={Open ? ["1"] : [""]}
        style={{ margin: "16px", borderRadius: "8px" }}
      >
        <Panel
          // header={
          //   AirlineBookingOrigin || "" + AirlineBookingTripType == "OneWay"
          //     ? " → "
          //     : " ⇆ " + AirlineBookingDestination || ""
          // }
          header={
            `${ABDB.PriceData.Origin || ""}` +
            `${ABDB.PriceData.TripType === "OneWay" ? " → " : " ⇆ "}` +
            `${ABDB.PriceData.Destination || ""}`
          }
          key="1"
        >
          <div className="bb-lightgray-1 ion-pb-8">
            <IonText>
              <p className="ion-no-margin">
                Penerbangan Pergi ({ABDB.PriceData.Origin || ""}
                {/* {AirlineFlightDeparture
                ? AirlineFlightDeparture.jiOrigin || ""
                : ""} */}
                &nbsp;- {ABDB.PriceData.Destination || ""})
              </p>
            </IonText>
            <IonText>
              <p className="ion-no-margin">
                <img
                  src={`assets/img/Airlines/${
                    (ABDB.AirlineFlightDeparture &&
                      ABDB.AirlineFlightDeparture.airlineID.toLowerCase()) ||
                    ""
                  }/${
                    (ABDB.AirlineFlightDeparture &&
                      ABDB.AirlineFlightDeparture.airlineID.toLowerCase()) ||
                    ""
                  }.png`}
                  alt=""
                  height="16px"
                />
                &nbsp;{" "}
                {(ABDB.AirlineFlightDeparture &&
                  ABDB.AirlineFlightDeparture.segment[0].flightDetail[0]
                    .airlineCode) ||
                  ""}{" "}
                {(ABDB.AirlineFlightDeparture &&
                  ABDB.AirlineFlightDeparture.segment[0].flightDetail[0]
                    .flightNumber) ||
                  ""}
              </p>
            </IonText>
            <IonText color="medium">
              <p className="ion-no-margin">
                {stringDateHoursConvert(
                  (ABDB.AirlineFlightDeparture &&
                    ABDB.AirlineFlightDeparture.segment[0].flightDetail[0]
                      .fdDepartTime) ||
                    ""
                )}
              </p>
            </IonText>
            <IonText color="medium">
              <p className="ion-no-margin">
                {stringDateHoursConvert(
                  (ABDB.AirlineFlightDeparture &&
                    ABDB.AirlineFlightDeparture.segment[0].flightDetail[0]
                      .fdArrivalTime) ||
                    ""
                )}
              </p>
            </IonText>
          </div>
          <div
            className="ion-pb-8 ion-pt-8"
            hidden={!ABDB.AirlineFlightArrival}
          >
            <IonText>
              <p className="ion-no-margin">
                Penerbangan Pulang (
                {(ABDB.AirlineFlightArrival &&
                  ABDB.AirlineFlightArrival.jiOrigin) ||
                  ""}
                &nbsp;-{" "}
                {(ABDB.AirlineFlightArrival &&
                  ABDB.AirlineFlightArrival.jiDestination) ||
                  ""}
                )
              </p>
            </IonText>
            <IonText>
              <p className="ion-no-margin">
                <img
                  src={`assets/img/Airlines/${
                    (ABDB.AirlineFlightArrival &&
                      ABDB.AirlineFlightArrival.airlineID.toLowerCase()) ||
                    ""
                  }/${
                    (ABDB.AirlineFlightArrival &&
                      ABDB.AirlineFlightArrival.airlineID.toLowerCase()) ||
                    ""
                  }.png`}
                  alt=""
                  height="16px"
                />
                &nbsp;{" "}
                {(ABDB.AirlineFlightArrival &&
                  ABDB.AirlineFlightArrival.segment[0].flightDetail[0]
                    .airlineCode) ||
                  ""}{" "}
                {(ABDB.AirlineFlightArrival &&
                  ABDB.AirlineFlightArrival.segment[0].flightDetail[0]
                    .flightNumber) ||
                  ""}
              </p>
            </IonText>
            <IonText color="medium">
              <p className="ion-no-margin">
                {stringDateHoursConvert(
                  (ABDB.AirlineFlightArrival &&
                    ABDB.AirlineFlightArrival.segment[0].flightDetail[0]
                      .fdDepartTime) ||
                    ""
                )}
              </p>
            </IonText>
            <IonText color="medium">
              <p className="ion-no-margin">
                {stringDateHoursConvert(
                  (ABDB.AirlineFlightArrival &&
                    ABDB.AirlineFlightArrival.segment[0].flightDetail[0]
                      .fdArrivalTime) ||
                    ""
                )}
              </p>
            </IonText>
          </div>
        </Panel>
      </Collapse>
    );
  } else {
    return <div></div>;
  }
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineFlightDeparture: state.airline.AirlineFlightDeparture,
    AirlineFlightArrival: state.airline.AirlineFlightArrival,
    AirlineBookingTripType: state.airline.AirlineBookingTripType,
    AirlineBookingOrigin: state.airline.AirlineBookingOrigin,
    AirlineBookingDestination: state.airline.AirlineBookingDestination,
    ABDB: state.airline.AirlineBookingDataBundle,
  }),
  mapDispatchToProps: {
    setAirlineBookingDestination,
    setAirlineBookingDestinationDetail,
  },
  component: React.memo(withRouter(AirlineFlightPanel)),
});
