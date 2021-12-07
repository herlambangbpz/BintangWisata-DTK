import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonSearchbar,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { locationOutline, location, business } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { MainUrl } from "../../AppConfig";
import { setHotelSearch } from "../../data/hotel/hotel.actions";
import { connect } from "../../data/connect";
import DefaultToolbar from "../shared/DefaultToolbar";

interface OwnProps {
  ShowModal: boolean;
  CloseModal: any;
}
interface StateProps {
  HotelSearch?: any;
}
interface DispatchProps {
  setHotelSearch: typeof setHotelSearch;
}
interface HotelSearchFormKeysModalProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const HotelSearchFormKeysModal: React.FC<HotelSearchFormKeysModalProps> = ({
  ShowModal,
  CloseModal,
  setHotelSearch,
  HotelSearch,
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
    setHotelSearch(key);
    CloseModal();
  };
  const searchHotelKey = (text: string) => {
    setSearchText(text);
    setHotelKeys(null);
    if (text.length > 2) {
      HotelKey(text);
    }
  };
  const HotelKey = (text: string) => {
    var MyData = new FormData();
    MyData.append("keyword", text);
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
          alert(err.error); // error message as string
        });
    } else {
      fetch(MainUrl + "Hotel/searchKey", {
        method: "POST",
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
            {HotelKeys.map((item, index) => (
              <IonItem
                lines="inset"
                onClick={() => {
                  SelectItem(item);
                }}
              >
                <p className="ion-no-margin ion-margin-top">
                  <IonLabel color="dark">
                    <IonIcon
                      icon={item.Type === "Kota" ? location : business}
                      color="dark"
                    ></IonIcon>
                    {" " + item.Name}
                  </IonLabel>
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
          hidden={searchText.length > 0 && searchText.length < 3 ? false : true}
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
              setSearchText("Jakarta");
              // searchHotelKey("CGK");
            }}
          >
            <p className="ion-no-margin ion-margin-top">
              <IonLabel color="dark">Jakarta</IonLabel>
              <IonLabel color="medium">Indonesia</IonLabel>
            </p>
          </IonItem>
          <IonItem
            lines="inset"
            onClick={() => {
              setSearchText("Surabaya");
              // searchHotelKey("SUB");
            }}
          >
            <p className="ion-no-margin ion-margin-top">
              <IonLabel color="dark">Surabaya</IonLabel>
              <IonLabel color="medium">Indonesia</IonLabel>
            </p>
          </IonItem>
          <IonItem
            lines="inset"
            onClick={() => {
              setSearchText("Bali");
              // searchHotelKey("SUB");
            }}
          >
            <p className="ion-no-margin ion-margin-top">
              <IonLabel color="dark">Bali</IonLabel>
              <IonLabel color="medium">Indonesia</IonLabel>
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
    HotelSearch: state.hotel.HotelSearch,
  }),
  mapDispatchToProps: {
    setHotelSearch,
  },
  component: React.memo(withRouter(HotelSearchFormKeysModal)),
});
