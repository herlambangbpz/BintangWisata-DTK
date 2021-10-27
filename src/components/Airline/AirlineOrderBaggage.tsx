import React, { useEffect, useState } from "react";
import AirlineOrderBaggageItem from "./AirlineOrderBaggageItem";

import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonText,
  IonModal,
  IonContent,
  IonRippleEffect,
  IonIcon,
  IonButton,
  IonFooter,
  IonSlides,
  IonSlide,
  IonLoading,
  IonAlert,
  isPlatform,
  useIonViewWillEnter,
  useIonViewDidEnter,
} from "@ionic/react";
import DefaultToolbar from "../shared/DefaultToolbar";
import {
  add,
  briefcase,
  chevronDown,
  chevronForward,
  chevronUp,
} from "ionicons/icons";
import { rupiah } from "../../helpers/currency";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  loadAirlineBookingDataBundleData,
  loadAirlineOrderPassengersData,
} from "../../data/airline/airline.actions";
import { connect } from "../../data/connect";
import { AppId, MainUrl } from "../../AppConfig";
import * as selectors from "../../data/selectors";
import Lottie from "lottie-react";
import loadingLottie from "../../Lotties/loading_4463.json";
import { HTTP } from "@ionic-native/http";
interface OwnProps {
  AOPB?: any;
  calculateBaggageAirlineTotal?: any;
}
interface StateProps {
  ABDB?: any;
  AOPD?: any;
  UserData?: any;
}

interface DispatchProps {
  loadAirlineBookingDataBundleData: typeof loadAirlineBookingDataBundleData;
  loadAirlineOrderPassengersData: typeof loadAirlineOrderPassengersData;
}
interface AirlineOrderBaggageProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineOrderBaggage: React.FC<AirlineOrderBaggageProps> = ({
  ABDB,
  loadAirlineBookingDataBundleData,
  loadAirlineOrderPassengersData,
  calculateBaggageAirlineTotal,
  AOPD,
  AOPB,
  history,
  UserData,
}) => {
  const [ModalBaggage, setModalBaggage] = useState(false);
  const [BaggageData, setBaggageData] = useState<any>(null);
  const [BaggagePriceTotalDeparture, setBaggagePriceTotalDeparture] =
    useState<any>(0);
  const [BaggagePriceTotalArrival, setBaggagePriceTotalArrival] =
    useState<any>(0);
  const [BaggagePriceGrandTotal, setBaggagePriceGrandTotal] = useState<any>(0);
  const [ModalAddOns, setModalAddOns] = useState(false);
  const [hiddenDetailPriceChevronUp, setHiddenDetailPriceChevronUp] =
    useState(false);
  const [hiddenDetailPriceChevronDown, setHiddenDetailPriceChevronDown] =
    useState(true);
  const [hiddenDetailPrice, setHiddenDetailPrice] = useState(true);
  const [bi, setbi] = useState<any>([]);

  const seeDetailPrice = () => {
    setHiddenDetailPrice(false);
    setHiddenDetailPriceChevronUp(true);
    setHiddenDetailPriceChevronDown(false);
  };
  const hideDetailPrice = () => {
    setHiddenDetailPrice(true);
    setHiddenDetailPriceChevronUp(false);
    setHiddenDetailPriceChevronDown(true);
  };
  const calculateBaggage = () => {
    const AOBS = JSON.parse(localStorage.AirlineOrderBaggageSelected);
    setBaggagePriceTotalDeparture(0);
    setBaggagePriceTotalArrival(0);
    let D = 0;
    let A = 0;
    if (AOBS) {
      AOBS[0].forEach((b) => {
        if (b) {
          D = D + b.fare;
        }
      });
      if (AOBS.length > 1) {
        AOBS[1].forEach((b) => {
          if (b) {
            A = A + b.fare;
          }
        });
      }
      setBaggagePriceTotalDeparture(D);
      setBaggagePriceTotalArrival(A);
      setBaggagePriceGrandTotal(D + A);
      calculateBaggageAirlineTotal(D + A);
    }
  };
  // const [AddOnNumber, setAddOnNumber] = useState<any>(null);
  // const [AddOnPayNumber, setAddOnPayNumber] = useState<number>(0);
  // const [PayTotal, setPayTotal] = useState<number>(TourBookingPriceTotal || 0);
  // React.useEffect(() => {
  //   if (TourProductAddOnList.length > 0) {
  //     let DataArray = new Array();
  //     TourProductAddOnList.map((item, index) => {
  //       DataArray.push({
  //         id: item.TourProductAddOnId,
  //         number: 0,
  //         price: item.TourProductAddOnHarga,
  //         name:
  //           item.TourProductAddOnDeskripsi +
  //           " " +
  //           item.TourProductAddOnFasilitas,
  //       });
  //     });
  //     if (localStorage.TourOrderAddOnNumber) {
  //       const TempTourOrderAddOnNumber = JSON.parse(
  //         localStorage.TourOrderAddOnNumber
  //       );
  //       // Cek Produk yang sama atau berbeda dengan produk sebelumnya
  //       // maka diambilkan dari localhost
  //       if (TempTourOrderAddOnNumber[0].id === DataArray[0].id) {
  //         DataArray = new Array();
  //         DataArray = TempTourOrderAddOnNumber;
  //       }
  //     }
  //     setAddOnNumber(DataArray);
  //   } else {
  //     setModal(false);
  //   }
  // }, []);
  // React.useEffect(() => {
  //   if (AddOnNumber !== null) {
  //     let TempNumber = 0;
  //     const TourPayTotal = TourBookingPriceTotal || 0;
  //     AddOnNumber.map((item, index) => {
  //       TempNumber = TempNumber + item.price * item.number;
  //     });
  //     setAddOnPayNumber(TempNumber);
  //     setPayTotal(TourPayTotal + TempNumber);
  //   }
  // }, [AddOnNumber]);
  // const Plus = (index: number) => {
  //   let TempArray = [...AddOnNumber];
  //   TempArray[index].number = TempArray[index].number + 1;
  //   setAddOnNumber(TempArray);
  // };
  // const Minus = (index: number) => {
  //   let TempArray = [...AddOnNumber];
  //   TempArray[index].number =
  //     TempArray[index].number > 0 ? TempArray[index].number - 1 : 0;
  //   setAddOnNumber(TempArray);
  // };
  const submitAddOn = () => {
    // localStorage.setItem("TourOrderAddOnNumber", JSON.stringify(AddOnNumber));
    // localStorage.setItem("TourOrderAddOnPayNumber", String(AddOnPayNumber));
    // SetAddOnPrice(AddOnPayNumber);
    setModalBaggage(false);
  };
  const CheckAddOnSuccess = (res: any) => {
    if (res.Data) {
      if (
        res.Data.RespStatus &&
        res.Data.RespStatus === "OK" &&
        res.Data.baggage &&
        res.Data.baggage.length > 0
      ) {
        setShowLoading(false);
        setBaggageData(res.Data.baggage);
        const dv = JSON.parse(localStorage.AirlineOrderBaggageSelected);
        const baggages = res.Data.baggage;
        let nulldata = false;
        dv.forEach((i) => {
          i.forEach((ii) => {
            if (ii === null) {
              nulldata = true;
            }
          });
        });
        let arraydata = [] as any;
        let dataone = [] as any;
        let datatwo = [] as any;

        if (nulldata) {
          if (baggages !== null) {
            const codeData =
              baggages[0] &&
              baggages[0].baggageInfos.sort((a, b) => a.fare - b.fare)[0];
            if (codeData) {
              dv[0].forEach((i) => {
                dataone.push(codeData);
              });
            }
          }
          if (baggages !== null) {
            const codeData =
              baggages[1] &&
              baggages[1].baggageInfos.sort((a, b) => a.fare - b.fare)[0];
            if (codeData) {
              dv[1].forEach((i) => {
                datatwo.push(codeData);
              });
            }
          }
          if (datatwo.length > 0) {
            arraydata = [dataone, datatwo];
          } else {
            arraydata = [dataone];
          }

          if (arraydata.length > 0) {
            localStorage.setItem(
              "AirlineOrderBaggageSelected",
              JSON.stringify(arraydata)
            );
          }
        }
        // BaggageFill(res.baggage)
      } else {
        setBaggageData(null);
      }
    } else {
      failedAlert("Ada Permasalahan");
    }
  };
  // const BaggageFill = (bd: any) => {
  //   let bi = [null,null]
  //   AOPD.forEach(p => {
  //     if (p.PaxAddOns === null) {
  //       bd
  //       bi[]
  //     }
  //   });
  // }
  useIonViewDidEnter(() => {
    calculateBaggage();
  });
  useEffect(() => {
    if (AOPD && ABDB) {
      if (AOPDCheck() && localStorage.AirlineOrderOrderPerson) {
        const AOOP = JSON.parse(localStorage.AirlineOrderOrderPerson);
        let PaxDetailArray = new Array();
        setShowLoading(true);
        AOPD.forEach((PaxDetail) => {
          const PaxType =
            PaxDetail.PaxType === "Adult"
              ? 0
              : PaxDetail.PaxType === "Child"
              ? 1
              : PaxDetail.PaxType === "Infant"
              ? 2
              : 0;
          const tempdata = {
            IDNumber: null,
            addOns: null,
            batikMilesNo: "",
            birthCountry: PaxDetail.PaxBirthCountry,
            birthDate: new Date(PaxDetail.PaxBirthDate).toISOString(),
            firstName: PaxDetail.PaxFirstName,
            garudaFrequentFlyer: PaxDetail.PaxGarudaFrequentFlyer,
            gender: PaxDetail.PaxGender,
            lastName: PaxDetail.PaxLastName,
            nationality: PaxDetail.PaxNationality,
            parent: PaxDetail.PaxParent,
            passportExpiredDate: PaxDetail.PaxPassportExpiredDate,
            passportIssuedCountry: PaxDetail.PaxPassportIssuedCountry,
            passportIssuedDate: PaxDetail.PaxPassportIssuedDate,
            passportNumber: PaxDetail.PaxPassportNumber,
            title: PaxDetail.PaxTitle,
            type: PaxType,
          };
          PaxDetailArray.push(tempdata);
        });
        var MyHeaders = {
          appid: AppId,
          "Content-Type": "application/json",
          RequestVerificationToken: UserData.requestVerificationToken,
        };
        var MyData = JSON.stringify({
          PaxDetail: PaxDetailArray,
          contactTitle: AOOP.OrderPersonTitel,
          contactRemainingPhoneNo: AOOP.OrderPersonPhoneNumber,
          contactCountryCodePhone: AOOP.OrderPersonNationCode,
          contactAreaCodePhone: null,
          contactFirstName: AOOP.OrderPersonFirstName,
          contactLastName: AOOP.OrderPersonLastName,
          contactEmail: AOOP.OrderPersonEmail,
          requestInsurance: false,
          XTKN: ABDB.PreBookingData.XTKN,
          accToken: UserData.accessToken,
        });
        if (isPlatform("cordova")) {
          HTTP.setDataSerializer("json");
          HTTP.post(
            MainUrl + "Airline/CheckAddOn",
            JSON.parse(MyData),
            MyHeaders
          )
            .then((res) => {
              if (res.status !== 200) {
                alert("Periksa Koneksi anda");
              }
              return JSON.parse(res.data);
            })
            .then((res) => {
              CheckAddOnSuccess(res);
            })
            .catch((err) => {
              failedAlert(JSON.stringify(err));
            });
        } else {
          fetch(MainUrl + "Airline/CheckAddOn", {
            method: "POST",
            headers: MyHeaders,
            body: MyData,
          })
            .then((r) => {
              if (r.ok) {
                return r.json();
              } else {
                failedAlert("Periksa Koneksi Anda");
              }
            })
            .then((res) => {
              CheckAddOnSuccess(res);
            })
            .catch((err) => {
              failedAlert("Periksa Koneksi Internet");
            });
        }
      }
    }
  }, [AOPD, ABDB]);
  // const closeModal = () => {
  //   const TOAON = localStorage.TourOrderAddOnNumber
  //     ? JSON.parse(localStorage.TourOrderAddOnNumber)
  //     : undefined;

  //   if (TOAON) {
  //     setAddOnNumber(TOAON);
  //   }
  //   setModal(false);
  // };

  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Ups! ada yang kurang");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const AOPDCheck = () => {
    let count = 0;
    AOPD.forEach((i) => {
      if (i.PaxFirstName !== "") {
        count = count + 1;
      }
    });
    if (count >= AOPD.length) {
      return true;
    } else {
      return false;
    }
  };
  const OpenBaggage = () => {
    calculateBaggage();
    if (AOPDCheck()) {
      setModalBaggage(true);
    } else {
      failedAlert("Pastikan data penumpang sudah terisi dengan benar");
    }
  };
  return (
    <div className="ion-no-padding">
      <IonText class="ion-padding" color="dark">
        <small>Layanan Tambahan</small>
      </IonText>
      <IonCard
        className="ion-activatable ripple-parent ion-margin-bottom"
        onClick={() => OpenBaggage()}
      >
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonIcon icon={briefcase} className="ion-margin-end"></IonIcon>
                <IonText>Bagasi</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonIcon icon={chevronForward} color="primary"></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* <IonText color="success">
            <small>(Bagasi terisi. Klik untuk lihat dan ubah)</small>
          </IonText> */}
          <IonRippleEffect></IonRippleEffect>
        </IonCardContent>
      </IonCard>
      <IonCard
        hidden={true}
        className="ion-activatable ripple-parent ion-margin-bottom"
        onClick={() => setModalAddOns(true)}
      >
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonIcon icon={briefcase} className="ion-margin-end"></IonIcon>
                <IonText>Data Add Ons</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonIcon icon={chevronForward} color="primary"></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* <IonText color="success">
            <small>(Bagasi terisi. Klik untuk lihat dan ubah)</small>
          </IonText> */}
          <IonRippleEffect></IonRippleEffect>
        </IonCardContent>
      </IonCard>

      {/* Modal Order Additional Facilities */}
      <IonModal isOpen={ModalBaggage}>
        <IonContent className="gray-bg">
          <DefaultToolbar
            title="Bagasi"
            color="primary"
            backButtonRoute={() => {
              setModalBaggage(false);
            }}
          />
          <Lottie animationData={loadingLottie} hidden={AOPB ? true : false} />
          <div hidden={!AOPB ? true : false}>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonText>Penerbangan Pergi</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonGrid className="white-bg">
              <IonRow>
                <IonCol size="2">
                  <img
                    src={`assets/img/Airlines/${
                      (ABDB &&
                        ABDB.AirlineFlightDeparture &&
                        ABDB.AirlineFlightDeparture.airlineID.toLowerCase()) ||
                      ""
                    }/${
                      (ABDB &&
                        ABDB.AirlineFlightDeparture &&
                        ABDB.AirlineFlightDeparture.airlineID.toLowerCase()) ||
                      ""
                    }.png`}
                    alt=""
                    height="16px"
                  />
                </IonCol>
                <IonCol>
                  <IonText>
                    {BaggageData && BaggageData[0].origin} ➝{" "}
                    {BaggageData && BaggageData[0].destination}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            {AOPD ? (
              AOPD.filter(
                (obj) => obj.PaxType === "Adult" || obj.PaxType === "Child"
              ).map((item, index) => (
                // <div></div>
                <AirlineOrderBaggageItem
                  indexItem={index}
                  item={item}
                  key={index}
                  AOPD={AOPD}
                  AOPB={AOPB}
                  calculateBaggage={() => {
                    calculateBaggage();
                  }}
                  indexBaggage={0}
                  BaggageData={BaggageData}
                  // domesticTourType={domesticTourType}
                  // PassengerTitle={PassengerTitle}
                ></AirlineOrderBaggageItem>
              ))
            ) : (
              <>
                <p></p>
                <IonText color="danger">⚠️ Anda belum memilih pax</IonText>
              </>
            )}
            <IonGrid hidden={ABDB && ABDB.AirlineFlightArrival ? false : true}>
              <IonRow>
                <IonCol>
                  <IonText>Penerbangan Pulang</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonGrid
              className="white-bg"
              hidden={ABDB && ABDB.AirlineFlightArrival ? false : true}
            >
              <IonRow>
                <IonCol size="2">
                  <img
                    src={`assets/img/Airlines/${
                      (ABDB &&
                        ABDB.AirlineFlightArrival &&
                        ABDB.AirlineFlightArrival.airlineID.toLowerCase()) ||
                      ""
                    }/${
                      (ABDB &&
                        ABDB.AirlineFlightArrival &&
                        ABDB.AirlineFlightArrival.airlineID.toLowerCase()) ||
                      ""
                    }.png`}
                    alt=""
                    height="16px"
                  />
                </IonCol>
                <IonCol>
                  <IonText>
                    {BaggageData && BaggageData[1] && BaggageData[1].origin} ➝{" "}
                    {BaggageData &&
                      BaggageData[1] &&
                      BaggageData[1].destination}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            {AOPD && ABDB && ABDB.AirlineFlightArrival ? (
              AOPD.filter(
                (obj) => obj.PaxType === "Adult" || obj.PaxType === "Child"
              ).map((item, index) => (
                // <div></div>
                <AirlineOrderBaggageItem
                  indexItem={index}
                  item={item}
                  AOPD={AOPD}
                  key={index}
                  AOPB={AOPB}
                  calculateBaggage={() => {
                    calculateBaggage();
                  }}
                  indexBaggage={1}
                  BaggageData={BaggageData}
                  // domesticTourType={domesticTourType}
                  // PassengerTitle={PassengerTitle}
                ></AirlineOrderBaggageItem>
              ))
            ) : (
              <>
                <p></p>
              </>
            )}
          </div>
        </IonContent>
        <IonFooter>
          <IonCard className="ion-no-margin ion-no-padding footerPrice">
            <IonGrid>
              <IonRow class="priceCollapse">
                <IonCol size="6">
                  <IonText color="medium">Sub Total</IonText>
                </IonCol>
                <IonCol size="6" className="ion-text-right">
                  <IonText>
                    <h5 className="ion-no-margin">
                      {rupiah(BaggagePriceGrandTotal)}
                      <IonIcon
                        icon={chevronUp}
                        hidden={hiddenDetailPriceChevronUp}
                        size="large"
                        color="primary"
                        onClick={() => seeDetailPrice()}
                      ></IonIcon>
                      <IonIcon
                        icon={chevronDown}
                        hidden={hiddenDetailPriceChevronDown}
                        size="large"
                        color="primary"
                        onClick={() => hideDetailPrice()}
                      ></IonIcon>
                    </h5>
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow hidden={hiddenDetailPrice}>
                <IonCol size="6">
                  <IonText color="medium">
                    {(BaggageData && BaggageData[0] && BaggageData[0].origin) ||
                      ""}{" "}
                    -{" "}
                    {(BaggageData &&
                      BaggageData[0] &&
                      BaggageData[0].destination) ||
                      ""}
                  </IonText>
                </IonCol>
                <IonCol size="6" className="ion-text-right">
                  <IonText color="medium">
                    {rupiah(BaggagePriceTotalDeparture)}
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow hidden={hiddenDetailPrice}>
                <IonCol size="6">
                  <IonText color="medium">
                    {" "}
                    {(BaggageData && BaggageData[1] && BaggageData[1].origin) ||
                      ""}{" "}
                    -{" "}
                    {(BaggageData &&
                      BaggageData[1] &&
                      BaggageData[1].destination) ||
                      ""}
                  </IonText>
                </IonCol>
                <IonCol size="6" className="ion-text-right">
                  <IonText color="medium">
                    {" "}
                    {rupiah(BaggagePriceTotalArrival)}
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton
                    className="text-transform-none"
                    size="large"
                    expand="block"
                    // onClick={() => Pay()}
                    onClick={() => setModalBaggage(false)}
                  >
                    Simpan
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>
        </IonFooter>
      </IonModal>
      <IonLoading isOpen={showLoading} message={"Mohon Tunggu..."} />
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
  mapStateToProps: (state) => ({
    ABDB: state.airline.AirlineBookingDataBundle,
    AOPD: state.airline.AirlineOrderPassengersData,
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {
    loadAirlineOrderPassengersData,
    loadAirlineBookingDataBundleData,
  },
  component: React.memo(withRouter(AirlineOrderBaggage)),
});
function MyData(arg0: string, MyData: any, MyHeaders: any) {
  throw new Error("Function not implemented.");
}
