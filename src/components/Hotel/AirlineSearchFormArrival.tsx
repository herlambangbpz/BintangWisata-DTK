import { IonCol, IonLabel, IonRow } from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import AirlineSearchArrivalModal from "./AirlineSearchArrivalModal";
interface AirlineSearchFormArrivalProps {}
interface OwnProps {}
interface StateProps {
  AirlineOriginRoutes?: any;
  AirlineBookingDestinationDetail?: string;
}
interface DispatchProps {}
interface AirlineSearchFormArrivalProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineSearchFormArrival: React.FC<AirlineSearchFormArrivalProps> = ({
  AirlineOriginRoutes,
  AirlineBookingDestinationDetail,
}) => {
  const [ShowModal, setShowModal] = useState(false);
  return (
    <>
      <IonRow
        className="bb-lightgray-1"
        onClick={() =>
          AirlineOriginRoutes && AirlineOriginRoutes.length > 0
            ? setShowModal(true)
            : alert("Pilih Keberangkatan terlebih dahulu")
        }
      >
        <IonCol size="12">
          <IonLabel color="medium">
            <small>Ke</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/AirlineArrival.svg" alt="" />
        </IonCol>
        <IonCol>
          <IonLabel>{AirlineBookingDestinationDetail || ""}</IonLabel>
        </IonCol>
      </IonRow>
      <AirlineSearchArrivalModal
        ShowModal={ShowModal}
        CloseModal={() => {
          setShowModal(false);
        }}
      ></AirlineSearchArrivalModal>
    </>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineOriginRoutes: state.airline.AirlineOriginRoutes,
    AirlineBookingDestinationDetail:
      state.airline.AirlineBookingDestinationDetail,
  }),
  // mapDispatchToProps: {
  //   setAirlineAirport,
  // },
  component: React.memo(withRouter(AirlineSearchFormArrival)),
});
