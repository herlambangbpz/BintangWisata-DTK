import React, { useState } from "react";
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
  IonLoading,
  IonAlert,
  isPlatform,
} from "@ionic/react";
import { calendarOutline, push, settings, timerOutline } from "ionicons/icons";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import { rupiah } from "../../helpers/currency";
import { cSharpDateCovert } from "../../helpers/datetime";
import "./BookingSeries.scss";
import { AppId, MainUrl } from "../../AppConfig";
import {
  setTourProductPricingId,
  setTourProductPricingIndex,
  setTourProductStartDate,
} from "../../data/tour/tour.actions";
import { HTTP } from "@ionic-native/http";
interface OwnProps {}
interface StateProps {
  TourProductDetail?: any;
  TourProductPricingIndex?: number;
}
interface DispatchProps {
  setTourProductPricingIndex: typeof setTourProductPricingIndex;
  setTourProductPricingId: typeof setTourProductPricingId;
  setTourProductStartDate: typeof setTourProductStartDate;
}
interface BookingSeriesProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
interface BookingSeriesProps extends RouteComponentProps {}
const BookingSeries: React.FC<BookingSeriesProps> = ({
  history,
  TourProductDetail,
  setTourProductPricingId,
  setTourProductPricingIndex,
  TourProductPricingIndex,
  setTourProductStartDate,
}) => {
  // const [SelectedTourProductDetail,setSelectedTourProductDetail] = useState<any>(null);
  const [HiddenCard, setHiddenCard] = useState(false);
  const [ProductTourPrice, setProductTourPrice] = useState(0);

  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  React.useEffect(() => {
    if (TourProductDetail) {
      handleDateChange(TourProductPricingIndex ? TourProductPricingIndex : 0);
      setHiddenCard(false);
    } else {
      setHiddenCard(true);
    }
  }, []);
  React.useEffect(() => {
    if (TourProductDetail) {
      handleDateChange(TourProductPricingIndex ? TourProductPricingIndex : 0);
      setHiddenCard(false);
    } else {
      setHiddenCard(true);
    }
  }, [TourProductDetail]);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const handleDateChange = (index: number) => {
    setDisableButton(false);

    setProductTourPrice(
      TourProductDetail.TourProductPricingList[index].TourProductPricingPrice
    );
    setTourProductStartDate(
      cSharpDateCovert(
        TourProductDetail.TourProductPricingList[index]
          .TourProductPricingTanggal
      )
    );
    setTourProductPricingIndex(index);
  };
  const packageSubmit = () => {
    setShowLoading(true);
    const id =
      TourProductDetail.TourProductPricingList[Number(TourProductPricingIndex)]
        .TourProductPricingId;
    setTourProductPricingId(id);
    var MyData = new FormData();
    MyData.append("packageid", id);
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "tour/TourDetail", MyData, { appid: AppId })
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Cek Koneksi Internet Anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200 && res.Data.Allowed === true) {
            setShowLoading(false);
            history.push("/tourBookingSeriesSelectPax");
          } else {
            failedAlert(res.ErrorMessage);
            history.push("/tourSearch");
          }
        })
        .catch((e) => {
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
            history.push("/tourBookingSeriesSelectPax");
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
  const successAlert = (successMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Sukses");
    setMessageAlert(successMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tour/search"></IonBackButton>
          </IonButtons>
          <IonTitle>
            {TourProductDetail.TourProductModels.ProductTourName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="BookingSeries">
        <IonGrid class="white-bg tourDateChoice">
          <IonRow>
            <IonCol>
              {TourProductDetail ? (
                <IonSlides
                  options={{
                    freeMode: true,
                    slidesPerView: 3.5,
                    spaceBetween: 5,
                  }}
                >
                  {TourProductDetail.TourProductPricingList.map(
                    (item: any, index: number) => (
                      <IonSlide
                        onClick={() => handleDateChange(index)}
                        className={
                          TourProductPricingIndex === index
                            ? "selectDate-active"
                            : ""
                        }
                        key={index}
                      >
                        <div>
                          <IonText color="dark">
                            <p className="ion-no-margin">Tanggal Tersedia</p>
                          </IonText>
                          <IonText color="medium">
                            <small>
                              {cSharpDateCovert(item.TourProductPricingTanggal)}
                            </small>
                          </IonText>
                        </div>
                      </IonSlide>
                    )
                  )}
                </IonSlides>
              ) : (
                ""
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonCard
          className="ion-margin tourBookingSeriesPackageCard"
          hidden={HiddenCard}
        >
          <IonCardContent>
            <div>
              <IonText color="dark">
                <h5>
                  <b>
                    1 Pax ({TourProductDetail.TourProductModels.ProductTourName}
                    )
                  </b>
                </h5>
              </IonText>
              <IonText color="medium">
                <h6>
                  <IonIcon icon={calendarOutline}></IonIcon> Hanya berlaku pada
                  tanggal keberangkatan yang dipilih
                </h6>
              </IonText>
              <IonText color="medium">
                <h6>
                  <IonIcon icon={timerOutline}></IonIcon> Reservasi diharuskan
                  min. 7 hari sebelum hari keberangkatan
                </h6>{" "}
              </IonText>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol size="8">
                  <IonText>
                    <h4>{rupiah(ProductTourPrice)}</h4>
                  </IonText>
                  <IonText>
                    <h6>Harga per pax (sudah termasuk pajak)</h6>
                  </IonText>
                </IonCol>
                <IonCol className="ion-text-right">
                  <IonButton disabled={disableButton} onClick={packageSubmit}>
                    Pilih
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
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
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    TourProductDetail: state.tour.TourProductDetail,
    TourProductPricingIndex: state.tour.TourProductPricingIndex,
  }),
  mapDispatchToProps: {
    setTourProductPricingIndex,
    setTourProductPricingId,
    setTourProductStartDate,
  },
  component: React.memo(withRouter(BookingSeries)),
});
