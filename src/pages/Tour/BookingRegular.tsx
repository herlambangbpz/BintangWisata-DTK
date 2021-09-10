import React, { useState, useRef } from "react";
import {
  IonContent,
  IonToolbar,
  IonCard,
  IonButton,
  IonCardContent,
  IonPage,
  IonHeader,
  IonRow,
  IonGrid,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonCol,
  IonSlides,
  IonSlide,
  IonText,
  IonIcon,
  IonItem,
  IonLabel,
  IonDatetime,
  IonLoading,
  IonAlert,
  isPlatform,
} from "@ionic/react";
import { calendarOutline, timerOutline } from "ionicons/icons";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import "./BookingRegular.scss";
import {
  loadTourProductData,
  setTourProductPricingId,
  setTourProductPricingIndex,
  setTourProductStartDate,
} from "../../data/tour/tour.actions";
import { stringDateConvert } from "../../helpers/datetime";
import { rupiah } from "../../helpers/currency";
import { AppId, MainUrl } from "../../AppConfig";
import { HTTP } from "@ionic-native/http";
interface OwnProps {}
interface StateProps {
  TourProductDetail?: any;
  TourProductPricingIndex?: number;
  TourPaymentAllowStatus: boolean;
}
interface DispatchProps {
  setTourProductPricingIndex: typeof setTourProductPricingIndex;
  setTourProductPricingId: typeof setTourProductPricingId;
  setTourProductStartDate: typeof setTourProductStartDate;
  loadTourProductData: typeof loadTourProductData;
}
interface BookingRegularProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const BookingRegular: React.FC<BookingRegularProps> = ({
  history,
  TourProductDetail,
  loadTourProductData,
  setTourProductPricingId,
  setTourProductPricingIndex,
  TourProductPricingIndex,
  TourPaymentAllowStatus,
  setTourProductStartDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const datePicker = useRef<HTMLIonDatetimeElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  React.useEffect(() => {
    if (
      history.location.pathname === "/tourBookingRegular" &&
      !TourPaymentAllowStatus
    ) {
      window.location.replace("/main/transactionList");
    }
  }, [history.location.pathname]);
  const packageSubmit = (index: number) => {
    setShowLoading(true);
    const id =
      TourProductDetail.TourProductPricingList[Number(index)]
        .TourProductPricingId;
    setTourProductPricingId(id);
    var MyData = new FormData();
    MyData.append("packageid", id);
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "tour/TourDetail", MyData, { appid: AppId })
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Periksa Koneksi Internet");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200 && res.Data.Allowed === true) {
            setShowLoading(false);
            setTourProductStartDate(selectedDate);
            setTourProductPricingIndex(index);
            setTourProductPricingId(id);
            loadTourProductData();
            history.push("/tourBookingRegularSelectPax");
          } else {
            failedAlert(res.ErrorMessage);
            history.push("/tourSearch");
          }
        })
        .catch((error) => {
          failedAlert("Koneksi Anda Bermasalah");
        });
    } else {
      fetch(MainUrl + "tour/TourDetail", {
        method: "POST",
        headers: { appid: AppId },
        body: MyData,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            failedAlert("Cek Koneksi Internet Anda");
          }
        })
        .then((res) => {
          if (res.StatusCode === 200 && res.Data.Allowed === true) {
            setShowLoading(false);
            setTourProductStartDate(selectedDate);
            setTourProductPricingIndex(index);
            setTourProductPricingId(id);
            loadTourProductData();
            history.push("/tourBookingRegularSelectPax");
          } else {
            failedAlert(res.ErrorMessage);
            history.push("/tourSearch");
          }
        })
        .catch((e) => {
          failedAlert("Koneksi Anda Bermasalah");
        });
    }
  };
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tourSearch"></IonBackButton>
          </IonButtons>
          <IonTitle>
            {TourProductDetail.TourProductModels.ProductTourName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="BookingRegular">
        <IonItem hidden={true}>
          <IonDatetime
            ref={datePicker}
            displayFormat="MM/DD/YYYY"
            min={new Date(
              new Date().setDate(new Date().getDate() + 7)
            ).toISOString()}
            max={new Date(
              new Date().setFullYear(new Date().getFullYear() + 10)
            ).toISOString()}
            value={selectedDate}
            onIonChange={(e) => setSelectedDate(e.detail.value!)}
          ></IonDatetime>
        </IonItem>
        <IonGrid class="white-bg tourDateChoice">
          <IonRow className="ion-padding">
            <IonCol
              size="4"
              hidden={selectedDate !== "" ? true : false}
              className="selectDate ion-text-center"
              onClick={() => datePicker.current!.open()}
            >
              <IonIcon
                color="medium"
                icon={calendarOutline}
                className="ion-margin-right"
              ></IonIcon>
              <IonText color="medium"> &nbsp;Pilih Tanggal</IonText>
            </IonCol>
            <IonCol
              size="4"
              hidden={selectedDate === "" ? true : false}
              className="selectDate ion-text-center"
              onClick={() => datePicker.current!.open()}
            >
              <IonText color="medium">Ubah Tanggal</IonText>
            </IonCol>
            <IonCol
              size="4"
              hidden={selectedDate === "" ? true : false}
              className="selectDate-active ion-text-center"
              onClick={() => datePicker.current!.open()}
            >
              <IonText color="medium">
                <p className="ion-no-margin">Tanggal Pilihan</p>
              </IonText>
              <IonText color="medium">
                <small>
                  {selectedDate !== "" ? stringDateConvert(selectedDate) : ""}
                </small>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        {TourProductDetail
          ? TourProductDetail.TourProductPricingList.map(
              (item: any, index: number) => (
                <div key={index}>
                  <span hidden={index === 0 ? false : true}>
                    Harga Terendah
                  </span>
                  <IonCard className="ion-margin tourBookingRegularPackageCard">
                    <IonCardContent>
                      <div>
                        <IonText color="dark">
                          <h5>
                            <b>
                              {item.TourProductPricingMinimal}-
                              {item.TourProductPricingMaksimal} Pax (
                              {
                                TourProductDetail.TourProductModels
                                  .ProductTourName
                              }
                              )
                            </b>
                          </h5>
                        </IonText>
                        <IonText color="medium">
                          <h6>
                            <IonIcon icon={calendarOutline}></IonIcon> Hanya
                            berlaku pada tanggal keberangkatan yang dipilih
                          </h6>
                        </IonText>
                        <IonText color="medium">
                          <h6>
                            <IonIcon icon={timerOutline}></IonIcon> Reservasi
                            diharuskan min. 7 hari sebelum hari keberangkatan
                          </h6>{" "}
                        </IonText>
                      </div>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="8">
                            <IonText>
                              <h4>{rupiah(item.TourProductPricingPrice)}</h4>
                            </IonText>
                            <IonText>
                              <h6>Harga per pax (sudah termasuk pajak)</h6>
                            </IonText>
                          </IonCol>
                          <IonCol className="ion-text-right">
                            <IonButton
                              className="text-transform-none"
                              disabled={selectedDate !== "" ? false : true}
                              onClick={() => packageSubmit(index)}
                            >
                              Pilih
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </div>
              )
            )
          : ""}
        <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
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
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    TourProductDetail: state.tour.TourProductDetail,
    TourProductPricingIndex: state.tour.TourProductPricingIndex,
    TourPaymentAllowStatus: state.tour.TourPaymentAllowStatus,
  }),
  mapDispatchToProps: {
    setTourProductPricingIndex,
    setTourProductPricingId,
    setTourProductStartDate,
    loadTourProductData,
  },
  component: React.memo(withRouter(BookingRegular)),
});
