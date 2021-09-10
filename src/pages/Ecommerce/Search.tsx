import React, { useState } from "react";
import {
  IonContent,
  IonIcon,
  IonText,
  IonModal,
  IonAlert,
  IonLoading,
  IonToolbar,
  IonPopover,
  IonItem,
  IonSearchbar,
  IonPage,
  IonHeader,
  IonCard,
  IonLabel,
  IonDatetime,
  IonCol,
  IonCardContent,
  IonButton,
  IonRow,
  IonGrid,
  IonList,
  isPlatform,
} from "@ionic/react";
import { createOutline, star, funnel, filter } from "ionicons/icons";
import { RouteComponentProps, withRouter } from "react-router";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import { connect } from "../../data/connect";
import "./Search.scss";
import { create } from "domain";
import { AppId, ImageBasePath, MainUrl } from "../../AppConfig";
import { rupiah } from "../../helpers/currency";
import { HTTP } from "@ionic-native/http";

interface SearchProps extends RouteComponentProps {}
const Search: React.FC<SearchProps> = ({ history }) => {
  // Toolbar
  // PopOver, Loading
  const [showPopover, setShowPopover] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // datepicker
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const today: Date = new Date();
  const tomorrow: Date = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedStartDateString, setSelectedStartDateString] =
    useState<string>(
      localStorage.filterStartDate
        ? localStorage.filterStartDate
        : today.toISOString()
    );
  const [selectedEndDateString, setSelectedEndDateString] = useState<string>(
    localStorage.filterEndDate
      ? localStorage.filterEndDate
      : new Date(new Date().setDate(new Date().getDate() + 6)).toISOString()
  );
  const [searchText, setSearchText] = useState<string>(
    localStorage.filterSearchText ? localStorage.filterSearchText : ""
  );

  const [selectedStartDate, setSelectedStartDate] = useState<Date>(
    new Date(selectedStartDateString)
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(
    new Date(selectedEndDateString)
  );

  const [searchDateString, setSearchDateString] = useState<string>(`
      ${selectedStartDate.getDate()} ${
    monthNames[selectedStartDate.getMonth()]
  } ${selectedStartDate.getFullYear()}
       -
      ${selectedEndDate.getDate()} ${
    monthNames[selectedEndDate.getMonth()]
  } ${selectedEndDate.getFullYear()}
    `);
  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  const [TourProductSearchList, setTourProductSearchList] = useState<any>(null);

  React.useEffect(() => {
    getTourSearch();
  }, []);

  const changeStartDate = (value: string) => {
    const startDate: Date = new Date(value);
    const endDate: Date = new Date(selectedEndDate);
    if (endDate < startDate) {
      setHeaderAlert("Gagal Memilih Tanggal");
      setMessageAlert("Tanggal Kembali harus lebih dari Tanggal Berangkat");
      setShowAlert(true);
    } else {
      setSelectedStartDateString(value);
    }
  };
  const changeEndDate = (value: string) => {
    const endDate: Date = new Date(value);
    const startDate: Date = new Date(selectedStartDate);
    if (endDate < startDate) {
      setHeaderAlert("Gagal Memilih Tanggal");
      setMessageAlert("Tanggal Kembali harus lebih dari Tanggal Berangkat");
      setShowAlert(true);
    } else {
      setSelectedEndDateString(value);
    }
  };
  const getTourSearch = (offset = 0, limit = 20) => {
    setShowLoading(true);
    setShowPopover(false);
    localStorage.setItem("filterSearchText", searchText);
    localStorage.setItem("filterStartDate", selectedStartDateString);
    localStorage.setItem("filterEndDate", selectedEndDateString);
    const StartDate = new Date(selectedStartDateString);
    const EndDate = new Date(selectedEndDateString);
    const dateFrom =
      StartDate.getFullYear() +
      "-" +
      (StartDate.getMonth() + 1) +
      "-" +
      StartDate.getDate();
    const dateTo =
      EndDate.getFullYear() +
      "-" +
      (EndDate.getMonth() + 1) +
      "-" +
      EndDate.getDate();
    const MyData = new FormData();
    MyData.append("q", searchText);
    MyData.append("Offset", offset.toString());
    MyData.append("dateFrom", dateFrom);
    MyData.append("dateTo", dateTo);
    MyData.append("Limit", limit.toString());
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "tour/search", MyData, { appid: AppId })
        .then((res) => {
          setShowLoading(false);
          if (res.status !== 200) {
            alert("Periksa Koneksi Internet");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.Data == null) {
            setTourProductSearchList(null);
          } else {
            setTourProductSearchList(res.Data.TourProductSearchList);
          }
        })
        .catch((err) => {
          setShowLoading(false);
          alert(err);
        });
    } else {
      fetch(MainUrl + "tour/search", {
        method: "POST",
        body: MyData,
        headers: { appid: AppId },
      })
        // Check Connection
        .then((res) => {
          setShowLoading(false);
          if (!res.ok) {
            alert("Periksa Koneksi Internet");
          }
          return res.json();
        })
        .then((res) => {
          if (res.Data == null) {
            setTourProductSearchList(null);
          } else {
            setTourProductSearchList(res.Data.TourProductSearchList);
          }
        })
        .catch((err) => {
          setShowLoading(false);
          alert("Periksa Koneksi Internet");
        });
    }
  };
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };
  const TourDetail = (key: string) => {
    history.push("/tourDetail");
  };
  return (
    <IonPage>
      <IonHeader translucent>
        <DefaultToolbar
          title={
            searchText !== null || searchText == ""
              ? searchText
              : "Cari Paket Tour"
          }
          color="primary"
          backButtonRoute="/tour"
        />
        {/* <ClickableSearchBox
          placeholder="Mau kemana kita hari ini?" color="light" clickRoute="/"
          /> */}
        <IonToolbar color="primary" className="searchToolbar">
          <IonGrid onClick={() => setShowPopover(true)}>
            <IonRow>
              <IonCol size="11">
                <IonLabel>
                  <small>{searchDateString}</small>
                </IonLabel>
              </IonCol>
              <IonCol size="1">
                <IonIcon icon={createOutline}></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="tourSearch">
        <IonGrid className="serachTourList ion-no-padding">
          {TourProductSearchList !== null ? (
            TourProductSearchList.map((dataItem: any, index: any) => (
              <IonRow
                className="ion-margin-bottom"
                key={dataItem.code}
                onClick={() =>
                  history.push(
                    `/tourDetail/${dataItem.title.replace(/\s+/g, "-")}/${
                      dataItem.code
                    }`
                  )
                }
              >
                <IonCol size="12" className="ion-padding">
                  <img
                    src={ImageBasePath + dataItem.image}
                    width="100%"
                    alt=""
                  />
                  <IonText color="medium">
                    <p className="light-gray ion-no-margin">
                      <small>Tour</small>
                    </p>
                  </IonText>
                  <IonText color="dark">
                    <p className="ion-no-margin">{dataItem.title}</p>
                  </IonText>
                  <IonText color="medium">
                    <p className="ion-no-margin ion-margin-bottom">
                      {rupiah(dataItem.price)}
                    </p>
                  </IonText>
                  {/* <IonIcon icon={star} color="warning"></IonIcon>
              <IonIcon icon={star} color="warning"></IonIcon>
              <IonIcon icon={star} color="warning"></IonIcon>
              <IonIcon icon={star} color="warning"></IonIcon>
              <IonIcon icon={star} color="medium"></IonIcon> */}
                  {/* <br/> */}
                  <a className="tourSearchTag">{dataItem.subtype}</a>
                  {/* <a className="tourSearchTag">series</a>
              <a className="tourSearchTag">halal</a> */}
                </IonCol>
              </IonRow>
            ))
          ) : (
            <div className="loadingData">Produk tidak ditemukan</div>
          )}
        </IonGrid>
        {/* POPOVER */}
        <IonPopover
          isOpen={showPopover}
          cssClass="TourSearchPopover"
          onDidDismiss={(e) => setShowPopover(false)}
        >
          <IonItem>
            <IonSearchbar
              placeholder={
                searchText !== null ? searchText : "Mau kemana hari ini"
              }
              mode="ios"
              className="ion-no-padding"
              onClick={() => setShowModal(true)}
            ></IonSearchbar>
          </IonItem>
          <IonItem>
            <IonLabel>Tanggal Berangkat</IonLabel>
            <IonDatetime
              min={new Date().toISOString()}
              max={new Date(
                new Date().setFullYear(new Date().getFullYear() + 10)
              ).toISOString()}
              displayFormat="DD MMMM YYYY"
              value={selectedStartDateString}
              onIonChange={(e) => changeStartDate(e.detail.value!)}
              doneText="Pilih"
              cancelText="Batal"
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel>Tanggal Kembali</IonLabel>
            <IonDatetime
              min={new Date().toISOString()}
              max={new Date(
                new Date().setFullYear(new Date().getFullYear() + 10)
              ).toISOString()}
              displayFormat="DD MMMM YYYY"
              value={selectedEndDateString}
              onIonChange={(e) => changeEndDate(e.detail.value!)}
              doneText="Pilih"
              cancelText="Batal"
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonButton size="large" onClick={() => getTourSearch()}>
              Cari Paket Tour
            </IonButton>
          </IonItem>
        </IonPopover>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="alert"
          header={headerAlert}
          message={messageAlert}
          buttons={["OK"]}
        />
        <IonLoading
          cssClass="loading"
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Sedang Mengambil..."}
        />
        <IonCard className="tourSearchFilterSort">
          <IonCardContent>
            <IonRow>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={filter} color="primary"></IonIcon>
                <IonText color="primary">&nbsp; Urutkan</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={funnel} color="primary"></IonIcon>
                <IonText color="primary">&nbsp; Filter</IonText>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonModal isOpen={showModal} cssClass="my-custom-class">
        <IonContent>
          <DefaultToolbar
            title="Cari Lokasi Tujuan"
            color="primary"
            backButtonRoute={closeModal}
          />
          <IonSearchbar
            value={searchText}
            placeholder={
              searchText !== null || searchText == "null"
                ? searchText
                : "Mau kemana hari ini"
            }
            mode="ios"
            className="ion-padding"
            onIonChange={(e) => setSearchText(e.detail.value!)}
          ></IonSearchbar>
          <IonList className="ion-padding" onClick={() => setShowModal(false)}>
            <IonText color="medium">
              <small>Rekomendasi</small>
            </IonText>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Denmark")}
            >
              Denmark
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Korea")}
            >
              Korea
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Singapura")}
            >
              Singapura
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Malaysia")}
            >
              Malaysia
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Jakarta")}
            >
              Jakarta
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Surabaya")}
            >
              Surabaya
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Denpasar")}
            >
              Denpasar
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Ambon")}
            >
              Ambon
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Nias")}
            >
              Nias
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Lombok")}
            >
              Lombok
            </IonItem>
            <IonItem
              className="ion-no-padding"
              onClick={() => setSearchText("Medan")}
            >
              Medan
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};
export default connect<SearchProps>({
  component: withRouter(Search),
});
