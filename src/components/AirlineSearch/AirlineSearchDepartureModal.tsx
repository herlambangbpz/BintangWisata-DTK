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
import {
  setAirlineBookingDestination,
  setAirlineBookingDestinationDetail,
  setAirlineBookingOrigin,
  setAirlineBookingOriginDetail,
  setAirlineOriginRoutes,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import DefaultToolbar from "../shared/DefaultToolbar";
import { MainUrl } from "../../AppConfig";
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
    const SelectItem = (origin: string, originName: string) => {
      setAirlineBookingOrigin(origin);
      setAirlineBookingOriginDetail(originName);
      CloseModal();
    };
    const searchOriginRoutes = (text: string) => {
      setSearchText(text);
      if (text.length > 2) {
        OriginRoutesAPI(text);
      } else {
        setAirlineOriginRoutes(null);
      }
    };
    const OriginRoutesAPI = (text: string) => {
      var MyData = new FormData();
      MyData.append("filterCity", text);
      // MyData.append("airlineID", "ALL");
      setAirlineOriginRoutes(null);
      setAirlineBookingOrigin(undefined);
      setAirlineBookingOriginDetail(undefined);
      setAirlineBookingDestination(undefined);
      setAirlineBookingDestinationDetail(undefined);
      const OriginRouteApiUrl = MainUrl.toLocaleLowerCase().includes(
        "localhost"
      )
        ? "https://m.dutatravel.net/api/" + "Airline/getOriginRoute"
        : MainUrl + "Airline/getOriginRoute";
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("multipart");
        HTTP.setRequestTimeout(180);
        HTTP.post(OriginRouteApiUrl, MyData, {})
          .then((res) => {
            if (res.status !== 200) {
              alert("Periksa Koneksi anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            OriginRoutesAPISuccess(res);
          })
          .catch((err) => {
            // alert(JSON.stringify(err));
            // alert(err.status);
            alert(err.error); // error message as string
            // alert(err.headers);
            // failedAlert(JSON.stringify(err));
          });
      } else {
        fetch(OriginRouteApiUrl, {
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
            OriginRoutesAPISuccess(res);
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
          });
      }
    };
    const OriginRoutesAPISuccess = (res: any) => {
      if (res.StatusCode === 200 && res.Data.length > 0) {
        setAirlineOriginRoutes(res.Data);
      } else {
        setAirlineOriginRoutes([]);
      }
    };
    return (
      <IonModal isOpen={ShowModal}>
        <IonHeader>
          <DefaultToolbar
            title="Pilih Keberangkatan"
            color="primary"
            backButtonRoute={CloseModal}
          />
          <IonToolbar color="primary" className="search">
            <IonSearchbar
              value={searchText}
              searchIcon={locationOutline}
              onIonChange={(e) => searchOriginRoutes(e.detail.value!)}
              placeholder="Cari kota atau Bandara"
            ></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {AirlineOriginRoutes === null ? (
            <div
              className="ion-padding ion-text-center"
              hidden={searchText.length > 2 ? false : true}
            >
              Mencari...
            </div>
          ) : AirlineOriginRoutes && AirlineOriginRoutes.length > 0 ? (
            <IonList
              className="ion-no-padding ion-padding-end"
              hidden={searchText.length > 2 ? false : true}
            >
              {AirlineOriginRoutes.slice(0, 1).map((item, index) => (
                <IonItem
                  lines="inset"
                  onClick={() => {
                    SelectItem(item.origin, item.originName);
                  }}
                >
                  <p className="ion-no-margin ion-margin-top">
                    <IonLabel color="dark">{item.originName}</IonLabel>
                    <IonLabel color="medium">{item.origin}</IonLabel>
                  </p>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <div
              className="ion-padding ion-text-center"
              hidden={searchText.length > 0 ? false : true}
            >
              Tidak Ditemukan
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
                // searchOriginRoutes("CGK");
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
                // searchOriginRoutes("SUB");
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
