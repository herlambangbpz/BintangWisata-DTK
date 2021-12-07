import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
  IonTextarea,
  IonToggle,
  isPlatform,
  useIonViewWillEnter,
} from "@ionic/react";
import { Modal } from "antd";
import { informationCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { AppId, MainUrl } from "../../AppConfig";
import {
  loadAirlineBookingDataBundleData,
  loadAirlineOrderPassengersData,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import HotelOrderBuyerDataItem from "./HotelOrderBuyerDataItem";

interface OwnProps {
  GuestRooms?: any;
  setHotelOrderGuest: any;
}
interface StateProps {}
interface DispatchProps {}
interface HotelOrderBuyerDataProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const HotelOrderBuyerData: React.FC<HotelOrderBuyerDataProps> = ({
  history,
  GuestRooms,
  setHotelOrderGuest,
}) => {
  const [ModalInfo, setModalInfo] = useState<any>(null);
  const [ModalInfoTitle, setModalInfoTitle] = useState<any>(null);
  const [ModalInfoContent, setModalInfoContent] = useState<any>(null);
  const SmokingRoomChange = (indexRoom, checkstatus) => {
    let HOG: any = localStorage.getItem("HotelOrderGuest") || null;
    HOG = JSON.parse(HOG || "");
    HOG.Prebook.rooms[indexRoom].isSmokingRoom = checkstatus;
    localStorage.setItem("HotelOrderGuest", JSON.stringify(HOG));
    setHotelOrderGuest(HOG);
  };
  const SpecialRequestChange = (indexRoom, text) => {
    let HOG: any = localStorage.getItem("HotelOrderGuest") || null;
    HOG = JSON.parse(HOG || "");
    HOG.Prebook.rooms[indexRoom].requestDescription = text;
    localStorage.setItem("HotelOrderGuest", JSON.stringify(HOG));
    setHotelOrderGuest(HOG);
  };
  return (
    <div>
      {GuestRooms !== null ? (
        GuestRooms.map((room, indexRoom) => (
          <div>
            <IonText class="ion-padding" color="dark">
              <small>Data Tamu Kamar {indexRoom + 1}</small>
            </IonText>
            {room.paxes && room.paxes.length > 0
              ? room.paxes.map((pax, indexPax) => (
                  <HotelOrderBuyerDataItem
                    indexRoom={indexRoom}
                    indexPax={indexPax}
                    pax={pax}
                    key={indexPax}
                    setHotelOrderGuest={(data) => {
                      setHotelOrderGuest(data);
                    }}
                  ></HotelOrderBuyerDataItem>
                ))
              : ""}
            <IonCard>
              <IonItem>
                <IonLabel>
                  Smoking Room
                  {/* {JSON.stringify(checked)} */}
                </IonLabel>
                <IonToggle
                  checked={room.isSmokingRoom || false}
                  onIonChange={(e) =>
                    SmokingRoomChange(indexRoom, e.detail.checked)
                  }
                />
              </IonItem>
            </IonCard>
            <div
              className="ion-margin"
              hidden={room.specialRequestArray === null}
            >
              <IonLabel color="dark">Special Request</IonLabel>
              {room.specialRequestArray
                ? room.specialRequestArray.map((request, indexRequest) => (
                    <IonCard>
                      <IonItem>
                        <IonLabel>
                          {request.Description}
                          {/* {JSON.stringify(checked)} */}
                        </IonLabel>
                        <IonToggle
                          checked={request.isChecked}
                          // onIonChange={(e) =>
                          //   SmokingRoomCheck(indexRoom, e.detail.checked)
                          // }
                        />
                      </IonItem>
                    </IonCard>
                  ))
                : ""}
            </div>
            <div className="ion-margin">
              <IonLabel
                color="dark"
                onClick={() => {
                  setModalInfoTitle(
                    "Special Request Selain Reservasi Kamar Seperti :"
                  );
                  setModalInfoContent(
                    `
                    <ul>
                    <li>Type Bed (Single, Double)</li>
                    <li>Early Check In</li>
                    <li>Kursi Roda</li>
                    <li>Kamar di Lantai Yang Sama / Bersebelahan</li>
                    <li>Smoking dan Non Smoking Room</li>
                    <li>Dan Request Lainnya</li>
                    </ul>
                    <br/><span>Tergantung Dari Ketersediaan Hotel Pada Saat Check In Dan Mungkin Dikenakan Biaya Tambahan Oleh Hotel</span>
                    `
                  );
                  setModalInfo(true);
                }}
              >
                Permintaan Khusus{" "}
                <IonIcon icon={informationCircle} color="primary"></IonIcon>
              </IonLabel>
              <div className="white-bg  ion-padding">
                <IonTextarea
                  onIonChange={(e) =>
                    SpecialRequestChange(indexRoom, e.detail.value)
                  }
                  className="outline-medium"
                  style={{ border: "1px solid lightgray", borderRadius: "4px" }}
                  placeholder="Tulis permintaan khusus di sini"
                  value={room.requestDescription || ""}
                ></IonTextarea>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <p></p>
          <IonText color="danger" className="ion-margin-start">
            ⚠️ Lengkapi Data Pemesanan Terlebih Dahulu
          </IonText>
        </>
      )}
      <Modal
        title={ModalInfoTitle}
        visible={ModalInfo}
        footer={null}
        onCancel={() => setModalInfo(false)}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: ModalInfoContent || "",
          }}
        ></div>
      </Modal>
    </div>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({}),
  mapDispatchToProps: {},
  component: React.memo(withRouter(HotelOrderBuyerData)),
});
