import React, { useState, useRef } from "react";
import {
  IonContent,
  IonIcon,
  IonText,
  IonBadge,
  IonSlides,
  IonSlide,
  IonModal,
  IonPage,
  IonHeader,
  IonCard,
  IonCol,
  IonButton,
  IonRow,
  IonGrid,
  IonFooter,
  isPlatform,
} from "@ionic/react";
import {
  shareOutline,
  star,
  locationSharp,
  timeOutline,
  person,
  globeOutline,
} from "ionicons/icons";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import { RouteComponentProps, withRouter } from "react-router";
import { rupiah } from "../../helpers/currency";
import { useParams } from "react-router-dom";
import { connect } from "../../data/connect";
import "./Detail.scss";
import { AppId, ImageBasePath, MainUrl } from "../../AppConfig";
import { HTTP } from "@ionic-native/http";
import {
  setTourProductDetail,
  setTourProductPricingIndex,
} from "../../data/tour/tour.actions";
interface OwnProps {}
interface StateProps {
  TourProductDetail?: any;
}
interface DispatchProps {
  setTourProductDetail: typeof setTourProductDetail;
  setTourProductPricingIndex: typeof setTourProductPricingIndex;
}
interface TourDetailProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Detail: React.FC<TourDetailProps> = ({
  history,
  setTourProductDetail,
  TourProductDetail,
  setTourProductPricingIndex,
}) => {
  const parameters: any = useParams();
  React.useEffect(() => {
    setTourProductDetail(null);

    const myHeaders = new Headers();
    myHeaders.append("AppId", AppId);
    //Cordova Only
    if (isPlatform("cordova")) {
      // HTTP.setDataSerializer('multipart');
      HTTP.get(
        MainUrl + "tour/TourDetail",
        { title: parameters.title, code: parameters.code },
        { appid: AppId }
      )
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          tourDetailSuccess(res);
        })
        .catch((error) => {
          alert("Produk tidak ditemukan");
          history.push("/tour");
        });
    }
    //PWA
    else {
      fetch(
        MainUrl +
          "tour/TourDetail?title=" +
          parameters.title +
          "&code=" +
          parameters.code,
        { method: "GET", headers: myHeaders }
      )
        // Check Connection
        .then((res) => {
          if (!res.ok) {
            alert("Periksa Koneksi anda");
            history.push("/tour");
          }
          return res.json();
        })
        .then((res) => {
          tourDetailSuccess(res);
        })
        .catch((e) => {
          alert("Produk tidak ditemukan");
          history.push("/tour");
        });
    }
    if (TourProductDetail) {
      // After Tour Detail Mounted
      if (TourProductDetail.TourProductModels.TourProductImageList !== null) {
        const activeTourSlider: any = localStorage.getItem("activeTourSlider")
          ? localStorage.getItem("activeTourSlider")
          : "0";
        slideRef.current!.slideTo(parseInt(activeTourSlider));
      }
    }

    //Before Tour Detail Unmounted
    return () => {
      localStorage.removeItem("activeTourSlider");
    };
  }, []);
  const tourDetailSuccess = (data: any) => {
    setTourProductDetail(data.Data);
    setTourProductPricingIndex(0);
    localStorage.removeItem("TourOrderPaxData");
    localStorage.removeItem("TourOrderOrderPerson");
    localStorage.removeItem("TourOrderPaxFullData");
    localStorage.removeItem("TourOrderAddOnNumber");
    localStorage.removeItem("TourOrderAddOnPayNumber");
    localStorage.removeItem("TourOrderSpecialRequest");
  };
  const slideRef = useRef<HTMLIonSlidesElement>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  // Modal
  const [showModalItenerary, setShowModalItenerary] = useState(false);
  const [showModalPriceInclude, setShowModalPriceInclude] = useState(false);
  const [showModalPriceExclude, setShowModalPriceExclude] = useState(false);
  const [showModalSyaratKetentuan, setShowModalSyaratKetentuan] =
    useState(false);

  const handleSlideChangeStart = () => {
    slideRef.current!.getActiveIndex().then((index) => {
      setSlideIndex(index);
      localStorage.setItem("activeTourSlider", `${index}`);
    });
  };
  const showLightBox = () => {
    history.push("/tourLightBox");
  };
  const tourDetailSlides = { initialSlide: 0, speed: 400 };
  if (TourProductDetail) {
    if (
      TourProductDetail.TourProductModels.TourProductCode === parameters.code
    ) {
      return (
        <IonPage>
          <IonHeader translucent>
            <DefaultToolbar
              // title={TourProductDetail!==null?TourProductDetail.ProductTourName:''} color="primary" backButtonRoute="/tourSearch"
              title={TourProductDetail.TourProductModels.ProductTourName}
              color="primary"
              backButtonRoute="/tourSearch"
            />
          </IonHeader>
          <IonContent fullscreen={true} class="tourDetail">
            {TourProductDetail.TourProductImageList ? (
              <IonSlides
                ref={slideRef}
                onIonSlideWillChange={handleSlideChangeStart}
                className="tourDetailSlides"
                options={tourDetailSlides}
              >
                {TourProductDetail.TourProductImageList.map(
                  (item: any, index: number) => (
                    <IonSlide onClick={showLightBox} key={index}>
                      <img
                        src={ImageBasePath + item.TPImageImagePath}
                        width="100%"
                        alt=""
                      />
                    </IonSlide>
                  )
                )}
              </IonSlides>
            ) : (
              ""
            )}
            <IonGrid
              className="imageIndex"
              hidden={TourProductDetail ? false : true}
            >
              <IonRow>
                <IonCol className="ion-text-right">
                  <IonBadge color="dark">
                    {slideIndex + 1}/
                    {TourProductDetail
                      ? TourProductDetail.TourProductImageList.length
                      : 1}
                  </IonBadge>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonGrid className="white-bg ion-padding ion-margin-bottom">
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <p className="ion-no-margin">
                      {TourProductDetail.TourProductModels.ProductTourName}
                    </p>
                  </IonText>
                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={true}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={true}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={true}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={true}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="medium"
                    className="iconStar"
                    hidden={true}
                  ></IonIcon>
                </IonCol>
                <IonCol size="2" className="ion-text-right">
                  <IonIcon
                    icon={shareOutline}
                    color="medium"
                    className="iconShare"
                  ></IonIcon>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonIcon
                  icon={locationSharp}
                  color="medium"
                  className="iconSpecification"
                ></IonIcon>
                <IonText color="medium">
                  {TourProductDetail.TourProductModels.ProductTourCountry}
                </IonText>
              </IonRow>
              <IonRow>
                <IonIcon
                  icon={timeOutline}
                  color="medium"
                  className="iconSpecification"
                ></IonIcon>
                <IonText color="medium">
                  {TourProductDetail.TourProductModels.ProductTourDuration}
                </IonText>
              </IonRow>
              <IonRow hidden={true}>
                <IonIcon
                  icon={person}
                  color="medium"
                  className="iconSpecification"
                ></IonIcon>
                <IonText color="medium">Minimum 1 Pax</IonText>
              </IonRow>
              <IonRow>
                <IonIcon
                  icon={globeOutline}
                  color="medium"
                  className="iconSpecification"
                ></IonIcon>
                <IonText color="medium">
                  Pemandu :{" "}
                  {
                    TourProductDetail.TourProductModels
                      .ProductTourTourGuideLanguage
                  }
                </IonText>
              </IonRow>
              <IonRow>
                {TourProductDetail.TourProductModels.ProductTourActivity.split(
                  ", "
                ).map((activity: any, index: number) => (
                  <a className="tourSearchTag" key={index}>
                    {activity}
                  </a>
                ))}
              </IonRow>
            </IonGrid>
            <IonGrid className="white-bg ion-padding ion-margin-bottom">
              <IonText>
                <h5 className="ion-no-margin ion-margin-bottom">
                  Info Singkat
                </h5>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      TourProductDetail.TourProductModels
                        .ProductTourDescription,
                  }}
                ></div>
              </IonText>
            </IonGrid>
            <IonGrid className="white-bg ion-padding ion-margin-bottom tourInfo">
              <IonText>
                <h5 className="ion-no-margin">Info Penting</h5>
              </IonText>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <b>Rencana Perjalanan</b>
                  </IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText
                    color="primary"
                    onClick={() => setShowModalItenerary(true)}
                  >
                    Detail
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <b>Harga Termasuk</b>
                  </IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText
                    color="primary"
                    onClick={() => setShowModalPriceInclude(true)}
                  >
                    Detail
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <b>Harga Tidak Termasuk</b>
                  </IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText
                    color="primary"
                    onClick={() => setShowModalPriceExclude(true)}
                  >
                    Detail
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <b>Syarat Ketentuan</b>
                  </IonText>
                </IonCol>
                <IonCol size="2">
                  <IonText
                    color="primary"
                    onClick={() => setShowModalSyaratKetentuan(true)}
                  >
                    Detail
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Modal Itenerary */}
            <IonModal isOpen={showModalItenerary} cssClass="my-custom-class">
              <IonHeader>
                <DefaultToolbar
                  title="Rencana Perjalanan"
                  color="primary"
                  backButtonRoute={() => {
                    setShowModalItenerary(false);
                  }}
                />
              </IonHeader>
              <IonContent className="modalItenerary">
                {TourProductDetail.TourProductItineraryList
                  ? TourProductDetail.TourProductItineraryList.map(
                      (item: any, index: number) => (
                        <IonGrid
                          key={index}
                          className="ion-padding-start white-bg ion-padding-bottom ion-margin-bottom"
                        >
                          <IonRow>
                            <IonCol key={index}>
                              <IonText>
                                <h3>
                                  Hari ke-{item.TourProductItineraryDay + 1}
                                </h3>
                              </IonText>
                              <IonText>
                                <h6>
                                  <b>Hotel</b>
                                </h6>
                              </IonText>
                              <IonText>
                                {item.TourProductItineraryHotel !== null
                                  ? item.TourProductItineraryHotel
                                  : "-"}
                              </IonText>
                              <IonText>
                                <h6>
                                  <b>Fasilitas</b>
                                </h6>
                              </IonText>
                              <IonText>
                                {item.TourProductItineraryBreakfast === true
                                  ? "Breakfast,"
                                  : ""}
                                {item.TourProductItineraryLunch === true
                                  ? "Lunch,"
                                  : ""}
                                {item.TourProductItineraryDinner === true
                                  ? "Dinner"
                                  : ""}
                                {item.TourProductItineraryBreakfast === false &&
                                item.TourProductItineraryLunch === false &&
                                item.TourProductItineraryDinner === false
                                  ? "-"
                                  : ""}
                              </IonText>
                              <IonText>
                                <h6>
                                  <b>Informasi</b>
                                </h6>
                              </IonText>
                              {item.TourProductItineraryInformasi === null
                                ? "-"
                                : ""}

                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item.TourProductItineraryInformasi,
                                }}
                              ></div>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      )
                    )
                  : ""}
              </IonContent>
            </IonModal>
            <IonModal isOpen={showModalPriceInclude} cssClass="my-custom-class">
              <IonHeader>
                <DefaultToolbar
                  title="Harga Termasuk"
                  color="primary"
                  backButtonRoute={() => {
                    setShowModalPriceInclude(false);
                  }}
                />
              </IonHeader>
              <IonContent className="modalPriceInclude ion-padding">
                {/* <ul className="ion-color-medium">
                </ul> */}
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      TourProductDetail.TourProductModels
                        .ProductTourHargaInclude,
                  }}
                ></div>
              </IonContent>
            </IonModal>
            <IonModal isOpen={showModalPriceExclude} cssClass="my-custom-class">
              <IonHeader>
                <DefaultToolbar
                  title="Harga Tidak Termasuk"
                  color="primary"
                  backButtonRoute={() => {
                    setShowModalPriceExclude(false);
                  }}
                />
              </IonHeader>
              <IonContent className="modalPriceExclude ion-padding">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      TourProductDetail.TourProductModels
                        .ProductTourHargaExclude,
                  }}
                ></div>
              </IonContent>
            </IonModal>

            <IonModal
              isOpen={showModalSyaratKetentuan}
              cssClass="my-custom-class"
            >
              <IonHeader>
                <DefaultToolbar
                  title="Syarat Ketentuan"
                  color="primary"
                  backButtonRoute={() => {
                    setShowModalSyaratKetentuan(false);
                  }}
                />
              </IonHeader>
              <IonContent className="modalSyaratKetentuan ion-padding">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      TourProductDetail.TourProductModels.ProductTourPolicy,
                  }}
                ></div>
              </IonContent>
            </IonModal>
          </IonContent>
          <IonFooter>
            <IonCard className="ion-no-margin ion-no-padding footerPrice">
              <IonGrid>
                <IonRow>
                  <IonCol size="7">
                    <IonText color="medium">
                      <small>Mulai dari</small>
                    </IonText>
                    <IonText>
                      <h4 className="ion-no-margin">
                        {rupiah(
                          TourProductDetail.TourProductModels.Priceheader
                        )}
                      </h4>
                    </IonText>
                  </IonCol>
                  <IonCol size="5">
                    <IonButton
                      expand="block"
                      className="text-transform-none"
                      routerLink={
                        TourProductDetail !== null
                          ? TourProductDetail.TourProductModels
                              .ProductTourCategory == "Series"
                            ? "/tourBookingSeries"
                            : "/tourBookingRegular"
                          : ""
                      }
                    >
                      Beli Sekarang
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          </IonFooter>
        </IonPage>
      );
    } else {
      return (
        <div className="loadingData">
          <img src="assets/icon/loading.svg" width="80px" />
          <br />
          Mengambil Data
        </div>
      );
    }
  } else {
    return (
      <div className="loadingData">
        <img src="assets/icon/loading.svg" width="80px" />
        <br />
        Mengambil Data
      </div>
    );
  }
};
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    TourProductDetail: state.tour.TourProductDetail,
  }),
  mapDispatchToProps: {
    setTourProductDetail,
    setTourProductPricingIndex,
  },
  component: React.memo(withRouter(Detail)),
});
