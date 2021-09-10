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
  IonLabel,
  IonButton,
  IonRow,
  IonGrid,
  IonFooter,
  isPlatform,
  IonItem,
  IonSelect,
  IonSelectOption,
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
import { Select } from "antd";
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
        MainUrl + "ecommerce/ProductDetail",
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
      fetch(MainUrl + "ecommerce/ProductDetail?code=" + parameters.code, {
        method: "GET",
        headers: myHeaders,
      })
        // Check Connection
        .then((res) => {
          if (!res.ok) {
            alert("Periksa Koneksi anda");
            history.push("/tour");
          }
          return res.json();
        })
        .then((res) => {
          // console.log(res);

          tourDetailSuccess(res);
        })
        .catch((e) => {
          alert("Produk tidak ditemukan");
          history.push("/tour");
        });
    }

    if (TourProductDetail) {
      // After Tour Detail Mounted
      if (TourProductDetail.ImageList !== null) {
        const activeTourSlider: any = localStorage.getItem("activeTourSlider")
          ? localStorage.getItem("activeTourSlider")
          : "0";
        // console.log(activeTourSlider);

        // slideRef.current!.slideTo(parseInt(activeTourSlider));
      }
    }

    //Before Tour Detail Unmounted
    return () => {
      localStorage.removeItem("activeTourSlider");
    };
  }, []);
  const tourDetailSuccess = (data: any) => {
    setTourProductDetail(data.Data.productDetailViewModels.ProductDetail);
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
  const [varianDetail, setVarianDetail] = useState<string>();

  const { Option } = Select;

  // Modal
  const [showModalItenerary, setShowModalItenerary] = useState(false);
  const [showModalPriceInclude, setShowModalPriceInclude] = useState(false);
  const [showModalPriceExclude, setShowModalPriceExclude] = useState(false);
  const [showModalSyaratKetentuan, setShowModalSyaratKetentuan] =
    useState(false);

  const handleSlideChangeStart = () => {
    console.log("changed");

    slideRef.current!.getActiveIndex().then((index) => {
      setSlideIndex(index);
      // console.log(index);

      localStorage.setItem("activeTourSlider", `${index}`);
    });
  };
  const showLightBox = () => {
    history.push("/tourLightBox");
  };

  console.log(varianDetail);
  console.log(TourProductDetail);

  const tourDetailSlides = { initialSlide: 0, speed: 400 };
  if (TourProductDetail) {
    if (TourProductDetail.ProductName != null) {
      return (
        <IonPage>
          <IonHeader translucent>
            <DefaultToolbar
              // title={TourProductDetail!==null?TourProductDetail.ProductTourName:''} color="primary" backButtonRoute="/tourSearch"

              title={TourProductDetail.ProductName}
              color="primary"
              backButtonRoute="/tourSearch"
            />
          </IonHeader>
          <IonContent fullscreen={true} class="tourDetail">
            {TourProductDetail.ImageList ? (
              <IonSlides
                ref={slideRef}
                onIonSlideWillChange={handleSlideChangeStart}
                className="tourDetailSlides"
                options={tourDetailSlides}
              >
                {TourProductDetail.ImageList.map((item: any, index: number) => (
                  <IonSlide onClick={showLightBox} key={index}>
                    <img
                      src={ImageBasePath + item.ImageProductPath}
                      width="100%"
                      height="100%"
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
              hidden={TourProductDetail ? false : true}
            >
              <IonRow>
                <IonCol className="ion-text-right">
                  <IonBadge color="dark">
                    {slideIndex + 1}/
                    {TourProductDetail ? TourProductDetail.ImageList.length : 1}
                  </IonBadge>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonGrid className="white-bg ion-padding ion-margin-bottom ">
              <IonRow className="lineBolder">
                <IonCol size="10">
                  <IonText color="dark">
                    {varianDetail == undefined ? (
                      <p className="ion-no-margin">
                        {TourProductDetail.ProductName}
                      </p>
                    ) : (
                      <p className="ion-no-margin">
                        {
                          TourProductDetail.VariantList[0].VariantDetailList[
                            varianDetail
                          ].stockAvailable.ProductName
                        }
                        +
                        {
                          TourProductDetail.VariantList[0].VariantDetailList[
                            varianDetail
                          ].stockAvailable.ProductVarianName
                        }
                      </p>
                    )}
                  </IonText>
                  <IonText color="dark">
                    <text className="ion-no-margin">4.8</text>
                  </IonText>

                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={false}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={false}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={false}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="warning"
                    className="iconStar"
                    hidden={false}
                  ></IonIcon>
                  <IonIcon
                    icon={star}
                    color="medium"
                    className="iconStar"
                    hidden={false}
                  ></IonIcon>
                  <IonText color="dark">
                    <text className="ion-no-margin">
                      (36)- Terjual 77 Produk - 344x Dilihat
                    </text>
                  </IonText>
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
                {/* <IonIcon icon={locationSharp} color="medium" className="iconSpecification"></IonIcon> */}
                <IonCol size="2">
                  <IonLabel color="dark">
                    <text className="ion-no-margin">Varian</text>
                  </IonLabel>
                </IonCol>
                <IonCol size="4">
                  <Select
                    defaultValue={
                      TourProductDetail.VariantList[0].VariantDetailList[0]
                        .VariantDetailName
                    }
                    style={{ width: 200 }}
                    onChange={(e) => setVarianDetail(e)}
                  >
                    {/* <IonSelect className="lineBolderTab" placeholder={TourProductDetail.VariantList[0].VariantDetailList[0].VariantDetailName} value={TourProductDetail.VariantList[0].VariantDetailList[0].VariantDetailName} onIonChange={e => setGender(e.detail.value)}> */}
                    {TourProductDetail.VariantList[0].VariantDetailList.map(
                      (item: any, index: number) => (
                        // <IonSlide onClick={showLightBox} key={index}>
                        //   <img src={ImageBasePath+item.ImageProductPath} width="100%" height="100%" alt=""/>
                        // </IonSlide>
                        <Option value={index}>{item.VariantDetailName}</Option>
                        // <IonSelectOption value={index}>{item.VariantDetailName}</IonSelectOption>
                      )
                    )}
                    {/* <IonSelectOption value="female">Female</IonSelectOption>
                      <IonSelectOption value="male1">Male1</IonSelectOption>
                      <IonSelectOption value="female2">Female2</IonSelectOption> */}
                  </Select>
                </IonCol>
                <IonCol size="4"></IonCol>
                {/* <IonText color="medium">{TourProductDetail.TourProductModels.ProductTourCountry}</IonText> */}
              </IonRow>
              <IonRow>
                {/* <IonIcon icon={locationSharp} color="medium" className="iconSpecification"></IonIcon> */}
                <IonCol size="2">
                  <IonLabel color="dark">
                    <text className="ion-no-margin">Jumlah</text>
                  </IonLabel>
                </IonCol>
                <IonCol size="5">
                  <IonItem className="elementID">
                    <IonButton color="primary">+</IonButton>
                    <IonLabel className="text">1</IonLabel>
                    <IonButton color="primary">-</IonButton>
                  </IonItem>
                </IonCol>
                <IonCol size="5">
                  {varianDetail == undefined ? (
                    <IonLabel>
                      {" "}
                      {
                        TourProductDetail.VariantList[0].VariantDetailList[0]
                          .stockAvailable.Amount
                      }{" "}
                      barang tersisa Minimal pembelian{" "}
                      {
                        TourProductDetail.VariantList[0].VariantDetailList[0]
                          .stockAvailable.MinimumOrder
                      }{" "}
                      barang{" "}
                    </IonLabel>
                  ) : (
                    <IonLabel>
                      {" "}
                      {
                        TourProductDetail.VariantList[0].VariantDetailList[
                          varianDetail
                        ].stockAvailable.Amount
                      }{" "}
                      barang tersisa Minimal pembelian{" "}
                      {
                        TourProductDetail.VariantList[0].VariantDetailList[
                          varianDetail
                        ].stockAvailable.MinimumOrder
                      }{" "}
                      barang{" "}
                    </IonLabel>
                  )}
                </IonCol>
                {/* <IonText color="medium">{TourProductDetail.TourProductModels.ProductTourCountry}</IonText> */}
              </IonRow>
              {/* <IonRow> */}
              {/* <IonIcon icon={timeOutline} color="medium" className="iconSpecification"></IonIcon> */}
              {/* <IonText color="medium">{TourProductDetail.TourProductModels.ProductTourDuration}</IonText> */}
              {/* </IonRow> */}
              {/* <IonRow hidden={true}> */}
              {/* <IonIcon icon={person} color="medium" className="iconSpecification"></IonIcon> */}
              {/* <IonText color="medium">Minimum 1 Pax</IonText> */}
              {/* </IonRow> */}
              {/* <IonRow> */}
              {/* <IonIcon icon={globeOutline} color="medium" className="iconSpecification"></IonIcon> */}
              {/* <IonText color="medium">Pemandu : {TourProductDetail.TourProductModels.ProductTourTourGuideLanguage}</IonText> */}
              {/* </IonRow> */}
              {/* <IonRow> */}
              {/* {
                TourProductDetail.TourProductModels.ProductTourActivity.split(", ").map((activity:any,index:number) => (
                  <a className="tourSearchTag" key={index}>{activity}</a>
                  ))} */}
              {/* </IonRow> */}
            </IonGrid>
            <IonGrid className="white-bg ion-padding ion-margin-bottom">
              <IonRow className="lineBolder">
                {/* <IonIcon icon={locationSharp} color="medium" className="iconSpecification"></IonIcon> */}
                <IonCol size="4">
                  <IonLabel color="dark">
                    <p className="ion-no-margin">Merek</p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">Asal Produk</p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">kondisi barang</p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">Product Keyword</p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">Garansi</p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">Berat</p>
                  </IonLabel>
                </IonCol>
                <IonCol size="6">
                  <IonLabel color="dark">
                    <p className="ion-no-margin">
                      {TourProductDetail.ProductBrand}
                    </p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">
                      {TourProductDetail.ProductSource}
                    </p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">
                      {TourProductDetail.ProductCondition}
                    </p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">
                      {TourProductDetail.ProductKeyword}
                    </p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">Iya</p>
                  </IonLabel>
                  <IonLabel color="dark">
                    <p className="ion-no-margin">
                      {TourProductDetail.ProductWeight}{" "}
                      {TourProductDetail.ProductUnitWeight}
                    </p>
                  </IonLabel>
                </IonCol>
                <IonCol size="2"></IonCol>
                {/* <IonText color="medium">{TourProductDetail.TourProductModels.ProductTourCountry}</IonText> */}
              </IonRow>
              {/* <IonText>
                <h5 className="ion-no-margin ion-margin-bottom">Info Produk</h5>
                <div dangerouslySetInnerHTML={{__html:TourProductDetail.ProductDescription}}></div>

              </IonText> */}
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
                {/* <div dangerouslySetInnerHTML={{__html:TourProductDetail.TourProductModels.ProductTourHargaInclude}}></div> */}
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
                {/* <div dangerouslySetInnerHTML={{__html:TourProductDetail.TourProductModels.ProductTourHargaExclude}}></div> */}
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
                {/* <div dangerouslySetInnerHTML={{__html:TourProductDetail.TourProductModels.ProductTourPolicy}}></div> */}
              </IonContent>
            </IonModal>
          </IonContent>
          <IonFooter>
            <IonCard className="ion-no-margin ion-no-padding footerPrice">
              <IonGrid>
                <IonRow>
                  <IonCol size="7">
                    <IonText color="medium">
                      <small>Harga Barang</small>
                    </IonText>

                    {varianDetail == undefined ? (
                      <IonText>
                        <h4 className="ion-no-margin">
                          {rupiah(
                            TourProductDetail.VariantList[0]
                              .VariantDetailList[0].VariantDetailSellPrice
                          )}
                        </h4>
                      </IonText>
                    ) : (
                      <IonText>
                        <h4 className="ion-no-margin">
                          {rupiah(
                            TourProductDetail.VariantList[0].VariantDetailList[
                              varianDetail
                            ].VariantDetailSellPrice
                          )}
                        </h4>
                      </IonText>
                      // <IonLabel> {TourProductDetail.VariantList[0].VariantDetailList[varianDetail].stockAvailable.Amount} barang tersisa Minimal pembelian {TourProductDetail.VariantList[0].VariantDetailList[varianDetail].stockAvailable.MinimumOrder}  barang </IonLabel>
                    )}
                  </IonCol>
                  {/* <IonCol size="5">
                    <IonButton expand="block" className="text-transform-none"
                    routerLink={TourProductDetail!==null?
                    TourProductDetail.TourProductModels.ProductTourCategory=='Series'?
                    '/tourBookingSeries':'/tourBookingRegular':''}
                    >
                    Beli Sekarang
                    </IonButton>
                  </IonCol> */}
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
