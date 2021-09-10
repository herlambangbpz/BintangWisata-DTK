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
} from "@ionic/react";
import { chevronForward, person } from "ionicons/icons";
import { close, chevronBackOutline } from "ionicons/icons";
import { AppId, MainUrl } from "../AppConfig";
import { HTTP } from "@ionic-native/http";

export default function TourOrderBuyerDataItem({
  indexItem,
  type,
  domesticTourType,
}: {
  indexItem: number;
  type: string;
  domesticTourType: boolean;
}) {
  const [modal, setModal] = useState(false);
  const [PaxMaturity, setPaxMaturity] = useState("");
  const [PaxTitel, setPaxTitel] = useState("");
  const [PaxFirstName, setPaxFirstName] = useState("");
  const [PaxLastName, setPaxLastName] = useState("");
  const [PaxNation, setPaxNation] = useState("");
  const [PaxBirthday, setPaxBirthday] = useState("");
  const [PaxPassportNumber, setPaxPassportNumber] = useState("");
  const [PaxPassportPublishDate, setPaxPassportPublishDate] = useState("");
  const [PaxPassportPublishCountry, setPaxPassportPublishCountry] =
    useState("");
  const [PaxPassportExpiredDate, setPaxPassportExpiredDate] = useState("");

  const [CountryList, setCountryList] = useState<any>(null);

  React.useEffect(() => {
    const PaxFullData = JSON.parse(localStorage.TourOrderPaxFullData);
    const PaxData = PaxFullData[indexItem];
    setPaxMaturity(PaxData.PaxMaturity);
    setPaxTitel(PaxData.PaxTitel);
    setPaxFirstName(PaxData.PaxFirstName);
    setPaxLastName(PaxData.PaxLastName);
    setPaxNation(PaxData.PaxNation);
    setPaxBirthday(PaxData.PaxBirthday);
    setPaxPassportNumber(PaxData.PaxPassportNumber);
    setPaxPassportPublishDate(PaxData.PaxPassportPublishDate);
    setPaxPassportPublishCountry(PaxData.PaxPassportPublishCountry);
    setPaxPassportExpiredDate(PaxData.PaxPassportExpiredDate);
    if (localStorage.CountryList) {
      setCountryList(JSON.parse(localStorage.CountryList));
    } else {
      if (isPlatform("cordova")) {
        HTTP.get(MainUrl + "member/GetCountryList", {}, { AppId: AppId })
          .then((res) => {
            if (res.status !== 200) {
              alert("Periksa Koneksi anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            if (res.length > 0) {
              setCountryList(res);
              localStorage.setItem("CountryList", JSON.stringify(res));
            }
          })
          .catch((err) => {
            failedAlert(JSON.stringify(err));
          });
      } else {
        fetch(MainUrl + "member/GetCountryList", {
          method: "GET",
          headers: { AppId: AppId },
        })
          .then((r) => {
            if (r.ok) {
              return r.json();
            } else {
              failedAlert("Periksa Koneksi Anda");
            }
          })
          .then((res) => {
            if (res.length > 0) {
              setCountryList(res);
              localStorage.setItem("CountryList", JSON.stringify(res));
            }
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
          });
      }
    }
  }, []);
  const PaxDataSubmit = () => {
    if (!PaxTitel || PaxTitel === "") {
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
    if (!domesticTourType) {
      if (!PaxNation || PaxNation === "") {
        failedAlert("Kewarganegaraan Wajib dipilih");
        return;
      }
      if (!PaxBirthday || PaxBirthday === "") {
        failedAlert("Tanggal Lahir Wajib Diisi");
        return;
      }
      if (!PaxPassportNumber || PaxPassportNumber === "") {
        failedAlert("Nomor Passport Wajib Diisi");
        return;
      }
      if (!PaxPassportPublishDate || PaxPassportPublishDate === "") {
        failedAlert("Tanggal Diterbitkan Passport Wajib Diisi");
        return;
      }
      if (!PaxPassportPublishCountry || PaxPassportPublishCountry === "") {
        failedAlert("Negara Penerbit Passport Wajib Diisi");
        return;
      }
      if (!PaxPassportExpiredDate || PaxPassportExpiredDate === "") {
        failedAlert("Tanggal Kadaluarsa Passport  Wajib Diisi");
        return;
      }
    }
    PaxDataSaveToLocal();
    setModal(false);
  };
  const PaxDataSaveToLocal = () => {
    let PaxFullData = JSON.parse(localStorage.TourOrderPaxFullData);
    PaxFullData[indexItem] = {
      PaxMaturity: PaxMaturity,
      PaxTitel: PaxTitel,
      PaxFirstName: PaxFirstName,
      PaxLastName: PaxLastName,
      PaxNation: PaxNation,
      PaxBirthday: PaxBirthday,
      PaxPassportNumber: PaxPassportNumber,
      PaxPassportPublishDate: PaxPassportPublishDate,
      PaxPassportPublishCountry: PaxPassportPublishCountry,
      PaxPassportExpiredDate: PaxPassportExpiredDate,
    };
    // console.log(PaxFullData);
    // Update New Array
    localStorage.setItem("TourOrderPaxFullData", JSON.stringify(PaxFullData));
  };
  const closeModal = () => {
    const TOPFD = localStorage.TourOrderPaxFullData
      ? JSON.parse(localStorage.TourOrderPaxFullData)
      : undefined;
    if (TOPFD) {
      setPaxTitel(TOPFD ? TOPFD[indexItem].PaxTitel : "");
      setPaxFirstName(TOPFD ? TOPFD[indexItem].PaxFirstName : "");
      setPaxLastName(TOPFD ? TOPFD[indexItem].PaxLastName : "");
      setPaxNation(TOPFD ? TOPFD[indexItem].PaxPassportNumber : "");
      setPaxBirthday(TOPFD ? TOPFD[indexItem].PaxBirthday : "");
      setPaxPassportNumber(TOPFD ? TOPFD[indexItem].PaxPassportNumber : "");
      setPaxPassportPublishDate(
        TOPFD ? TOPFD[indexItem].PaxPassportPublishDate : ""
      );
      setPaxPassportPublishCountry(
        TOPFD ? TOPFD[indexItem].PaxPassportPublishCountry : ""
      );
      setPaxPassportExpiredDate(
        TOPFD ? TOPFD[indexItem].PaxPassportExpiredDate : ""
      );
    }
    setModal(false);
  };
  // const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    // setShowLoading(false);
    setHeaderAlert("Ups! ada yang kurang");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <div className="ion-no-padding">
      <IonCard
        className="ion-activatable ripple-parent ion-margin-bottom"
        onClick={() => setModal(true)}
      >
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonIcon icon={person} className="ion-margin-end"></IonIcon>
                <IonText>
                  Penumpang {indexItem + 1} ({type})
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
            <IonTitle>{`Penumpang ${indexItem + 1} (${type})`}</IonTitle>
          </IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Titel</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxTitel}
                    placeholder="Select One"
                    onIonChange={(e) => setPaxTitel(e.detail.value)}
                  >
                    <IonSelectOption value="Mr">Tuan</IonSelectOption>
                    <IonSelectOption value="Mrs">Nyonya</IonSelectOption>
                    <IonSelectOption value="Ms">Nona</IonSelectOption>
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
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem className="ion-no-padding">
                  <IonLabel className="ion-padding-start">
                    <small>Kewarganegaraan</small>
                  </IonLabel>
                  <IonSelect
                    value={PaxNation}
                    placeholder="Pilih Kewarganegaraan"
                    onIonChange={(e) => setPaxNation(e.detail.value)}
                  >
                    {CountryList !== null
                      ? CountryList.map((item: any, index: number) => (
                          <IonSelectOption key={index} value={item.Value}>
                            <small>{item.Value}</small>
                          </IonSelectOption>
                        ))
                      : ""}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol size="12" hidden={domesticTourType}>
                <IonItem>
                  <IonLabel>
                    <small>Tanggal Lahir</small>
                  </IonLabel>
                  <IonDatetime
                    value={PaxBirthday}
                    onIonChange={(e) => setPaxBirthday(e.detail.value!)}
                    placeholder="Pilih Tanggal"
                  ></IonDatetime>
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
                    value={PaxPassportPublishDate}
                    onIonChange={(e) =>
                      setPaxPassportPublishDate(e.detail.value!)
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
                    value={PaxPassportPublishCountry}
                    placeholder="Pilih Negara"
                    onIonChange={(e) =>
                      setPaxPassportPublishCountry(e.detail.value)
                    }
                  >
                    {CountryList !== null
                      ? CountryList.map((item: any, index: number) => (
                          <IonSelectOption key={index} value={item.Value}>
                            <small>{item.Value}</small>
                          </IonSelectOption>
                        ))
                      : ""}
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
}
