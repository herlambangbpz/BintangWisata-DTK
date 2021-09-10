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
  IonIcon,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSelect,
  IonSelectOption,
  IonListHeader,
  isPlatform,
  IonAlert,
  IonLoading,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import "./BalanceRequest.scss";
import { connect } from "../../data/connect";
import {
  chevronBackOutline,
  chevronForwardOutline,
  newspaper,
} from "ionicons/icons";
import { AppId, MainUrl } from "../../AppConfig";
import { HTTP } from "@ionic-native/http";

interface StateProps {
  balance?: string;
  requestVerificationToken: string;
  accessToken: string;
}
interface BalanceRequestProps extends RouteComponentProps, StateProps {}

const BalanceRequest: React.FC<BalanceRequestProps> = ({
  history,
  balance,
  requestVerificationToken,
  accessToken,
}) => {
  const [PaymentMethod, setPaymentMethod] = useState<string>("");
  const [Ammount, setAmmount] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const RequestDepositSubmit = () => {
    if (PaymentMethod === "") {
      failedAlert("Pilih Metode Pembayaran");
      return;
    }
    if (Ammount === "") {
      failedAlert("Inputkan Jumlah Deposit");
      return;
    }
    setShowLoading(true);
    const MyData = new FormData();
    MyData.append("Amount", Ammount || "");
    MyData.append("DepositPaymentMethod", "1");
    MyData.append("SelectedBankAccount", PaymentMethod || "");
    MyData.append("accToken", accessToken);
    const myHeaders = {
      appid: AppId,
      RequestVerificationToken: requestVerificationToken,
    };
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "member/deposit", MyData, myHeaders)
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Periksa Koneksi Internet");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.RespStatus === "OK") {
            successAlert(res.Message);
            history.push("/balanceactivities");
          } else {
            failedAlert(res.Message);
          }
        })
        .catch((error) => failedAlert("Periksa Koneksi Internet Anda"));
    } else {
      fetch(MainUrl + "member/deposit", {
        method: "POST",
        headers: myHeaders,
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
          if (res.RespStatus === "OK") {
            successAlert(res.Message);
            history.push("/balanceactivities");
          } else {
            failedAlert(res.Message);
          }
        })
        .catch((error) => {
          failedAlert("Periksa Koneksi Internet Anda");
        });
    }
  };
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const successAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Sukses");
    setMessageAlert(errorMessage);
    setShowAlert(true);
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
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                history.push("/balanceactivities");
              }}
            >
              <IonIcon icon={newspaper} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Saldo</IonTitle>
        </IonToolbar>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">
            Rp {balance ? balance : 0}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel color="medium">Bank Tujuan</IonLabel>
            <IonSelect
              value={PaymentMethod}
              placeholder="Pilih Bank"
              onIonChange={(e) => setPaymentMethod(e.detail.value)}
            >
              <IonSelectOption value="BCA">BCA</IonSelectOption>
              <IonSelectOption value="BRI">BRI</IonSelectOption>
              <IonSelectOption value="BNI">BNI</IonSelectOption>
              <IonSelectOption value="Mandiri">Mandiri</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonListHeader lines="none">
            <IonLabel color="medium">Jumlah Deposit</IonLabel>
          </IonListHeader>
          <IonItem style={{ marginTop: "-16px", zIndex: "-1" }}>
            <IonLabel color="dark">Rp</IonLabel>
            <IonInput
              type="number"
              value={Ammount}
              onIonChange={(e) => {
                setAmmount(e.detail.value!);
              }}
            ></IonInput>
          </IonItem>
        </IonList>
        <IonButton
          expand="block"
          className="text-transform-none"
          onClick={() => RequestDepositSubmit()}
        >
          Kirim
        </IonButton>
        <IonLoading isOpen={showLoading} message={"Request Deposit..."} />
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

export default connect<StateProps>({
  mapStateToProps: (state) => ({
    accessToken: state.user.accessToken,
    requestVerificationToken: state.user.requestVerificationToken,
    balance: state.user.balance,
  }),
  component: React.memo(withRouter(BalanceRequest)),
});
