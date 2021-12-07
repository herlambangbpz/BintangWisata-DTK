import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonBadge,
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonSlide,
  IonSlides,
  IonText,
  isPlatform,
} from "@ionic/react";
import { Modal, Tabs } from "antd";
import { informationCircle, star } from "ionicons/icons";
import Lottie from "lottie-react";
import React, { useRef, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useParams } from "react-router-dom";
import { AppId, MainUrl } from "../../AppConfig";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import { connect } from "../../data/connect";
import { setHotelOrderRoomDetail } from "../../data/hotel/hotel.actions";
import * as selectors from "../../data/selectors";
import { rupiah } from "../../helpers/currency";
import notFound from "../../Lotties/data-not-found-danger.json";
import "./Detail.scss";

const { TabPane } = Tabs;

interface OwnProps {}
interface StateProps {
  UserData?: any;
}
interface DispatchProps {
  setHotelOrderRoomDetail: typeof setHotelOrderRoomDetail;
}
interface TourDetailProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Detail: React.FC<TourDetailProps> = ({
  history,
  UserData,
  setHotelOrderRoomDetail,
}) => {
  const parameters: any = useParams();
  const [isModalHotelFacility, setIsModalHotelFacility] = useState(false);
  const [FNNPKey, setFNNPKey] = useState("facility");
  const [isModalFacility, setisModalFacility] = useState(false);
  const [isModalRoomFacility, setisModalRoomFacility] = useState(false);
  const [RoomDetail, setRoomDetail] = useState<any>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  React.useEffect(() => {
    // setHotelProductDetail(null);
    // setHotelProductDetail(HotelDetailData);
  });
  const HotelProductDetailSuccess = async (res: any) => {
    // setShowLoading(true);
    if (res.StatusCode == 200 && res.Data !== null) {
      localStorage.removeItem("HotelOrderGuest");
      localStorage.removeItem("HotelOrderOrderPerson");
      setHotelProductDetail(null);
      await setHotelProductDetail(res.Data);
    } else {
      setHotelProductDetail("Hotel Tidak Ditemukan");
      failedAlert(res.ErrorMessage);
    }
  };
  const HotelProductDetailFetch = () => {
    var MyData = JSON.stringify({
      HCode: parameters.hcode,
      ICode: parameters.icode,
      accToken: UserData.accessToken,
    });
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
      "Content-Type": "application/json",
    };
    //Cordova Only
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.setRequestTimeout(180);
      HTTP.post(MainUrl + "Hotel/HotelDetails", MyData, MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          HotelProductDetailSuccess(res);
        })
        .catch((err) => {
          if (err.status) {
            failedAlert("Session telah habis, silahkan login ulang");
            history.push("/login");
          } else {
            failedAlert("Periksa Koneksi Internet");
          }
        });
    } else {
      fetch(MainUrl + "Hotel/HotelDetails", {
        method: "POST",
        headers: MyHeaders,
        body: MyData,
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            if (r.status === 401) {
              // failedAlert("Session telah habis, silahkan login ulang");
              history.push("/login");
            } else {
              failedAlert(r.statusText);
            }
            return r.json();
          }
        })
        .then((res) => {
          HotelProductDetailSuccess(res);
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };
  React.useEffect(() => {
    HotelProductDetailFetch();
  }, []);
  const slideRef = useRef<HTMLIonSlidesElement>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [HotelProductDetail, setHotelProductDetail] = useState<any>(null);
  const handleSlideChangeStart = () => {
    slideRef.current!.getActiveIndex().then((index) => {
      setSlideIndex(index);
      localStorage.setItem("activeTourSlider", `${index}`);
    });
  };
  const HotelRoomSubmit = (RoomSelected) => {
    setHotelOrderRoomDetail({
      HotelDetail: HotelProductDetail,
      HotelRoomSelected: RoomSelected,
    });
    history.push("/hotelOrder");
  };

  const tourDetailSlides = { initialSlide: 0, speed: 400 };
  if (HotelProductDetail !== null) {
    if (HotelProductDetail !== "Hotel Tidak Ditemukan") {
      return (
        <IonPage>
          <IonHeader translucent>
            <DefaultToolbar
              title={HotelProductDetail.HotelDetail.name}
              color="primary"
              backButtonRoute="/hotelSearchResullt"
            />
          </IonHeader>
          <IonContent fullscreen={true} class="tourDetail">
            {HotelProductDetail.images ? (
              <IonSlides
                ref={slideRef}
                onIonSlideWillChange={handleSlideChangeStart}
                className="tourDetailSlides"
                options={tourDetailSlides}
              >
                {HotelProductDetail.images.map((item: any, index: number) => (
                  <IonSlide key={index}>
                    <img
                      src={"data:image/png;base64, " + item}
                      width="100%"
                      alt=""
                    />
                  </IonSlide>
                ))}
              </IonSlides>
            ) : (
              ""
            )}
            <IonGrid
              className="imageIndex"
              hidden={HotelProductDetail ? false : true}
            >
              <IonRow>
                <IonCol className="ion-text-right">
                  <IonBadge color="dark">
                    {slideIndex + 1}/
                    {HotelProductDetail
                      ? HotelProductDetail.images &&
                        HotelProductDetail.images.length
                      : 1}
                  </IonBadge>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonGrid className="white-bg ion-padding ion-margin-bottom">
              <IonRow>
                <IonCol size="12">
                  <IonText color="dark">
                    <h6>{HotelProductDetail.HotelDetail.name}</h6>
                  </IonText>
                  <div>
                    <IonIcon
                      icon={star}
                      color="warning"
                      hidden={
                        HotelProductDetail.HotelDetail.rating > 0 ? false : true
                      }
                    ></IonIcon>
                    <IonIcon
                      icon={star}
                      color="warning"
                      hidden={
                        HotelProductDetail.HotelDetail.rating > 1 ? false : true
                      }
                    ></IonIcon>
                    <IonIcon
                      icon={star}
                      color="warning"
                      hidden={
                        HotelProductDetail.HotelDetail.rating > 2 ? false : true
                      }
                    ></IonIcon>
                    <IonIcon
                      icon={star}
                      color="warning"
                      hidden={
                        HotelProductDetail.HotelDetail.rating > 3 ? false : true
                      }
                    ></IonIcon>
                    <IonIcon
                      icon={star}
                      color="warning"
                      hidden={
                        HotelProductDetail.HotelDetail.rating > 4 ? false : true
                      }
                    ></IonIcon>
                  </div>
                  <IonText color="medium">
                    {HotelProductDetail.HotelDetail.address}
                  </IonText>
                  <br />
                  <IonText color="medium">
                    Rating :{" "}
                    <b>
                      {HotelProductDetail.HotelDetail.ratingAverage}{" "}
                      {HotelProductDetail.HotelDetail.ratingAverage > 9
                        ? "Ideal"
                        : HotelProductDetail.HotelDetail.ratingAverage > 8
                        ? "Luar Biasa"
                        : HotelProductDetail.HotelDetail.ratingAverage > 7
                        ? "Sangat Baik"
                          ? HotelProductDetail.HotelDetail.ratingAverage > 6
                            ? "Bagus"
                            : "Dibawah Eksepektasi"
                          : ""
                        : ""}
                    </b>
                  </IonText>
                  {/* <IonText><b>Deskripsi</b></IonText>
                  <IonText>
                    {}
                  </IonText> */}
                </IonCol>
                <IonCol>
                  <IonText color="dark">
                    <h6>Kamar</h6>
                  </IonText>
                  {HotelProductDetail.HotelDetail.rooms.length > 0
                    ? HotelProductDetail.HotelDetail.rooms.map((item) => (
                        <IonCard className="ion-no-margin ion-margin-bottom">
                          <IonRow>
                            <IonCol size="4" className="ion-no-padding">
                              <img
                                className="ofc"
                                src={item.image || "assets/img/news/news-1.jpg"}
                                alt=""
                                width="100%"
                                height="100%"
                              />
                            </IonCol>
                            <IonCol size="8" className="ion-p-8">
                              <IonText>
                                <h6>
                                  <small>
                                    <b>{item.name || ""}</b>
                                  </small>
                                </h6>
                              </IonText>
                              <div
                                onClick={() => {
                                  setisModalFacility(true);
                                  setRoomDetail(item);
                                }}
                              >
                                <IonLabel>Breakfast</IonLabel>
                                <IonIcon
                                  icon={informationCircle}
                                  color="primary"
                                  style={{
                                    "margin-left": "5px",
                                    "margin-bottom": "-2px",
                                  }}
                                ></IonIcon>
                              </div>
                              <div
                                onClick={() => {
                                  setisModalRoomFacility(true);
                                  setRoomDetail(item);
                                }}
                              >
                                <IonLabel>Fasilitas Kamar</IonLabel>
                                <IonIcon
                                  icon={informationCircle}
                                  color="primary"
                                  style={{
                                    "margin-left": "5px",
                                    "margin-bottom": "-2px",
                                  }}
                                ></IonIcon>
                              </div>
                              <br />
                              <IonRow>
                                <IonCol>
                                  <IonText
                                    color="primary"
                                    className="ion-padding-top"
                                  >
                                    <b>{rupiah(item.price || 0)}</b>
                                  </IonText>
                                </IonCol>
                                <IonCol>
                                  <IonButton
                                    onClick={() => {
                                      HotelRoomSubmit(item);
                                    }}
                                    size="small"
                                    className="text-transform-none ion-oat-end"
                                  >
                                    <small> Pilih Kamar</small>
                                  </IonButton>
                                </IonCol>
                              </IonRow>
                            </IonCol>
                          </IonRow>
                        </IonCard>
                      ))
                    : ""}
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <h6>
                    <b>Fasilitas</b>
                  </h6>
                  <ul className="ion-padding-start">
                    {HotelProductDetail !== null &&
                    HotelProductDetail.HotelDetail &&
                    HotelProductDetail.HotelDetail.facility
                      ? HotelProductDetail.HotelDetail.facility.map((item) => (
                          <li>{item.facilityGroupName}</li>
                        ))
                      : ""}
                  </ul>
                  <IonText
                    color="primary"
                    onClick={() => {
                      setFNNPKey("facility");
                      setIsModalHotelFacility(true);
                    }}
                  >
                    Lihat Semua Fasilitas
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <h6>
                    <b>Lokasi Sekitar</b>
                  </h6>
                  <ul className="ion-padding-start">
                    {HotelProductDetail !== null &&
                    HotelProductDetail.HotelDetail &&
                    HotelProductDetail.HotelDetail.nearbyProperty
                      ? HotelProductDetail.HotelDetail.nearbyProperty.map(
                          (item) => <li>{item.propertyGroupName}</li>
                        )
                      : ""}
                  </ul>
                  <IonText
                    color="primary"
                    onClick={() => {
                      setFNNPKey("nearbyProperty");
                      setIsModalHotelFacility(true);
                    }}
                  >
                    Lihat Semua Fasilitas
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            {/* Modal Itenerary */}
            <IonModal isOpen={isModalHotelFacility} cssClass="my-custom-class">
              <IonHeader>
                <DefaultToolbar
                  title="Fasilitas & Lokasi Sekitar"
                  color="primary"
                  backButtonRoute={() => {
                    setIsModalHotelFacility(false);
                  }}
                />
              </IonHeader>
              <IonContent className="FNNPModal">
                <Tabs defaultActiveKey={FNNPKey} size="large">
                  <TabPane
                    tab="Fasilitas"
                    key="facility"
                    className="ion-padding"
                  >
                    {HotelProductDetail !== null &&
                    HotelProductDetail.HotelDetail &&
                    HotelProductDetail.HotelDetail.facility
                      ? HotelProductDetail.HotelDetail.facility.map((f) => (
                          <IonRow className="ion-margin-bottom">
                            <IonCol size="12">
                              <h6>{f.facilityGroupName}</h6>
                            </IonCol>
                            {f.facilities
                              .filter((ffilter) => ffilter !== "")
                              .map((ff) => (
                                <IonCol size="6">{ff}</IonCol>
                              ))}
                          </IonRow>
                        ))
                      : ""}
                  </TabPane>
                  <TabPane
                    tab="Lokasi Sekitar"
                    key="nearbyProperty"
                    className="ion-padding"
                  >
                    {HotelProductDetail !== null &&
                    HotelProductDetail.HotelDetail &&
                    HotelProductDetail.HotelDetail.nearbyProperty
                      ? HotelProductDetail.HotelDetail.nearbyProperty.map(
                          (p) => (
                            <IonRow className="ion-margin-bottom">
                              <IonCol size="12">
                                <h6>{p.propertyGroupName}</h6>
                              </IonCol>

                              {p.property
                                .filter((pfilter) => pfilter !== "")
                                .map((pp) => (
                                  <IonCol size="12">
                                    {(pp.groupName || "") +
                                      " " +
                                      (pp.propertyName || "") +
                                      " " +
                                      (pp.distance || "") +
                                      " " +
                                      (pp.distanceUnit || "")}
                                  </IonCol>
                                ))}
                            </IonRow>
                          )
                        )
                      : ""}
                  </TabPane>
                </Tabs>
              </IonContent>
            </IonModal>
            <Modal
              title="Fasilitas"
              visible={isModalFacility}
              footer={null}
              onCancel={() => setisModalFacility(false)}
            >
              <p>
                <b>Benefits</b>
                <br />
                {RoomDetail ? RoomDetail.breakfast : ""}
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: RoomDetail ? RoomDetail.additionalInformation : "",
                }}
              ></div>
            </Modal>
            <Modal
              title="Fasilitas Kamar"
              visible={isModalRoomFacility}
              footer={null}
              onCancel={() => setisModalRoomFacility(false)}
            >
              <IonRow>
                {RoomDetail !== null && RoomDetail.facilites
                  ? RoomDetail.facilites
                      .filter((f) => f !== "")
                      .map((item) => (
                        <IonCol size="6">
                          <IonText color="medium">
                            <small>{item}</small>
                          </IonText>
                        </IonCol>
                      ))
                  : ""}
              </IonRow>
            </Modal>
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
    } else {
      return (
        <IonPage>
          <IonContent>
            <div className="loadingData">
              <Lottie animationData={notFound} />
              <br />
              <IonText>
                <h5>Data Hotel Tidak Ditemukan</h5>
              </IonText>
              <IonButton
                size="small"
                onClick={() => {
                  history.replace("/hotelSearch");
                }}
                className="text-transform-none"
              >
                Kembali ke Pencarian
              </IonButton>
            </div>
          </IonContent>
        </IonPage>
      );
    }
  } else {
    return (
      <IonPage>
        <IonContent>
          <div className="loadingData">
            <img src="assets/icon/loading.svg" width="80px" />
            <br />
            Mengambil Data
          </div>
        </IonContent>
      </IonPage>
    );
  }
};
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {
    setHotelOrderRoomDetail,
  },
  component: React.memo(withRouter(Detail)),
});
