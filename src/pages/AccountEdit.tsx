import React, { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonTitle,
  IonBackButton,
  IonInput,
  IonLoading,
  IonAlert,
  isPlatform,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonIcon,
  IonText,
  IonSearchbar,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import "./AccountEdit.scss";
import { connect } from "../data/connect";
import { checkmarkCircleOutline, chevronBackOutline } from "ionicons/icons";
import { loadProfile, setAllProfile } from "../data/profile/profile.actions";
import { AppId, MainUrl } from "../AppConfig";
import { loadUserData, setName } from "../data/user/user.actions";
import { HTTP } from "@ionic-native/http";
import DefaultToolbar from "../components/shared/DefaultToolbar";

interface StateProps {
  username?: string;
  email?: string;
  fullname?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  requestVerificationToken?: string;
  accessToken?: string;
}
interface DispatchProps {
  loadProfile: typeof loadProfile;
  setAllProfile: typeof setAllProfile;
  setName: typeof setName;
  loadUserData: typeof loadUserData;
}
interface AccountEditProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps {}
const AccountEdit: React.FC<AccountEditProps> = ({
  history,
  username,
  email,
  fullname,
  phone,
  address,
  city,
  postcode,
  requestVerificationToken,
  accessToken,
  loadProfile,
  setAllProfile,
  setName,
  loadUserData,
}) => {
  const [Username, setUsername] = useState(username || "");
  const [Email, setEmail] = useState(email || "");
  const [Fullname, setFullname] = useState(fullname || "");
  const [Phone, setPhone] = useState(phone || "");
  const [Address, setAddress] = useState(address || "");
  const [City, setCity] = useState(city || "");
  const [PostCode, setPostCode] = useState(postcode || "");

  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  const [searchText, setSearchText] = useState("");

  const [ShowModal, setShowModal] = useState(false);
  const [CityList, setCityList] = useState<any>(null);
  const [CityListFiltered, setCityListFiltered] = useState<any>(null);
  const [CitySelected, setCitySelected] = useState(City);
  React.useEffect(() => {
    if (localStorage.CityList) {
      setCityList(JSON.parse(localStorage.CityList));
    } else {
      if (isPlatform("cordova")) {
        HTTP.get(MainUrl + "member/getCityWPK", {}, { AppId: AppId })
          .then((res) => {
            if (res.status !== 200) {
              alert("Periksa Koneksi anda");
              history.push("/account");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            if (res.length > 0) {
              setCityList(res);
              localStorage.setItem("CityList", JSON.stringify(res));
            }
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
            history.push("/account");
          });
      } else {
        fetch(MainUrl + "member/getCityWPK", {
          method: "GET",
          headers: { AppId: AppId },
        })
          .then((r) => {
            if (r.ok) {
              return r.json();
            } else {
              failedAlert("Periksa Koneksi Anda");
              history.push("/account");
            }
          })
          .then((res) => {
            if (res.length > 0) {
              setCityList(res);
              localStorage.setItem("CityList", JSON.stringify(res));
            }
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
            history.push("/account");
          });
      }
    }
  }, []);
  const SaveProfile = () => {
    if (AppId && accessToken && requestVerificationToken) {
      setShowLoading(true);
      const MyData = new FormData();
      MyData.append("memberFullName", Fullname);
      MyData.append("phone", Phone);
      MyData.append("memberAddressPostalCode", PostCode);
      MyData.append("memberAddress", Address);
      MyData.append("memberAddressCity", CitySelected);
      const MyHeaders = {
        appid: AppId,
        RequestVerificationToken: requestVerificationToken,
      };
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("multipart");
        HTTP.post(
          MainUrl + "member/ProfileEdit?AccToken=" + accessToken,
          MyData,
          MyHeaders
        )
          .then((res) => {
            if (res.status !== 200) {
              failedAlert("Cek Koneksi Internet Anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            if (res.Data !== null) {
              setAllProfile({
                userName: username,
                email: email,
                memberFullName: Fullname,
                phone: Phone,
                memberAddress: Address,
                memberAddressCity: CitySelected,
                memberAddressPostalCode: PostCode,
              });
              setName(Fullname);
              loadUserData();
              loadProfile();
              setShowLoading(false);
              history.goBack();
            } else {
              failedAlert(res.ErrorMessage);
            }
          })
          .catch((error) => {
            failedAlert(error.error);
          });
      } else {
        fetch(MainUrl + "member/ProfileEdit?AccToken=" + accessToken, {
          method: "POST",
          body: MyData,
          headers: MyHeaders,
        })
          // Check Connection
          .then((res) => {
            if (!res.ok) {
              failedAlert("Periksa Koneksi Internet");
            }
            return res.json();
          })
          .then((res) => {
            if (res.Data !== null) {
              setAllProfile({
                userName: username,
                email: email,
                memberFullName: Fullname,
                phone: Phone,
                memberAddress: Address,
                memberAddressCity: CitySelected,
                memberAddressPostalCode: PostCode,
              });
              setName(Fullname);
              loadUserData();
              loadProfile();
              setShowLoading(false);
              history.goBack();
            } else {
              failedAlert(res.ErrorMessage);
            }
          })
          .catch((error) => {
            failedAlert(error);
          });
      }
    }
  };
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const searchCity = (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
      const filteredCity = CityList.filter((city) => {
        return city.CityTourName.toLowerCase().includes(
          text.toLocaleLowerCase()
        );
      });
      setCityListFiltered(filteredCity);
    } else {
      setCityListFiltered(null);
    }
  };
  const selectCity = (city: string) => {
    setCitySelected(city);
    setShowModal(false);
    setSearchText("");
    searchCity("");
  };
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton
              icon={chevronBackOutline}
              defaultHref="/main/account"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Ubah Akun</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="editAccount">
        <IonList lines="full" className="ion-margin-bottom ion-padding">
          <IonItem>
            <IonLabel position="floating" color="medium">
              Username
            </IonLabel>
            <IonInput value={Username} disabled>
              {" "}
            </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Email
            </IonLabel>
            <IonInput value={Email} disabled>
              {" "}
            </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Nama Lengkap
            </IonLabel>
            <IonInput
              value={Fullname}
              onIonChange={(e) => setFullname(e.detail.value!)}
            >
              {" "}
            </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              No. Telepon
            </IonLabel>
            <IonInput
              value={Phone}
              onIonChange={(e) => setPhone(e.detail.value!)}
            >
              {" "}
            </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Alamat
            </IonLabel>
            <IonInput
              value={Address}
              onIonChange={(e) => setAddress(e.detail.value!)}
            >
              {" "}
            </IonInput>
          </IonItem>
          <IonItem onClick={() => setShowModal(true)}>
            {/* <IonLabel position="floating" color="medium" onClick={() => setShowModal(true)}>Kota</IonLabel> */}
            <IonLabel onClick={() => setShowModal(true)}>
              {CitySelected !== "" ? `Kota : ${CitySelected}` : `Pilih Kota`}
            </IonLabel>
            {/* <IonInput value={CitySelected} onIonChange={e => setPostCode(CitySelected)} onClick={() => setShowModal(true)}> </IonInput> */}
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Kode Pos
            </IonLabel>
            <IonInput
              value={PostCode}
              onIonChange={(e) => setPostCode(e.detail.value!)}
            >
              {" "}
            </IonInput>
          </IonItem>
        </IonList>
        <IonButton
          className="text-transform-none ion-margin"
          expand="block"
          onClick={() => SaveProfile()}
        >
          Simpan
        </IonButton>
        <IonModal isOpen={ShowModal}>
          <IonHeader>
            <DefaultToolbar
              title="Pilih Kota"
              color="primary"
              backButtonRoute={() => setShowModal(false)}
            />
            <IonSearchbar
              className="ion-ion-padding"
              value={searchText}
              onIonChange={(e) => searchCity(e.detail.value!)}
              placeholder="Cari kota min 3 karakter"
            ></IonSearchbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {CityListFiltered !== null ? (
                CityListFiltered.map((item: any, index: number) => (
                  <IonItem
                    key={index}
                    onClick={() => selectCity(item.CityTourName)}
                  >
                    <IonLabel>
                      <small>{item.CityTourName}</small>
                    </IonLabel>
                    <IonIcon
                      icon={checkmarkCircleOutline}
                      color={item.CityTourName === City ? "primary" : "medium"}
                      slot="end"
                    />
                  </IonItem>
                ))
              ) : (
                <IonItem
                  onClick={() => setShowModal(false)}
                  hidden={CitySelected === "" ? true : false}
                >
                  <IonLabel>
                    <small>{CitySelected}</small>
                  </IonLabel>
                  <IonIcon
                    icon={checkmarkCircleOutline}
                    color="primary"
                    slot="end"
                  />
                </IonItem>
              )}
            </IonList>
            <IonList>
              {CityList !== null &&
              CitySelected === "" &&
              CityListFiltered === null
                ? CityList.map((item: any, index: number) => (
                    <IonItem
                      key={index}
                      onClick={() => selectCity(item.CityTourName)}
                    >
                      <IonLabel>
                        <small>{item.CityTourName}</small>
                      </IonLabel>
                      <IonIcon
                        icon={checkmarkCircleOutline}
                        color={
                          item.CityTourName === City ? "primary" : "medium"
                        }
                        slot="end"
                      />
                    </IonItem>
                  ))
                : ""}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
      <IonLoading isOpen={showLoading} message={"Proses Menyimpan..."} />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={headerAlert}
        message={messageAlert}
        buttons={["OK"]}
      />
    </IonPage>
  );
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    email: state.profile.email,
    fullname: state.profile.fullname,
    phone: state.profile.phone,
    address: state.profile.address,
    city: state.profile.city,
    postcode: state.profile.postcode,
    accessToken: state.user.accessToken,
    requestVerificationToken: state.user.requestVerificationToken,
  }),
  mapDispatchToProps: {
    loadProfile,
    setName,
    setAllProfile,
    loadUserData,
  },
  component: React.memo(withRouter(AccountEdit)),
});
