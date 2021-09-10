import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonToolbar,
} from "@ionic/react";
import { locationOutline } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  setAirlineBookingDestination,
  setAirlineBookingDestinationDetail,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import DefaultToolbar from "../shared/DefaultToolbar";

interface OwnProps {
  ShowModal: boolean;
  CloseModal: any;
}
interface StateProps {
  AirlineOriginRoutes?: any;
  AirlineBookingOrigin?: string;
}
interface DispatchProps {
  setAirlineBookingDestination: typeof setAirlineBookingDestination;
  setAirlineBookingDestinationDetail: typeof setAirlineBookingDestinationDetail;
}
interface AirlineSearchArrivalModalProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const AirlineSearchArrivalModal: React.FC<AirlineSearchArrivalModalProps> = ({
  ShowModal,
  CloseModal,
  setAirlineBookingDestination,
  setAirlineBookingDestinationDetail,
  AirlineOriginRoutes,
}) => {
  const [searchText, setSearchText] = useState("");
  const SelectItem = (item: string, itemName: string) => {
    setAirlineBookingDestination(item);
    setAirlineBookingDestinationDetail(itemName);
    CloseModal();
  };
  return (
    <IonModal isOpen={ShowModal}>
      <IonHeader>
        <DefaultToolbar
          title="Pilih Kedatangan"
          color="primary"
          backButtonRoute={CloseModal}
        />
        <IonToolbar color="primary" className="search">
          <IonSearchbar
            value={searchText}
            searchIcon={locationOutline}
            onIonChange={(e) => setSearchText(e.detail.value!)}
            placeholder="Cari kota atau Bandara"
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="ion-no-padding ion-padding-end">
          {AirlineOriginRoutes === null ? (
            <div>mencari</div>
          ) : AirlineOriginRoutes && AirlineOriginRoutes.length > 0 ? (
            AirlineOriginRoutes.filter((item) =>
              item.destinationName
                .toLowerCase()
                .includes(searchText.toLowerCase())
            ).map((item, index) => (
              <IonItem
                lines="inset"
                key={index}
                onClick={() => {
                  SelectItem(item.destination, item.destinationName);
                }}
              >
                <p className="ion-no-margin ion-margin-top">
                  <IonLabel color="medium">{item.destinationName}</IonLabel>
                  <IonLabel color="dark">{item.destination}</IonLabel>
                </p>
              </IonItem>
            ))
          ) : (
            ""
          )}
        </IonList>
      </IonContent>
    </IonModal>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineOriginRoutes: state.airline.AirlineOriginRoutes,
    // AirlineBookingOrigin: state.airline.AirlineBookingOrigin,
  }),
  mapDispatchToProps: {
    setAirlineBookingDestination,
    setAirlineBookingDestinationDetail,
  },
  component: React.memo(withRouter(AirlineSearchArrivalModal)),
});
