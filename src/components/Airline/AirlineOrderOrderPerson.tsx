import React, { useEffect, useState } from "react";

import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonText,
  IonList,
  IonRadioGroup,
  IonItem,
  IonLabel,
  IonRadio,
  IonModal,
  IonContent,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAlert,
} from "@ionic/react";
import DefaultToolbar from "../shared/DefaultToolbar";

export default function AirlineOrderOrderPerson({
  name,
  email,
}: {
  name?: any;
  email?: any;
}) {
  const AOOP = localStorage.AirlineOrderOrderPerson
    ? JSON.parse(localStorage.AirlineOrderOrderPerson)
    : undefined;
  const [ShowModalOrderPerson, setShowModalOrderPerson] = useState(false);
  const [OrderPersonMethod, setOrderPersonMethod] = useState<string>(
    AOOP ? AOOP.OrderPersonMethod : ""
  );
  const [OrderPersonTitel, setOrderPersonTitel] = useState<string>(
    AOOP ? AOOP.OrderPersonTitel : ""
  );
  const [OrderPersonFirstName, setOrderPersonFirstName] = useState<string>(
    AOOP ? AOOP.OrderPersonFirstName : ""
  );
  const [OrderPersonLastName, setOrderPersonLastName] = useState<string>(
    AOOP ? AOOP.OrderPersonLastName : ""
  );
  const [OrderPersonNationCode, setOrderPersonNationCode] = useState<string>(
    AOOP ? AOOP.OrderPersonNationCode : "62"
  );
  const [OrderPersonPhoneNumber, setOrderPersonPhoneNumber] = useState<string>(
    AOOP ? AOOP.OrderPersonPhoneNumber : ""
  );
  const [OrderPersonEmail, setOrderPersonEmail] = useState<string>(
    AOOP ? AOOP.OrderPersonEmail : ""
  );

  const switchOrderBy = (val: string) => {
    const AOOP = localStorage.AirlineOrderOrderPerson
      ? JSON.parse(localStorage.AirlineOrderOrderPerson)
      : undefined;
    if (AOOP && AOOP.OrderPersonMethod === val) {
      setOrderPersonMethod(AOOP ? AOOP.OrderPersonMethod : "");
      setOrderPersonTitel(AOOP ? AOOP.OrderPersonTitel : "");
      setOrderPersonFirstName(AOOP ? AOOP.OrderPersonFirstName : "");
      setOrderPersonLastName(AOOP ? AOOP.OrderPersonLastName : "");
      setOrderPersonNationCode(AOOP ? AOOP.OrderPersonNationCode : "62");
      setOrderPersonPhoneNumber(AOOP ? AOOP.OrderPersonPhoneNumber : "");
      setOrderPersonEmail(AOOP ? AOOP.OrderPersonEmail : "");
    } else {
      setOrderPersonTitel("");
      setOrderPersonPhoneNumber("");
      if (val === "0") {
        setOrderPersonFirstName(name);
        setOrderPersonLastName("");
        setOrderPersonEmail(email);
      } else {
        setOrderPersonFirstName("");
        setOrderPersonLastName("");
        setOrderPersonEmail("");
      }
    }
    setShowModalOrderPerson(true);
  };
  const submitOrderPerson = () => {
    if (!OrderPersonTitel || OrderPersonTitel === "") {
      failedAlert("Titel Pemesan Wajib dipilih");
      return;
    }
    if (!OrderPersonFirstName || OrderPersonFirstName === "") {
      failedAlert("Nama Depan Pemesan Wajib diisi");
      return;
    }
    if (!OrderPersonLastName || OrderPersonLastName === "") {
      failedAlert("Nama Belakang Pemesan Wajib diisi");
      return;
    }
    if (!OrderPersonNationCode || OrderPersonNationCode === "") {
      failedAlert("Kode Negara Pemesan Wajib diisi");
      return;
    }
    if (
      !OrderPersonPhoneNumber ||
      OrderPersonPhoneNumber === "" ||
      OrderPersonPhoneNumber.length < 10
    ) {
      failedAlert("Nomor Telepon Pemesan Wajib diisi minimal 10 karakter");
      return;
    }
    if (!OrderPersonEmail || OrderPersonEmail === "") {
      failedAlert("Email Pemesan Wajib diisi");
      return;
    }
    if (OrderPersonEmail === email) setOrderPersonMethod("0");
    if (OrderPersonEmail !== email) setOrderPersonMethod("1");
    localStorage.setItem(
      "AirlineOrderOrderPerson",
      JSON.stringify({
        OrderPersonMethod: OrderPersonEmail === email ? "0" : "1",
        OrderPersonTitel: OrderPersonTitel,
        OrderPersonFirstName: OrderPersonFirstName,
        OrderPersonLastName: OrderPersonLastName,
        OrderPersonNationCode: OrderPersonNationCode,
        OrderPersonPhoneNumber: OrderPersonPhoneNumber,
        OrderPersonEmail: OrderPersonEmail,
      })
    );
    setShowModalOrderPerson(false);
  };
  const closeModal = () => {
    const AOOP = localStorage.AirlineOrderOrderPerson
      ? JSON.parse(localStorage.AirlineOrderOrderPerson)
      : undefined;
    if (AOOP) {
      setOrderPersonMethod(AOOP ? AOOP.OrderPersonMethod : "");
      setOrderPersonTitel(AOOP ? AOOP.OrderPersonTitel : "");
      setOrderPersonFirstName(AOOP ? AOOP.OrderPersonFirstName : "");
      setOrderPersonLastName(AOOP ? AOOP.OrderPersonLastName : "");
      setOrderPersonNationCode(AOOP ? AOOP.OrderPersonNationCode : "62");
      setOrderPersonPhoneNumber(AOOP ? AOOP.OrderPersonPhoneNumber : "");
      setOrderPersonEmail(AOOP ? AOOP.OrderPersonEmail : "");
    }
    setShowModalOrderPerson(false);
  };
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    setHeaderAlert("Ups! ada yang kurang");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <div className="ion-no-padding">
      <IonText class="ion-padding" color="dark">
        <small>Data Pemesan (Penerima E-Voucher/E-Tiket)</small>
      </IonText>
      <IonCard className="ion-margin-bottom">
        <IonCardContent>
          <IonText color="dark">
            <h4>{name}</h4>
          </IonText>
          <IonText color="medium">
            <small>{email}</small>
          </IonText>
        </IonCardContent>
        <IonList className="card-footer">
          <IonRadioGroup value={OrderPersonMethod}>
            <IonItem lines="none" onClick={() => switchOrderBy("0")}>
              <IonLabel>Saya sebagai pemesannya</IonLabel>
              <IonRadio slot="start" value="0" className="ion-margin-end" />
            </IonItem>
            <IonItem lines="none" onClick={() => switchOrderBy("1")}>
              <IonLabel>Saya pesan untuk orang lain</IonLabel>
              <IonRadio slot="start" value="1" className="ion-margin-end" />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      </IonCard>
      {/* Modal Order Person */}
      <IonModal isOpen={ShowModalOrderPerson}>
        <IonContent>
          <DefaultToolbar
            title="Data Pemesan"
            color="primary"
            backButtonRoute={() => {
              closeModal();
            }}
          />
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Titel</small>
                  </IonLabel>
                  <IonSelect
                    value={OrderPersonTitel}
                    placeholder="Select One"
                    onIonChange={(e) => setOrderPersonTitel(e.detail.value)}
                  >
                    <IonSelectOption value="MR">Mr (Male)</IonSelectOption>
                    <IonSelectOption value="MS">Ms (Female)</IonSelectOption>
                    <IonSelectOption value="MISS">
                      Miss (Female)
                    </IonSelectOption>
                    <IonSelectOption value="MSTR">Mstr (Male)</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonItem>
                  <IonLabel position="floating">
                    <small>Nama Depan</small>
                  </IonLabel>
                  <IonInput
                    value={OrderPersonFirstName}
                    onIonChange={(e) =>
                      setOrderPersonFirstName(e.detail.value!)
                    }
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonItem>
                  <IonLabel position="floating">
                    <small>Nama Belakang</small>
                  </IonLabel>
                  <IonInput
                    value={OrderPersonLastName}
                    onIonChange={(e) => setOrderPersonLastName(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="4">
                <IonItem>
                  <IonLabel position="stacked">
                    <small>Kode Negara</small>
                  </IonLabel>
                  <IonInput
                    value={OrderPersonNationCode}
                    onIonChange={(e) =>
                      setOrderPersonNationCode(e.detail.value!)
                    }
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="8">
                <IonItem>
                  <IonLabel position="floating">
                    <small>No. Handphone</small>
                  </IonLabel>
                  <IonInput
                    type="number"
                    value={OrderPersonPhoneNumber}
                    onIonChange={(e) =>
                      setOrderPersonPhoneNumber(e.detail.value!)
                    }
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonItem>
                  <IonLabel position="floating">
                    <small>Email</small>
                  </IonLabel>
                  <IonInput
                    value={OrderPersonEmail}
                    onIonChange={(e) => setOrderPersonEmail(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonButton
                  className="text-transform-none"
                  expand="block"
                  onClick={() => submitOrderPerson()}
                >
                  Simpan
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={headerAlert}
        message={messageAlert}
        buttons={["OK"]}
      />
    </div>
  );
}
