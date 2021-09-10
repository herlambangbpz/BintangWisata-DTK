import React, { useState, useEffect, useRef } from "react";
import {
  IonGrid,
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonLoading,
  IonAlert,
  isPlatform,
} from "@ionic/react";
import "./Login.scss";
// import $ from "jquery";
// import "https://staging.doku.com/doku-js/assets/css/doku.css";
// import "https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css";
import {
  setIsLoggedIn,
  setUsername,
  setAccessToken,
  setRequestVerificationToken,
  setMemberId,
  setName,
  setBalance,
  setEmail,
  setPhoto,
} from "../../data/user/user.actions";
import { connect } from "../../data/connect";
import { MainUrl, AppId, CustomRedirect } from "../../AppConfig";
import { RouteComponentProps } from "react-router";
import { HTTP } from "@ionic-native/http";
import { Helmet } from "react-helmet";

// declare var getForm;
interface OwnProps extends RouteComponentProps {}
interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
  setEmail: typeof setEmail;
  setAccessToken: typeof setAccessToken;
  setRequestVerificationToken: typeof setRequestVerificationToken;
  setMemberId: typeof setMemberId;
  setName: typeof setName;
  setBalance: typeof setBalance;
  setPhoto: typeof setPhoto;
}

interface LoginProps extends OwnProps, DispatchProps {}
const Login: React.FC<LoginProps> = ({
  setIsLoggedIn,
  setAccessToken,
  setEmail,
  setRequestVerificationToken,
  setMemberId,
  setName,
  setBalance,
  setPhoto,
  history,
  setUsername: setUsernameAction,
}) => {
  const [identity, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showLoading, setShowLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!identity) {
      setUsernameError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
    // Proses Login
    if (identity && password) {
      setShowLoading(true);
      const formdata = new FormData();
      formdata.append("username", identity);
      formdata.append("password", password);
      //Cordova Only
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("multipart");
        HTTP.post(MainUrl + "member/login", formdata, { appid: AppId })
          .then((res) => {
            if (res.status !== 200) {
              failedAlert("Periksa Koneksi Internet");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            // Login Failed
            if (res.RespStatus !== "OK") {
              failedAlert("Periksa username dan password anda");
            }
            // Login Success
            else {
              // Check Member Data
              const RequestVerificationToken = res.RequestVerificationToken;
              const AccessToken = res.AccessToken;
              const accountInfoFormData = new FormData();
              accountInfoFormData.append("AccToken", AccessToken);
              HTTP.setDataSerializer("multipart");
              HTTP.post(MainUrl + "member/accountinfo", accountInfoFormData, {
                appid: AppId,
                RequestVerificationToken: RequestVerificationToken,
              })
                // Check Connection
                .then((res) => {
                  if (res.status !== 200) {
                    failedAlert("Periksa Koneksi Internet");
                  }
                  return JSON.parse(res.data);
                })
                // Check If Exist
                .then((res) => {
                  // Member Not Exist
                  if (res.RespStatus !== "OK") {
                    failedAlert("Akun Anda tidak ditemukan");
                  }
                  // Login Successfull
                  else {
                    successAlert(identity + " Berhasil Login");
                    successLogin(AccessToken, RequestVerificationToken, res);
                  }
                })
                .catch((error) => failedAlert(error.error));
            }
          })
          .catch((error) => failedAlert(error.error));
      }
      //PWA
      else {
        fetch(MainUrl + "member/login", {
          method: "POST",
          body: formdata,
          credentials: "include",
          headers: { appid: AppId },
        })
          // Check Connection
          .then((res) => {
            if (!res.ok) {
              failedAlert("Periksa Koneksi Internet");
            }
            return res.json();
          })
          // Authetication
          .then((res) => {
            // Login Failed
            if (res.RespStatus !== "OK") {
              failedAlert("Periksa username dan password anda");
            }
            // Login Success
            else {
              const myHeaders = new Headers();
              myHeaders.append(
                "RequestVerificationToken",
                res.RequestVerificationToken
              );
              myHeaders.append("AppId", AppId);
              // Check Member Data
              const RequestVerificationToken = res.RequestVerificationToken;
              const AccessToken = res.AccessToken;
              const accountInfoFormData = new FormData();
              accountInfoFormData.append("AccToken", AccessToken);
              fetch(MainUrl + "member/accountinfo", {
                method: "POST",
                body: accountInfoFormData,
                // headers: {'appid':AppId,'RequestVerificationToken': RequestVerificationToken}
                headers: myHeaders,
              })
                // Check Connection
                .then((res) => {
                  if (!res.ok) {
                    failedAlert("Periksa Koneksi Internet");
                  }
                  return res.json();
                })
                // Check If Exist
                .then((res) => {
                  // Member Not Exist
                  if (res.RespStatus !== "OK") {
                    failedAlert("Akun Anda tidak ditemukan");
                  }
                  // Login Successfull
                  else {
                    successAlert(identity + " Berhasil Login");
                    successLogin(AccessToken, RequestVerificationToken, res);
                  }
                });
            }
          })
          // Failed Connection
          .catch((error) => failedAlert("Periksa Koneksi Internet"));
      }
    }
  };
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const successAlert = (successMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Sukses");
    setMessageAlert(successMessage);
    setShowAlert(true);
  };
  // Login Success
  const successLogin = async (
    AccessToken: string,
    RequestVerificationToken: string,
    r: any
  ) => {
    await setIsLoggedIn(true);
    await setUsernameAction(identity);
    await setEmail(r.Email);
    await setAccessToken(AccessToken);
    await setRequestVerificationToken(RequestVerificationToken);
    await setMemberId(r.MemberID);
    await setName(r.Name);
    await setBalance(r.Saldo);
    await setPhoto(r.photo);
    window.location.replace("/");
    // window.location.href="/";
    // history.push('/main/index', {direction: 'none'});
  };
  return (
    <IonPage id="login-page">
      <IonContent className="ion-padding">
        <div doku-div="form-payment"></div>
        <IonGrid className="ion-text-center">
          <IonText>
            <b>LOGIN</b>
          </IonText>
        </IonGrid>
        <form>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary" id="tak">
                E-Mail / Username
              </IonLabel>
              <IonInput
                name="identity"
                type="text"
                value={identity}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => setUsername(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>

            {formSubmitted && usernameError && (
              <IonText color="danger">
                <p className="ion-padding-start">Username is required</p>
              </IonText>
            )}

            <IonItem>
              <IonLabel position="stacked" color="primary">
                Password
              </IonLabel>
              <IonInput
                name="password"
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
              ></IonInput>
            </IonItem>

            {formSubmitted && passwordError && (
              <IonText color="danger">
                <p className="ion-padding-start">Password is required</p>
              </IonText>
            )}
          </IonList>

          <IonRow>
            <IonCol size="12">
              <IonButton size="large" expand="block" onClick={login}>
                LOGIN
              </IonButton>
            </IonCol>
            <IonCol size="12">
              <IonButton routerLink="/main/index" size="large" expand="block">
                MASUK TANPA LOGIN
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
        <IonRow>
          <IonCol size="12">
            <IonText>
              belum punya akun?{" "}
              <IonLabel
                color="primary"
                onClick={() => {
                  history.push("/register");
                }}
              >
                <b>Daftar</b>
              </IonLabel>
            </IonText>
          </IonCol>
          <IonCol size="12">
            <IonText>
              lupa password?{" "}
              <IonLabel
                color="primary"
                onClick={() => {
                  history.push("/forgotpassword");
                }}
              >
                <b>Reset</b>
              </IonLabel>
            </IonText>
          </IonCol>
        </IonRow>
      </IonContent>
      <IonLoading isOpen={showLoading} message={"Login..."} />
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

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setEmail,
    setUsername,
    setAccessToken,
    setRequestVerificationToken,
    setMemberId,
    setName,
    setBalance,
    setPhoto,
  },
  component: Login,
});
