import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRippleEffect,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import { chevronForward, close, person } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from "../../data/connect";
interface OwnProps {
  indexRoom: number;
  indexPax: number;
  pax: any;
  setHotelOrderGuest: any;
}
interface StateProps {}
interface DispatchProps {}
interface HotelOrderBuyerDataItemProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const HotelOrderBuyerDataItem: React.FC<HotelOrderBuyerDataItemProps> = ({
  indexRoom,
  indexPax,
  pax,
  setHotelOrderGuest,
}) => {
  const [modal, setModal] = useState(false);
  const [PaxFirstName, setPaxFirstName] = useState(pax.FirstName || "");
  const [PaxLastName, setPaxLastName] = useState(pax.LastName || "");
  const [PaxTitle, setPaxTitle] = useState(pax.Title || "");
  useIonViewDidEnter(() => {
    setPaxFirstName(pax.FirstName || "");
    setPaxLastName(pax.LastName || "");
    setPaxTitle(pax.Title || "");
  });

  const PaxDataSubmit = () => {
    if (!PaxTitle || PaxTitle === "") {
      failedAlert("Titel Harus Dipilih");
      return;
    }
    if (!PaxFirstName || PaxFirstName === "") {
      failedAlert("Nama Depan Wajib Diisi");
      return;
    }
    if (!PaxLastName || PaxLastName === "") {
      failedAlert("Nama Belakang Wajib Diisi");
      return;
    }
    PaxDataSaveToLocal();
    setModal(false);
  };
  const PaxDataSaveToLocal = () => {
    let HOG: any = localStorage.getItem("HotelOrderGuest") || null;
    HOG = JSON.parse(HOG || "");
    HOG.Prebook.rooms[indexRoom].paxes[indexPax] = {
      FirstName: PaxFirstName,
      LastName: PaxLastName,
      Title: PaxTitle,
    };
    localStorage.setItem("HotelOrderGuest", JSON.stringify(HOG));
    setHotelOrderGuest(HOG);
  };
  const closeModal = () => {
    setPaxFirstName(pax.PaxFirstName);
    setPaxLastName(pax.PaxLastName);
    setPaxTitle(pax.PaxTitle);
    setModal(false);
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
      <IonCard
        className="ion-activatable ripple-parent ion-margin-bottom"
        onClick={() => {
          setModal(true);
        }}
      >
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonIcon icon={person} className="ion-margin-end"></IonIcon>
                <IonText hidden={pax.FirstName !== null}>
                  Data Tamu (Kamar {indexRoom + 1} Tamu {indexPax + 1})
                </IonText>
                <IonText hidden={pax.FirstName === null}>
                  {pax.FirstName || ""}&nbsp;{pax.LastName || ""}
                </IonText>
                <IonText color="danger" hidden={pax.FirstName !== null}>
                  *
                </IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonIcon icon={chevronForward} color="primary"></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonRippleEffect></IonRippleEffect>
        </IonCardContent>
      </IonCard>
      {/* Modal Order Passengers */}
      <IonModal isOpen={modal}>
        <IonContent>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonButton onClick={() => closeModal()}>
                <IonIcon icon={close}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>
              Data Tamu (Kamar {indexRoom + 1} Tamu {indexPax + 1})
            </IonTitle>
          </IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Title</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxTitle}
                    placeholder="Select One"
                    onIonChange={(e) => setPaxTitle(e.detail.value)}
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
                    value={PaxFirstName}
                    onIonChange={(e) => setPaxFirstName(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonItem>
                  <IonLabel position="floating">
                    <small>Nama Belakang</small>
                  </IonLabel>
                  <IonInput
                    value={PaxLastName}
                    onIonChange={(e) => setPaxLastName(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonButton
                  className="text-transform-none"
                  expand="block"
                  onClick={() => PaxDataSubmit()}
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
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({}),
  mapDispatchToProps: {},
  component: React.memo(withRouter(HotelOrderBuyerDataItem)),
});
