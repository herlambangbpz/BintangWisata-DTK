import { IonCol, IonLabel, IonRow } from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import HotelSearchKeysModal from "./HotelSearchKeysModal";
interface OwnProps {}
interface StateProps {
  AirlineOriginRoutes?: any;
  AirlineBookingOriginDetail?: string;
  HotelSearch?: any;
}
interface DispatchProps {}
interface AirlineSearchFormDepartureProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineSearchFormDeparture: React.FC<AirlineSearchFormDepartureProps> = ({
  AirlineBookingOriginDetail,
  HotelSearch,
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
          <img
            src={
              HotelSearch && HotelSearch.Type !== "Kota"
                ? "assets/icon/HotelRoomPrimary.svg"
                : "assets/icon/MapPin.svg"
            }
            alt=""
          />
        </IonCol>
        <IonCol>
          <IonLabel>
            {(HotelSearch && HotelSearch.Name) || "Kota Tujuan atau Nama Hotel"}
          </IonLabel>
        </IonCol>
      </IonRow>
      <HotelSearchKeysModal
        ShowModal={ShowModal}
        CloseModal={() => {
          setShowModal(false);
        }}
      ></HotelSearchKeysModal>
    </div>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineBookingOriginDetail: state.airline.AirlineBookingOriginDetail,
    HotelSearch: state.hotel.HotelSearch,
  }),
  // mapDispatchToProps: {
  //   setAirlineAirport,
  // },
  component: React.memo(withRouter(AirlineSearchFormDeparture)),
});
