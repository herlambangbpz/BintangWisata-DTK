import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonLoading,
  IonPage,
  isPlatform,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import HotelSearchForm from "../../components/Hotel/HotelSearchForm";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { AppId, MainUrl } from "../../AppConfig";
import { stringDateConvertDashSeparate } from "../../helpers/datetime";
import "./Search.scss";
import { setHotelSearchResults } from "../../data/hotel/hotel.actions";

interface OwnProps {}
interface StateProps {
  HotelSearchData: any;
  UserData: any;
}
interface DispatchProps {
  setHotelSearchResults: typeof setHotelSearchResults;
}
interface SearchProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Search: React.FC<SearchProps> = ({
  HotelSearchData,
  UserData,
  setHotelSearchResults,
  history,
}) => {
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
  const HotelSearchSubmit = () => {
    if (!UserData.accessToken) {
      failedAlert("Login Terlebih Dahulu");
      history.push("/login");
      return;
    }
    setShowLoading(true);
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
      "Content-Type": "application/json",
    };
    var MyData = JSON.stringify({
      ID: HotelSearchData.HotelSearch.ID,
      type: HotelSearchData.HotelSearch.Type,
      paxPassport: "ID",
      checkInDate: stringDateConvertDashSeparate(
        HotelSearchData.HotelSearchCheckInDate
      ),
      checkOutDate: stringDateConvertDashSeparate(
        HotelSearchData.HotelSearchCheckOutDate
      ),
      room: HotelSearchData.HotelSearchRoomType.length,
      roomRequest: HotelSearchData.HotelSearchRoomType,
      accToken: UserData.accessToken,
    });
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.setRequestTimeout(180);
      HTTP.post(MainUrl + "Hotel/SearchData", MyData, MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          HotelSearchSubmitSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    } else {
      fetch(MainUrl + "Hotel/SearchData", {
        method: "POST",
        headers: MyHeaders,
        body: MyData,
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            if (r.status === 401) {
              failedAlert("Session telah habis, silahkan login ulang");

              history.push("/login");
            } else {
              failedAlert(r.statusText);
            }
            return r.json();
          }
        })
        .then((res) => {
          HotelSearchSubmitSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };
  const HotelSearchSubmitSuccess = async (res: any) => {
    if (res.StatusCode == 200 && res.Data !== null) {
      setShowLoading(false);
      if (res.Data.HCode && res.Data.ICode) {
        history.replace(
          encodeURI("/hotelDetail/" + res.Data.HCode + "/" + res.Data.ICode)
        );
      } else {
        await setHotelSearchResults(res.Data);
        history.push("/hotelSearchResullt");
      }
    } else {
      failedAlert("Hotel tidak ditemukan");
    }
  };
  return (
    <IonPage>
      <IonHeader translucent>
        <DefaultToolbar
          title={"Hotel"}
          color="primary"
          backButtonRoute="/main/index"
        />
      </IonHeader>
      <IonContent fullscreen={true} class="airlineSearch">
        <IonGrid className="ion-padding">
          <HotelSearchForm HSD={HotelSearchData}></HotelSearchForm>
          <IonButton
            className="ion-margin-top text-transform-none"
            expand="block"
            size="large"
            color={HotelSearchData.HotelSearch ? "primary" : "light"}
            // routerLink="/airlineSearchFirstFlight"
            onClick={() =>
              HotelSearchData.HotelSearch
                ? HotelSearchSubmit()
                : failedAlert("Pilih Kota Tujuan / Nama Hotel terlebih dahulu")
            }
          >
            Cari Hotel
          </IonButton>
        </IonGrid>
        <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={headerAlert}
          message={messageAlert}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    HotelSearchData: selectors.getHotelSearchData(state),
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {
    setHotelSearchResults,
  },
  component: React.memo(withRouter(Search)),
});
