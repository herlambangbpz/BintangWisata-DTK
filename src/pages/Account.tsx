import React, { useState, useEffect } from "react";
import {
  IonHeader,
  IonAlert,
  IonToolbar,
  IonContent,
  IonPage,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonTitle,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonLoading,
  getPlatforms,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import "./Account.scss";
import { connect } from "../data/connect";
import {
  setIsLoggedIn,
  setUsername,
  logoutUser,
  setAccessToken,
  setRequestVerificationToken,
  setMemberId,
  setName,
  setBalance,
  setPhoto,
  setAccountInfo,
  loadUserData,
} from "../data/user/user.actions";
import {
  createOutline,
  chevronForwardOutline,
  chevronBackOutline,
  power,
} from "ionicons/icons";
import imageCompression from "browser-image-compression";
import { MainUrl, AppId, CustomRedirect } from "../AppConfig";
import AccountDetail from "../components/AccountDetail";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { isPlatform } from "@ionic/react";
import { HTTP } from "@ionic-native/http";
import { ErrorOutlineSharp } from "@material-ui/icons";
import { loadProfile, setAllProfile } from "../data/profile/profile.actions";
import { platform } from "os";
// import axios from 'axios';
const { Camera } = Plugins;
defineCustomElements(window);
interface OwnProps {}
interface StateProps {
  name?: string;
  balance?: string;
  photo?: string;
  isLoggedIn: boolean;
  requestVerificationToken?: string;
  accessToken?: string;
}
interface DispatchProps {
  logoutUser: typeof logoutUser;
  setPhoto: typeof setPhoto;
  loadUserData: typeof loadUserData;
  loadProfile: typeof loadProfile;
  setAllProfile: typeof setAllProfile;
  setAccountInfo: typeof setAccountInfo;
}
interface AccountProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const Account: React.FC<AccountProps> = ({
  history,
  name,
  balance,
  photo,
  requestVerificationToken,
  accessToken,
  logoutUser,
  setPhoto,
  setAllProfile,
  loadUserData,
  loadProfile,
  setAccountInfo,
}) => {
  const [imagePath, setImagePath] = useState<string>(
    photo || "assets/img/defaultava.jpg"
  );
  const [hideAccount, setHideAccount] = useState<boolean>(false);
  const [hideAccountDetail, setHideAccountDetail] = useState<boolean>(true);
  const [logoutConfirmation, setLogoutConfirmation] = useState<boolean>(false);

  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingLogout, setShowLoadingLogout] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  useEffect(() => {
    if (history.location.pathname === "/main/account") {
      setAccountInfo();
      loadUserData();
    }
  }, [history.location.pathname]);
  const showAccountDetail = () => {
    if (AppId && accessToken && requestVerificationToken) {
      setShowLoading(true);
      const myHeaders = {
        appid: AppId,
        RequestVerificationToken: requestVerificationToken,
      };
      if (isPlatform("cordova")) {
        HTTP.get(
          MainUrl +
            "member/ProfileEdit?AccToken=" +
            accessToken +
            "&ProfileType=transaction",
          {},
          myHeaders
        )
          .then((res) => {
            if (res.status !== 200) {
              failedAlert("Periksa Koneksi Internet");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            if (res.Data.userName !== "") {
              setAllProfile(res.Data);
              loadProfile();
              setShowLoading(false);
              setHideAccount(true);
              setHideAccountDetail(false);
            } else {
              failedAlert(res.ErrorMessage);
            }
          })
          .catch((error) => {
            failedAlert(error.error);
          });
      } else {
        fetch(MainUrl + "member/ProfileEdit?AccToken=" + accessToken, {
          headers: myHeaders,
        })
          // Check Connection
          .then((res) => {
            if (!res.ok) {
              failedAlert("Periksa Koneksi Internet");
            }
            return res.json();
          })
          .then((res) => {
            if (res.Data.userName !== "") {
              setAllProfile(res.Data);
              loadProfile();
              setShowLoading(false);
              setHideAccount(true);
              setHideAccountDetail(false);
            } else {
              failedAlert(res.ErrorMessage);
            }
          })
          .catch((error) => {
            failedAlert("Periksa Koneksi Internet anda");
          });
      }
    }
  };
  const showAccount = () => {
    setHideAccount(false);
    setHideAccountDetail(true);
  };

  const failedAlert = (errorMessage: string) => {
    setShowLoadingLogout(false);
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const successAlert = (errorMessage: string) => {
    setHeaderAlert("Sukses");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      width: 200,
      height: 200,
      source: CameraSource.Camera,
    });

    const compressedImage = await fetch(image.webPath ? image.webPath : "")
      .then((r) => r.blob())
      .then((r) =>
        imageCompression(r, { maxSizeMB: 0.4, maxWidthOrHeight: 1000 })
      );
    compressedImage
      ? sendPicture(
          compressedImage,
          await imageCompression.getDataUrlFromFile(compressedImage)
        )
      : setImagePath(photo || "assets/img/promo/Promo-1.jpg");
  };
  const sendPicture = async (compressedImage: any, fileUrl: any) => {
    const MyData = new FormData();
    MyData.append("avatar", compressedImage);
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "member/ProfilePictureEdit", MyData, {})
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Periksa Koneksi Internet");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.Data.IsRespon) {
            setImagePath(fileUrl);
            setPhoto(fileUrl);
            successAlert(res.Data.Respon);
          } else {
            failedAlert(res.ErrorMessage);
          }
        })
        .catch((error) => failedAlert(error.error));
    } else {
      fetch(MainUrl + "member/ProfilePictureEdit", {
        method: "POST",
        body: MyData,
      })
        // Check Connection
        .then((res) => {
          if (!res.ok) {
            failedAlert("Periksa Koneksi Internet");
          }
          return res.json();
        })
        .then((res) => {
          if (res.Data.IsRespon) {
            setImagePath(fileUrl);
            setPhoto(fileUrl);
            successAlert(res.Data.Respon);
          } else {
            failedAlert(res.ErrorMessage);
          }
        })
        .catch((error) => {
          failedAlert("Periksa Koeneksi Internet anda");
        });
    }
  };
  // Logout
  const logout = async () => {
    setShowLoadingLogout(true);
    logoutUser();

    // if(AppId && requestVerificationToken && accessToken){
    // const formdata = new FormData();
    // formdata.append("AccToken", accessToken);
    // const myHeaders = {
    //   'appid': AppId,
    //   'RequestVerificationToken': requestVerificationToken,
    // }

    //Cordova Only
    // if(isPlatform('cordova')){
    //   logoutUser();
    // // HTTP.setDataSerializer('multipart');
    // HTTP.post(MainUrl+'member/logoff',formdata,{
    //   'appid': AppId,
    //   'RequestVerificationToken': requestVerificationToken,
    // })
    // .then(res => {
    //   setShowLoading(false);

    //   if(res.status!==200){
    //     failedAlert('Periksa Koneksi Internet Anda');
    //   }
    //   return JSON.parse(res.data);
    // })
    // .then(res => {
    //   alert("OK"+JSON.stringify(res))
    //   if(res.RespStatus==="Success"){
    //     logoutUser();
    //     failedAlert('Berhasil Logout');
    //   }else{
    //     failedAlert('Periksa Koneksi Internet Anda');
    //   }
    //   setLogoutConfirmation(false);
    // })
    // .catch(error => {
    //   // SEK RUWET
    //   // failedAlert('Periksa Koneksi anda');
    //   // alert(error.status);
    //   // alert(error.error); // error message as string
    //   // alert(error.headers);
    //   logoutUser();

    // });
    // }
    //PWA
    // else{
    //   fetch(MainUrl+'member/logoff',
    //   {
    //     method:'POST',
    //     body: formdata,
    //     headers: myHeaders
    //   })
    //   // Check Connection
    //   .then(res => {
    //     setShowLoading(false);
    //     if(!res.ok){
    //       failedAlert('Periksa Koneksi Internet Anda');
    //     }
    //     return res.json();
    //   })
    //   // Check If Exist
    //   .then(res => {
    //     if(res.RespStatus==="Success"){
    //       logoutUser();
    //       failedAlert('Berhasil Logout');
    //     }else{
    //       failedAlert('Periksa Koneksi Internet Anda ya');
    //     }
    //     setLogoutConfirmation(false);
    //   })
    //   .catch(error => failedAlert('Periksa Koneksi Internet'));
    // }
    // }
  };
  return (
    // !isLoggedIn?<Redirect to="/login" />
    // :(
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons
            slot="start"
            hidden={hideAccountDetail}
            onClick={() => showAccount()}
          >
            <IonButton>
              <IonIcon icon={chevronBackOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Akun</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* Account Content */}
      <IonContent className="gray-bg" hidden={hideAccount}>
        <div className="primary-half-background"></div>
        <IonCard
          className="ion-margin-bottom"
          onClick={() => showAccountDetail()}
        >
          <IonGrid>
            <IonRow className="ion-padding ion-pl-8 ion-pr-8">
              <IonCol size="10">
                <IonText color="dark">
                  <h5 className="ion-no-margin ion-mb-8">
                    <b>{name}</b>
                  </h5>
                </IonText>
                <IonText color="dark">
                  <h5 className="ion-no-margin ion-mb-8">
                    Saldo Anda : Rp {balance}
                  </h5>
                </IonText>

                <IonButtons>
                  <IonButton
                    href="/"
                    className="btn btn-outline-primary text-transform-none"
                    size="small"
                  >
                    Upgrade ke Mitra
                  </IonButton>
                </IonButtons>
              </IonCol>
              <IonCol size="2" className="ion-text-right">
                <IonIcon
                  icon={createOutline}
                  size="large"
                  color="primary"
                ></IonIcon>
              </IonCol>
              <IonCol></IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonCard
          className="ion-margin-top ion-margin-bottom"
          onClick={() => history.push("/balance")}
        >
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="10">
                <IonText color="dark">
                  <h6 className="ion-no-margin">Saldo</h6>
                </IonText>
                <IonText color="medium">
                  <small>Belum ada saldo, isi ulang sekarang!</small>
                </IonText>
              </IonCol>
              <IonCol size="2" className="ion-text-right">
                <IonIcon
                  icon={chevronForwardOutline}
                  color="medium"
                  size="large"
                ></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonCard
          className="ion-margin-top ion-margin-bottom"
          onClick={() => history.push("/main/transactionList")}
        >
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="10">
                <IonText color="dark">
                  <h6 className="ion-no-margin">Transaksi</h6>
                </IonText>
                <IonText color="medium">
                  <small>Semua daftar transaksi Anda tersedia di sini</small>
                </IonText>
              </IonCol>
              <IonCol size="2" className="ion-text-right">
                <IonIcon
                  icon={chevronForwardOutline}
                  color="medium"
                  size="large"
                ></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonCard
          className="ion-margin-top ion-margin-bottom"
          onClick={() => history.push("/forgotpassword")}
        >
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="10">
                <IonText color="dark">
                  <h6 className="ion-no-margin">Kata sandi</h6>
                </IonText>
                <IonText color="medium">
                  <small>
                    Lupa kata sandi akun? Klik di sini untuk meresetnya
                  </small>
                </IonText>
              </IonCol>
              <IonCol size="2" className="ion-text-right">
                <IonIcon
                  icon={chevronForwardOutline}
                  color="medium"
                  size="large"
                ></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonGrid
          className="logoutButton"
          onClick={() => setLogoutConfirmation(true)}
        >
          <IonRow className="ion-align-items-center">
            <IonCol size="2" className="ion-text-center">
              <IonIcon icon={power} color="danger" size="large"></IonIcon>
            </IonCol>
            <IonCol size="10">
              <h6>Keluar</h6>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      {/* Detail Account Content */}
      <IonContent hidden={hideAccountDetail} className="gray-bg">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <b>Data Pengguna</b>
              </IonText>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonText
                color="primary"
                onClick={() => history.push("/accountEdit")}
              >
                <b>Ubah</b>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <AccountDetail />
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <b>Logo Invoice</b>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid className="white-bg ion-padding-top ion-padding-bottom">
          <IonRow>
            <IonCol size="12">
              <img src={imagePath} width="200px" className="profileUpload" />
            </IonCol>
            <IonCol size="12" onClick={() => takePicture()}>
              <IonButton className="btn btn-outline-primary text-transform-none">
                Unggah logo invoice{" "}
              </IonButton>
            </IonCol>
            <IonCol size="12">
              <IonText color="medium">* Ukuran file maksimal 100 kb</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonAlert
        isOpen={logoutConfirmation}
        onDidDismiss={() => setLogoutConfirmation(false)}
        header={"Keluar"}
        message={"Anda akan keluar dari akun anda"}
        buttons={[
          {
            text: "Batal",
            role: "batal",
            handler: () => {
              setLogoutConfirmation(false);
            },
          },
          {
            text: "Okay",
            handler: () => {
              logout();
            },
          },
        ]}
      />
      <IonLoading isOpen={showLoading} message={"Mengambil Profil..."} />
      <IonLoading isOpen={showLoadingLogout} message={"Logout..."} />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={headerAlert}
        message={messageAlert}
        buttons={["OK"]}
      />
    </IonPage>
    // )
  );
};

// export default connect<OwnProps, StateProps, DispatchProps>({
//   component: React.memo(withRouter(Account))
// });
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedin,
    name: state.user.name,
    balance: state.user.balance,
    photo: state.user.photo,
    accessToken: state.user.accessToken,
    requestVerificationToken: state.user.requestVerificationToken,
  }),
  mapDispatchToProps: {
    logoutUser,
    setPhoto,
    loadUserData,
    setAllProfile,
    loadProfile,
    setAccountInfo,
  },
  component: React.memo(withRouter(Account)),
});
