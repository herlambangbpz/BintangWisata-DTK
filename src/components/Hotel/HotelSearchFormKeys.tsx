import { IonCol, IonLabel, IonRow } from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import HotelSearchFormKeysModal from "./HotelSearchFormKeysModal";
interface OwnProps {}
interface StateProps {
  HotelSearch?: any;
}
interface DispatchProps {}
interface HotelSearchFormKeysProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const HotelSearchFormKeys: React.FC<HotelSearchFormKeysProps> = ({
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
      <HotelSearchFormKeysModal
        ShowModal={ShowModal}
        CloseModal={() => {
          setShowModal(false);
        }}
      ></HotelSearchFormKeysModal>
    </div>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    HotelSearch: state.hotel.HotelSearch,
  }),
  component: React.memo(withRouter(HotelSearchFormKeys)),
});
