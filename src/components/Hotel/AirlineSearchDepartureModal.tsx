import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonSearchbar,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { locationOutline } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { MainUrl } from "../../AppConfig";
import {
  setAirlineBookingDestination,
  setAirlineBookingDestinationDetail,
  setAirlineBookingOrigin,
  setAirlineBookingOriginDetail,
  setAirlineOriginRoutes,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import DefaultToolbar from "../shared/DefaultToolbar";

interface OwnProps {
  ShowModal: boolean;
  CloseModal: any;
}
interface StateProps {
  AirlineOriginRoutes?: any;
}
interface DispatchProps {
  setAirlineOriginRoutes: typeof setAirlineOriginRoutes;
  setAirlineBookingOrigin: typeof setAirlineBookingOrigin;
  setAirlineBookingOriginDetail: typeof setAirlineBookingOriginDetail;
  setAirlineBookingDestination: typeof setAirlineBookingDestination;
  setAirlineBookingDestinationDetail: typeof setAirlineBookingDestinationDetail;
}
interface AirlineSearchDepartureModalProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const AirlineSearchDepartureModal: React.FC<AirlineSearchDepartureModalProps> =
  ({
    ShowModal,
    CloseModal,
    setAirlineOriginRoutes,
    setAirlineBookingOrigin,
    setAirlineBookingOriginDetail,
    setAirlineBookingDestination,
    setAirlineBookingDestinationDetail,
    AirlineOriginRoutes,
  }) => {
    const [searchText, setSearchText] = useState("");
    const [HotelKeys, setHotelKeys] = useState<any>(null);

    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [headerAlert, setHeaderAlert] = useState<string>();
    const [messageAlert, setMessageAlert] = useState<string>();
    const failedAlert = (errorMessage: string) => {
      setShowLoading(false);
      setHeaderAlert("Gagal");
      setMessageAlert(errorMessage);
      setShowAlert(true);
    };
    const SelectItem = (key: any) => {
      console.log(key);

      CloseModal();
    };
    const searchHotelKey = (text: string) => {
      setSearchText(text);
      if (text.length > 2) {
        HotelKey(text);
      } else {
        setAirlineOriginRoutes(null);
      }
    };
    const HotelKey = (text: string) => {
      var MyData = new FormData();
      MyData.append("keyword", text);
      // MyData.append("airlineID", "ALL");
      setAirlineOriginRoutes(null);
      setAirlineBookingOrigin(undefined);
      setAirlineBookingOriginDetail(undefined);
      setAirlineBookingDestination(undefined);
      setAirlineBookingDestinationDetail(undefined);

      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("multipart");
        HTTP.setRequestTimeout(180);
        HTTP.post(MainUrl + "Hotel/searchKey", MyData, {})
          .then((res) => {
            if (res.status !== 200) {
              alert("Periksa Koneksi anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            HotelKeySuccess(res);
          })
          .catch((err) => {
            // alert(JSON.stringify(err));
            // alert(err.status);
            alert(err.error); // error message as string
            // alert(err.headers);
            // failedAlert(JSON.stringify(err));
          });
      } else {
        fetch(MainUrl + "Hotel/searchKey", {
          method: "POST",
          // headers: { AppId: AppId },
          body: MyData,
        })
          .then((r) => {
            if (r.ok) {
              return r.json();
            } else {
              failedAlert("Periksa Koneksi Anda");
            }
          })
          .then((res) => {
            HotelKeySuccess(res);
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
          });
      }
    };
    const HotelKeySuccess = (res: any) => {
      if (res.StatusCode === 200 && res.Data.length > 0) {
        setHotelKeys(res.Data);
      } else {
        setHotelKeys([]);
      }
    };
    return (
      <IonModal isOpen={ShowModal}>
        <IonHeader>
          <DefaultToolbar
            title="Pilih Kota Tujuan atau Nama Hotel"
            color="primary"
            backButtonRoute={CloseModal}
          />
          <IonToolbar color="primary" className="search">
            <IonSearchbar
              value={searchText}
              searchIcon={locationOutline}
              onIonChange={(e) => searchHotelKey(e.detail.value!)}
              placeholder="Cari Kota atau Hotel"
            ></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {HotelKeys === null ? (
            <div
              className="ion-padding ion-text-center"
              hidden={searchText.length > 2 ? false : true}
            >
              Mencari...
            </div>
          ) : HotelKeys && HotelKeys.length > 0 ? (
            <IonList
              className="ion-no-padding ion-padding-end"
              hidden={searchText.length > 2 ? false : true}
            >
              {HotelKeys.slice(0, 1).map((item, index) => (
                <IonItem
                  lines="inset"
                  onClick={() => {
                    SelectItem(item);
                  }}
                >
                  <p className="ion-no-margin ion-margin-top">
                    <IonLabel color="dark">{item.Name}</IonLabel>
                    <IonLabel color="medium">{item.Location}</IonLabel>
                  </p>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <div
              className="ion-padding ion-text-center"
              hidden={searchText.length > 0 ? false : true}
            >
              Hotel atau kota yang Anda cari tidak ditemukan.
            </div>
          )}

          <div
            className="ion-padding ion-text-center"
            hidden={
              searchText.length > 0 && searchText.length < 3 ? false : true
            }
          >
            Inputkan min 3 karakter
          </div>
          <div
            className="gray-bg ion-padding"
            hidden={searchText.length > 0 ? true : false}
          >
            <IonLabel color="medium">Tujuan Populer</IonLabel>
          </div>
          <IonList
            className="ion-no-padding ion-padding-end"
            hidden={searchText.length > 0 ? true : false}
          >
            <IonItem
              lines="inset"
              onClick={() => {
                setSearchText("CGK");
                // searchHotelKey("CGK");
              }}
            >
              <p className="ion-no-margin ion-margin-top">
                <IonLabel color="dark">CGK</IonLabel>
                <IonLabel color="medium">
                  Indonesia, Jakarta,Soekarno Hatta (CGK)
                </IonLabel>
              </p>
            </IonItem>
            <IonItem
              lines="inset"
              onClick={() => {
                setSearchText("SUB");
                // searchHotelKey("SUB");
              }}
            >
              <p className="ion-no-margin ion-margin-top">
                <IonLabel color="dark">SUB</IonLabel>
                <IonLabel color="medium">Indonesia, Surabaya (SUB)</IonLabel>
              </p>
            </IonItem>
          </IonList>
          <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={headerAlert}
            message={messageAlert}
            buttons={["OK"]}
          />
        </IonContent>
      </IonModal>
    );
  };
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    AirlineOriginRoutes: state.airline.AirlineOriginRoutes,
  }),
  mapDispatchToProps: {
    setAirlineOriginRoutes,
    setAirlineBookingOrigin,
    setAirlineBookingOriginDetail,
    setAirlineBookingDestination,
    setAirlineBookingDestinationDetail,
  },
  component: React.memo(withRouter(AirlineSearchDepartureModal)),
});
