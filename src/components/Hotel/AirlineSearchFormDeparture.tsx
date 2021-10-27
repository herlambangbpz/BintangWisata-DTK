import { IonCol, IonLabel, IonRow } from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import AirlineSearchDepartureModal from "./AirlineSearchDepartureModal";
interface OwnProps {}
interface StateProps {
  AirlineOriginRoutes?: any;
  AirlineBookingOriginDetail?: string;
}
interface DispatchProps {}
interface AirlineSearchFormDepartureProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineSearchFormDeparture: React.FC<AirlineSearchFormDepartureProps> = ({
  AirlineBookingOriginDetail,
}) => {
  const [ShowModal, setShowModal] = useState(false);
  return (
    <div>
      <IonRow className="bb-lightgray-1" onClick={() => setShowModal(true)}>
        <IonCol size="12">
          <IonLabel color="medium">
            <small>Cari Hotel</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/MapPin.svg" alt="" />
        </IonCol>
        <IonCol>
          <IonLabel>
            {AirlineBookingOriginDetail || "Kota Tujuan atau Nama Hotel"}
          </IonLabel>
        </IonCol>
      </IonRow>
      <AirlineSearchDepartureModal
        ShowModal={ShowModal}
        CloseModal={() => {
          setShowModal(false);
        }}
      ></AirlineSearchDepartureModal>
    </div>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineBookingOriginDetail: state.airline.AirlineBookingOriginDetail,
  }),
  // mapDispatchToProps: {
  //   setAirlineAirport,
  // },
  component: React.memo(withRouter(AirlineSearchFormDeparture)),
});
