import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonRippleEffect,
  IonModal,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonDatetime,
  IonButton,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonAlert,
  isPlatform,
  useIonViewDidEnter,
} from "@ionic/react";
import { chevronForward, person } from "ionicons/icons";
import { close, chevronBackOutline } from "ionicons/icons";
import {
  loadAirlineOrderPassengersData,
  setAirlineOrderPassengersData,
} from "../../data/airline/airline.actions";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
interface OwnProps {
  indexItem: number;
  item: any;
  AOPD?: any;
  PassengerTitle?: any;
  domesticTourType: boolean;
  Nationalities: any;
}
interface StateProps {}
interface DispatchProps {
  setAirlineOrderPassengersData: typeof setAirlineOrderPassengersData;
  loadAirlineOrderPassengersData: typeof loadAirlineOrderPassengersData;
}
interface AirlineOrderBuyerDataItemProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineOrderBuyerDataItem: React.FC<AirlineOrderBuyerDataItemProps> = ({
  indexItem,
  item,
  domesticTourType,
  PassengerTitle,
  setAirlineOrderPassengersData,
  loadAirlineOrderPassengersData,
  AOPD,
  Nationalities,
}) => {
  const [modal, setModal] = useState(false);
  const [PaxBatikMilesNo, setPaxBatikMilesNo] = useState(item.PaxBatikMilesNo);
  const [PaxBirthCountry, setPaxBirthCountry] = useState("ID");
  const [PaxBirthDate, setPaxBirthDate] = useState(
    item.PaxBirthDate || new Date().toString()
  );
  const [PaxFirstName, setPaxFirstName] = useState(item.PaxFirstName);
  const [PaxGender, setPaxGender] = useState(item.PaxGender);
  const [PaxLastName, setPaxLastName] = useState(item.PaxLastName);
  const [PaxNationality, setPaxNationality] = useState("ID");
  const [PaxPassportExpiredDate, setPaxPassportExpiredDate] = useState(
    item.PaxPassportExpiredDate
  );
  const [PaxPassportIssuedCountry, setPaxPassportIssuedCountry] =
    useState("ID");
  const [PaxPassportIssuedDate, setPaxPassportIssuedDate] = useState(
    item.PaxPassportIssuedDate
  );
  const [PaxPassportNumber, setPaxPassportNumber] = useState(
    item.PaxPassportNumber
  );
  const [PaxParent, setPaxParent] = useState(item.PaxParent);
  const [PaxTitle, setPaxTitle] = useState(item.PaxTitle);
  const [CountryList, setCountryList] = useState<any>(null);
  useIonViewDidEnter(() => {
    setPaxBatikMilesNo(item.PaxBatikMilesNo);
    setPaxBirthCountry(item.PaxBirthCountry);
    setPaxBirthDate(item.PaxBirthDate);
    setPaxFirstName(item.PaxFirstName);
    setPaxGender(item.PaxGender);
    setPaxLastName(item.PaxLastName);
    setPaxNationality(item.PaxNationality);
    setPaxParent(item.PaxParent);
    setPaxPassportExpiredDate(item.PaxPassportExpiredDate);
    setPaxPassportIssuedCountry(item.PaxPassportIssuedCountry);
    setPaxPassportIssuedDate(item.PaxPassportIssuedDate);
    setPaxPassportNumber(item.PaxPassportNumber);
    setPaxTitle(item.PaxTitle);
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
    if (!PaxNationality || PaxNationality === "") {
      failedAlert("Kewarganegaraan Wajib dipilih");
      return;
    }
    if (!PaxBirthDate || PaxBirthDate === "") {
      failedAlert("Tanggal Lahir Wajib Diisi");
      return;
    }
    if (!PaxBirthCountry || PaxBirthCountry === "") {
      failedAlert("Negara Kelahiran Wajib Diisi");
      return;
    }
    if (!PaxGender || PaxGender === "") {
      failedAlert("Jenis Kelamin Wajib dipilih");
      return;
    }
    if (item.PaxType === "Infant" && PaxParent === null) {
      failedAlert("Penumpang bayi wajib memilih orang tua");
      return;
    }
    PaxDataSaveToLocal();
    setModal(false);
  };
  const PaxDataSaveToLocal = () => {
    const PassengersData = AOPD;
    PassengersData[indexItem] = {
      PaxIDNumber: null,
      PaxAddOns: null,
      PaxBatikMilesNo: PaxBatikMilesNo,
      PaxBirthCountry: PaxBirthCountry,
      PaxBirthDate: PaxBirthDate,
      PaxFirstName: PaxFirstName,
      PaxGarudaFrequentFlyer: null,
      PaxGender: PaxGender,
      PaxLastName: PaxLastName,
      PaxNationality: PaxNationality,
      PaxParent: PaxParent,
      PaxPassportExpiredDate: PaxPassportExpiredDate,
      PaxPassportIssuedCountry: PaxPassportIssuedCountry,
      PaxPassportIssuedDate: PaxPassportIssuedDate,
      PaxPassportNumber: PaxPassportNumber,
      PaxTitle: PaxTitle,
      PaxType:
        (PassengersData[indexItem] && PassengersData[indexItem].PaxType) || "",
      PaxLabel:
        (PassengersData[indexItem] && PassengersData[indexItem].PaxLabel) || "",
    };
    setAirlineOrderPassengersData(PassengersData);
    loadAirlineOrderPassengersData();

    // localStorage.setItem("TourOrderPaxFullData", JSON.stringify(PaxFullData));
  };
  const closeModal = () => {
    setPaxBatikMilesNo(item.PaxBatikMilesNo);
    setPaxBirthCountry(item.PaxBirthCountry);
    setPaxBirthDate(item.PaxBirthDate);
    setPaxFirstName(item.PaxFirstName);
    setPaxGender(item.PaxGender);
    setPaxLastName(item.PaxLastName);
    setPaxNationality(item.PaxNationality);
    setPaxPassportExpiredDate(item.PaxPassportExpiredDate);
    setPaxPassportIssuedCountry(item.PaxPassportIssuedCountry);
    setPaxPassportIssuedDate(item.PaxPassportIssuedDate);
    setPaxPassportNumber(item.PaxPassportNumber);
    setPaxTitle(item.PaxTitle);
    setModal(false);
  };
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    // setShowLoading(false);
    setHeaderAlert("Ups! ada yang kurang");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };

  // console.log(PassengerTitle[item.PaxType.split(" ")[0] || "Adult"]);
  // console.log(AOPD);

  return (
    <div className="ion-no-padding">
      <IonCard
        className="ion-activatable ripple-parent ion-margin-bottom"
        onClick={() => {
          const AOOP = localStorage.getItem("AirlineOrderOrderPerson");

          if (AOOP && JSON.parse(AOOP).OrderPersonMethod) {
            setModal(true);
          } else {
            failedAlert("Pastikan data pemesan sudah terisi dengan benar");
          }
        }}
      >
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonIcon icon={person} className="ion-margin-end"></IonIcon>
                <IonText hidden={AOPD[indexItem].PaxFirstName !== ""}>
                  Penumpang {AOPD[indexItem].PaxLabel}
                </IonText>
                <IonText hidden={AOPD[indexItem].PaxFirstName === ""}>
                  {AOPD[indexItem].PaxFirstName}
                </IonText>
                <IonText color="danger">*</IonText>
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
            <IonTitle
              hidden={AOPD[indexItem].PaxFirstName !== ""}
            >{`Penumpang ${AOPD[indexItem].PaxLabel}`}</IonTitle>
            <IonTitle
              hidden={AOPD[indexItem].PaxFirstName === ""}
            >{`${AOPD[indexItem].PaxFirstName}`}</IonTitle>
          </IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Titel</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxTitle}
                    placeholder="Pilih Titel"
                    onIonChange={(e) => setPaxTitle(e.detail.value)}
                  >
                    {PassengerTitle
                      ? PassengerTitle &&
                        PassengerTitle[
                          item.PaxType.split(" ")[0] || "Adult"
                        ].map((t, i) => (
                          <IonSelectOption value={t.ID} key={i}>
                            {t.Name} ({t.Gender})
                          </IonSelectOption>
                        ))
                      : ""}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Jenis Kelamin</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxGender}
                    placeholder="Pilih Jenis Kelamin"
                    onIonChange={(e) => setPaxGender(e.detail.value)}
                  >
                    <IonSelectOption value="Male">Laki-Laki</IonSelectOption>
                    <IonSelectOption value="Female">Perempuan</IonSelectOption>
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
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Negara Kelahiran</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxBirthCountry}
                    placeholder="Pilih Negara Kelahiran"
                    onIonChange={(e) => setPaxBirthCountry(e.detail.value)}
                  >
                    {Nationalities.map((item: any, index: number) => (
                      <IonSelectOption key={index} value={item.Id}>
                        <small>{item.Name}</small>
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Kewarganegaraan</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxNationality}
                    placeholder="Pilih Kewarganegaraan"
                    onIonChange={(e) => setPaxNationality(e.detail.value)}
                  >
                    {Nationalities.map((item: any, index: number) => (
                      <IonSelectOption key={index} value={item.Id}>
                        <small>{item.Name}</small>
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem>
                  <IonLabel>
                    <small>Tanggal Lahir</small>
                  </IonLabel>
                  <IonDatetime
                    value={PaxBirthDate}
                    onIonChange={(e) => setPaxBirthDate(e.detail.value!)}
                    placeholder="Pilih Tanggal"
                  ></IonDatetime>
                </IonItem>
              </IonCol>
              <IonCol
                size="12"
                hidden={item && item.PaxType === "Infant" ? false : true}
              >
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Orang Tua</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxParent}
                    placeholder="Pilih Orang Tua"
                    onIonChange={(e) => setPaxParent(e.detail.value)}
                  >
                    {AOPD.filter((P) => P.PaxType === "Adult").map(
                      (item: any, index: number) => (
                        <IonSelectOption key={index} value={index}>
                          <small>
                            {item.PaxFirstName === ""
                              ? item.PaxLabel
                              : item.PaxFirstName}
                          </small>
                        </IonSelectOption>
                      )
                    )}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem>
                  <IonLabel position="floating">
                    <small>Nomor Passport</small>
                  </IonLabel>
                  <IonInput
                    type="number"
                    value={PaxPassportNumber}
                    onIonChange={(e) => setPaxPassportNumber(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem>
                  <IonLabel>
                    <small>Tanggal Dikeluarkan</small>
                  </IonLabel>
                  <IonDatetime
                    value={PaxPassportIssuedDate}
                    onIonChange={(e) =>
                      setPaxPassportIssuedDate(e.detail.value!)
                    }
                    placeholder="Pilih Tanggal"
                  ></IonDatetime>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Negara Penerbit</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxPassportIssuedCountry}
                    placeholder="Pilih Negara"
                    onIonChange={(e) =>
                      setPaxPassportIssuedCountry(e.detail.value)
                    }
                  >
                    {Nationalities.map((item: any, index: number) => (
                      <IonSelectOption key={index} value={item.Id}>
                        <small>{item.Name}</small>
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem>
                  <IonLabel>
                    <small>Tanggal Habis Berlaku</small>
                  </IonLabel>
                  <IonDatetime
                    value={PaxPassportExpiredDate}
                    onIonChange={(e) =>
                      setPaxPassportExpiredDate(e.detail.value!)
                    }
                    placeholder="Pilih Tanggal"
                  ></IonDatetime>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem>
                  <IonLabel position="floating">
                    <small>Lion Passport/Batik Miles No </small>
                  </IonLabel>
                  <IonInput
                    type="text"
                    value={PaxBatikMilesNo}
                    onIonChange={(e) => setPaxBatikMilesNo(e.detail.value!)}
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
  // mapStateToProps: (state) => ({
  //   ABDB: state.airline.AirlineBookingDataBundle,
  //   AOPD: state.airline.AirlineOrderPassengersData,
  //   UserData: selectors.getUserData(state),
  // }),
  mapDispatchToProps: {
    setAirlineOrderPassengersData,
    loadAirlineOrderPassengersData,
  },
  component: React.memo(withRouter(AirlineOrderBuyerDataItem)),
});
