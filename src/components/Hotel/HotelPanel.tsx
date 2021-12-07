import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import { Collapse } from "antd";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  setAirlineBookingDestination,
  setAirlineBookingDestinationDetail,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import { rupiah } from "../../helpers/currency";
import {
  stringDateConvert,
  stringDateHoursConvert,
} from "../../helpers/datetime";

const { Panel } = Collapse;
interface OwnProps {
  Open: boolean;
  HotelPanelData: any;
}
interface StateProps {}
interface DispatchProps {}
interface HotelPanelProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const HotelPanel: React.FC<HotelPanelProps> = ({ Open, HotelPanelData }) => {
  if (HotelPanelData) {
    return (
      <Collapse
        expandIconPosition={"right"}
        defaultActiveKey={Open ? ["1"] : [""]}
        style={{ margin: "16px", borderRadius: "8px" }}
      >
        <Panel header={HotelPanelData.HotelName} key="1">
          <IonText>
            <b>
              <small>{"Alamat : " + HotelPanelData.HotelAddress}</small>
            </b>
          </IonText>
          <div className="bb-lightgray-1 bt-lightgray-1 ion-pb-8 ion-mt-8">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <b>Check In</b>
                </IonCol>
                <IonCol className="ion-text-right">
                  {stringDateConvert(HotelPanelData.CheckInDate)}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <b>Check Out</b>
                </IonCol>
                <IonCol className="ion-text-right">
                  {stringDateConvert(HotelPanelData.CheckInDate)}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <b>Jumlah</b>
                </IonCol>
                <IonCol
                  className="ion-text-right"
                  hidden={
                    HotelPanelData.RoomRequest &&
                    HotelPanelData.RoomRequest.length > 0
                      ? false
                      : true
                  }
                >
                  {HotelPanelData.RoomRequest.length} Kamar
                  <br />(
                  {HotelPanelData.RoomRequest.map((item, index) =>
                    index === 0 ? item.roomType : ", " + item.roomType
                  )}
                  )
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
          <div className="ion-pt-8">
            <IonGrid>
              {/* <IonRow>
                <IonCol>
                  <b>Komisi</b>
                </IonCol>
                <IonCol className="ion-text-right">
                  {rupiah(HotelPanelData.TotalPrice)}
                </IonCol>
              </IonRow> */}
              <IonRow>
                <IonCol>
                  <b>Harga Total</b>
                </IonCol>
                <IonCol className="ion-text-right">
                  {rupiah(HotelPanelData.TotalPrice)}
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </Panel>
      </Collapse>
    );
  } else {
    return <div></div>;
  }
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({}),
  mapDispatchToProps: {},
  component: React.memo(withRouter(HotelPanel)),
});
