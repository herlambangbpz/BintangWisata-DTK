import React, { useState } from "react";
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
import { setIsLoggedIn, setUsername } from "../../data/user/user.actions";
import { connect } from "../../data/connect";
import { RouteComponentProps } from "react-router";
import { MainUrl, AppId } from "../../AppConfig";
import { HTTP } from "@ionic-native/http";
interface OwnProps extends RouteComponentProps {}
interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}
interface RegisterProps extends OwnProps, DispatchProps {}
const Register: React.FC<RegisterProps> = ({
  setIsLoggedIn,
  history,
  setUsername: setUsernameAction,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!username) {
      setUsernameError(true);
    }
    if (!password) {
      setPasswordError(true);
    }

    if (username && password && email) {
      setShowLoading(true);
      const MyData = new FormData();
      MyData.append("username", username);
      MyData.append("email", email);
      MyData.append("password", password);
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("multipart");
        HTTP.post(MainUrl + "member/register", MyData, { appid: AppId })
          .then((res) => {
            if (res.status !== 200) {
              failedAlert("Periksa Koneksi Internet");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            if (res.RespStatus !== "OK") {
              failedAlert(res);
            } else {
              successAlert(
                "Cek Email " + email + " untuk verifikasi pendaftaran"
              );
              history.push("/main/index", { direction: "none" });
            }
          })
          .catch((error) => {
            failedAlert(error.error);
          });
      } else {
        fetch(MainUrl + "member/register", {
          method: "POST",
          body: MyData,
          headers: { appid: AppId },
        })
          // Check Connection
          .then((res) => {
            if (!res.ok) {
              failedAlert("Periksa Koneksi Internet");
            }
            return res.json();
          })
          .then((res) => {
            if (res.RespStatus !== "OK") {
              failedAlert(res.RespStatus);
            } else {
              successAlert(
                "Cek Email " + email + " untuk verifikasi pendaftaran"
              );
              history.push("/main/index", { direction: "none" });
            }
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
  const successAlert = (successMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Sukses");
    setMessageAlert(successMessage);
    setShowAlert(true);
  };
  return (
    <IonPage id="register-page">
      <IonContent className="ion-padding">
        <IonGrid className="ion-text-center">
          <IonText>
            <b>DAFTAR</b>
          </IonText>
        </IonGrid>

        <form noValidate onSubmit={register}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">
                Username
              </IonLabel>
              <IonInput
                name="username"
                type="text"
                value={username}
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
                E-Mail
              </IonLabel>
              <IonInput
                name="username"
                type="email"
                value={email}
                spellCheck={false}
                autocapitalize="off"
                onIonChange={(e) => setEmail(e.detail.value!)}
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
              <IonButton type="submit" size="large" expand="block">
                DAFTAR
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
        <IonRow>
          <IonCol size="12">
            <IonText>
              sudah punya akun?{" "}
              <IonLabel
                color="primary"
                onClick={() => {
                  history.push("/login");
                }}
              >
                <b>Login</b>
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
      <IonLoading isOpen={showLoading} message={"Mendaftar..."} />
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
    setUsername,
  },
  component: Register,
});
