import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonFooter,
  IonButton,
  IonPage,
  IonHeader,
  IonRow,
  IonGrid,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonCol,
  IonText,
  IonIcon,
  IonLabel,
  IonItem,
  IonRippleEffect,
  IonModal,
  IonInput,
  IonPopover,
  IonAlert,
  IonLoading,
  isPlatform,
} from "@ionic/react";
import { timeOutline, chevronDown, chevronUp } from "ionicons/icons";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import TourWizard from "../../components/TourWizard";

import * as selectors from "../../data/selectors";
import "./Payment.scss";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import ModalTourDetail from "../../components/ModalTourDetail";
import { rupiah } from "../../helpers/currency";
import { AppId, AppUrl, MainUrl } from "../../AppConfig";
import { cSharpDateCovert } from "../../helpers/datetime";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { HTTP } from "@ionic-native/http";

interface OwnProps {}
interface StateProps {
  TourBookingNumberOfAdult?: number;
  TourBookingNumberOfChild?: number;
  TourBookingNumberOfInfant?: number;
  TourBookingPriceTotal?: number;
  TourProductDetail?: any;
  TourProductPricingIndex?: number;
  TourProductStartDate?: string;
  TourBookingNumberOfPaxTotal?: number;
  UserData: any;
}
interface DispatchProps {}
interface TourPaymentProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const TourPayment: React.FC<TourPaymentProps> = ({
  history,
  TourBookingPriceTotal,
  TourProductStartDate,
  TourProductDetail,
  TourProductPricingIndex,
  TourBookingNumberOfPaxTotal,
  UserData,
}) => {
  const [TourOrderAddOnNumber, setTourOrderAddOnNumber] = useState<any>(null);
  const [AddOnPrice, setAddOnPrice] = useState(
    localStorage.TourOrderAddOnPayNumber
      ? Number(localStorage.TourOrderAddOnPayNumber)
      : 0
  );
  const [GrandTotal, setGrandTotal] = useState(TourBookingPriceTotal || 0);
  const [hiddenDetailPrice, setHiddenDetailPrice] = useState(true);
  const [hiddenDetailPriceChevronUp, setHiddenDetailPriceChevronUp] =
    useState(false);
  const [hiddenDetailPriceChevronDown, setHiddenDetailPriceChevronDown] =
    useState(true);
  // modal
  const [showModalPaymentRepayment, setShowModalPaymentRepayment] =
    useState(false);
  const [showModalPaymentPayment, setShowModalPaymentPayment] = useState(false);
  const [showModalPaymentVoucher, setShowModalPaymentVoucher] = useState(false);
  const [showModalTourDetail, setShowModalTourDetail] = useState(false);

  const [PaymentMethodData, setPaymentMethodData] = useState<any>(null);
  const [TimeLimit, setTimeLimit] = useState<string>("");

  const [paymentRepaymentMethod, setPaymentRepaymentMethod] =
    useState<number>(0);
  const [paymentPaymentMethod, setPaymentPaymentMethod] = useState<string>("");
  const [paymentFee, setPaymentFee] = useState<number>(0);
  const [paymentPaymentMethodCode, setPaymentPaymentMethodCode] =
    useState<string>("");
  const [Balance, setBalance] = useState<string>(UserData.balance || "0.00");
  const [paymentVoucher, setPaymentVoucher] = useState<string>("Saldo");

  const [text, setText] = useState<string>();
  const [orderUserTitle, setOrderUserTitle] = useState<string>("Tuan");
  const [orderPassengersNation, setOrderPassengersNation] =
    useState<string>("Afghanistan");
  const [orderPassengersPublisher, setOrderPassengersPublisher] =
    useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  React.useEffect(() => {
    if (localStorage.TourOrderAddOnNumber)
      setTourOrderAddOnNumber(JSON.parse(localStorage.TourOrderAddOnNumber));

    setShowLoading(true);

    getTimeLimit();
    updateBalance();
    getPaymentMethod();
  }, []);
  React.useEffect(() => {
    // paymentRepaymentMethod===2?setGrandTotal(GrandTotal/2):setGrandTotal(GrandTotal);
  }, [paymentRepaymentMethod]);
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
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
  const selectPaymentMethod = (Name, Code, Fee) => {
    setShowModalPaymentPayment(false);
    setPaymentPaymentMethod(Name);
    setPaymentPaymentMethodCode(Code);
    setPaymentFee(Fee);
  };
  const PayValidation = () => {
    if (
      TourProductDetail.TourProductModels.ProductTourCategory === "Series" &&
      paymentRepaymentMethod === 0
    ) {
      failedAlert("Mohon pilih metode pelunasan");
      return false;
    }
    if (paymentPaymentMethodCode === "") {
      failedAlert("Mohon pilih metode pembayaran");
      return false;
    } else if (paymentPaymentMethodCode === "Saldo") {
      const MustPay =
        paymentRepaymentMethod === 2 ? GrandTotal / 2 : GrandTotal;
      const NewBalance = parseFloat(Balance.replace(/,/g, ""));
      if (NewBalance < MustPay) {
        failedAlert("Saldo Anda Tidak Mencukupi");
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
    return true;
  };
  const updateBalance = () => {
    var MyData = new FormData();
    MyData.append("AccToken", UserData.accessToken);
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "member/accountinfo", MyData, MyHeaders)
        .then((res) => {
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.Saldo) setBalance(res.Saldo);
        });
    } else {
      fetch(MainUrl + "member/accountinfo", {
        method: "POST",
        body: MyData,
        headers: MyHeaders,
      })
        .then((r) => {
          return r.json();
        })
        .then((res) => {
          if (res.Saldo) setBalance(res.Saldo);
        });
    }
  };
  const getPaymentMethod = () => {
    if (PaymentMethodData === null) {
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("json");
        HTTP.post(MainUrl + "Payment/PaymentMethod?transType=travel", {}, {})
          .then((res) => {
            if (res.status !== 200) {
              failedAlert("Cek Koneksi Internet Anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            if (res.StatusCode === 200) {
              setShowLoading(false);
              setPaymentMethodData(res.Data);
            } else {
              failedAlert(res.ErrorMessage);
              // history.push('/tourSearch');
            }
          })
          .catch((e) => {
            failedAlert("Koneksi Anda Bermasalah");
          });
      } else {
        fetch(MainUrl + "Payment/PaymentMethod?transType=travel", {
          method: "POST",
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              failedAlert("Cek Koneksi Internet Anda");
            }
          })
          .then((res) => {
            if (res.StatusCode === 200) {
              setShowLoading(false);
              setPaymentMethodData(res.Data);
            } else {
              failedAlert(res.ErrorMessage);
              // history.push('/tourSearch');
            }
          })
          .catch((e) => {
            failedAlert("Koneksi Anda Bermasalah");
          });
      }
    }
  };
  const getTimeLimit = () => {
    var MyData = new FormData();
    MyData.append("booking_code", localStorage.TourOrderBookingCode);
    if (isPlatform("cordova")) {
      HTTP.get(
        MainUrl + "tour/Payment",
        {
          booking_code: localStorage.TourOrderBookingCode,
          AccToken: UserData.accessToken,
        },
        {
          appid: AppId,
          RequestVerificationToken: UserData.requestVerificationToken,
        }
      )
        .then((res) => {
          if (res.status !== 200) {
            alert("Periksa Koneksi anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            createTimeLimit(res.Data.BookingLimit);
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    } else {
      fetch(
        MainUrl +
          "tour/Payment?booking_code=" +
          localStorage.TourOrderBookingCode +
          "&AccToken=" +
          UserData.accessToken,
        {
          method: "GET",
          headers: {
            appid: AppId,
            RequestVerificationToken: UserData.requestVerificationToken,
          },
        }
      )
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            failedAlert("Periksa Koneksi Anda");
          }
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            createTimeLimit(res.Data.BookingLimit);
          } else {
            failedAlert("Periksa Koneksi Internet Anda");
          }
        })
        .catch((err) => {
          failedAlert("Periksa Koneksi Internet");
        });
    }
  };

  const Pay = () => {
    setShowLoading(true);
    if (PayValidation() === false) {
      return;
    }
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = new FormData();
    MyData.append("AccToken", UserData.accessToken);
    MyData.append(
      "payment_type",
      TourProductDetail.TourProductModels.ProductTourCategory === "Regular"
        ? "100%"
        : paymentRepaymentMethod === 2
        ? "50%"
        : "100%"
    );
    // TourProductDetail.tourmode
    MyData.append("payment_method", paymentPaymentMethodCode);
    if (isPlatform("cordova")) {
      MyData.append("AccessMethod", "Android");
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "tour/Payment", MyData, MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Cek Koneksi Internet Anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            if (paymentPaymentMethodCode !== "Saldo") {
              const DokuStagingUrl =
                AppUrl + "DokuStaging/" + encodeURI(JSON.stringify(res.Data));
              if (isPlatform("cordova")) {
                const browser = InAppBrowser.create(DokuStagingUrl);
                browser.on("exit").subscribe((event) => {
                  browser.close();
                  setShowLoading(false);
                  history.push("/tourComplete");
                });
              } else {
                window.location.href = DokuStagingUrl;
              }
            } else {
              setShowLoading(false);
              history.push("/tourComplete");
            }
          } else {
            failedAlert(res.ErrorMessage);
            // history.push('/tourSearch');
          }
        })
        .catch((e) => {
          failedAlert(e.error);
        });
    } else {
      MyData.append("AccessMethod", "PWA");
      fetch(MainUrl + "tour/Payment", {
        method: "POST",
        body: MyData,
        headers: MyHeaders,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            failedAlert("Cek Koneksi Internet Anda");
          }
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            if (paymentPaymentMethodCode !== "Saldo") {
              const DokuStagingUrl =
                AppUrl + "DokuStaging/" + encodeURI(JSON.stringify(res.Data));
              if (isPlatform("cordova")) {
                const browser = InAppBrowser.create(DokuStagingUrl);
                browser.on("exit").subscribe((event) => {
                  browser.close();
                  setShowLoading(false);
                  history.push("/tourComplete");
                });
              } else {
                window.location.href = DokuStagingUrl;
              }
            } else {
              setShowLoading(false);
              history.push("/tourComplete");
            }
          } else {
            failedAlert(res.ErrorMessage);
            // history.push('/tourSearch');
          }
        })
        .catch((e) => {
          failedAlert("Koneksi Anda Bermasalah");
        });
    }
  };
  const ChoosePayment = () => {
    setShowModalPaymentPayment(true);
  };
  const createTimeLimit = (BookingLimit) => {
    const BookingTimeLimit = new Date(
      parseInt(BookingLimit.replace(/[^0-9 +]/g, ""))
    ).getTime();

    const x = setInterval(function () {
      const now = new Date().getTime();
      const distance = BookingTimeLimit - now;
      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      // const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      setTimeLimit(`${hours} jam ${minutes} menit`);

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        setTimeLimit(`Expired`);
      }
    }, 1000);
    setShowLoading(false);
  };
  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tourOrder"></IonBackButton>
          </IonButtons>
          <IonTitle>Konfirmasi Pembayaran</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="TourOrder">
        <TourWizard
          WizardIndex={2}
          TourProductStartDate={TourProductStartDate}
          TourProductDetail={TourProductDetail}
          TourBookingNumberOfPaxTotal={TourBookingNumberOfPaxTotal}
          TourProductPricingIndex={TourProductPricingIndex}
        ></TourWizard>
        {/* Login As */}
        <IonGrid className="orange-bg ion-padding ion-margin-bottom timer">
          <IonRow>
            <IonCol size="2" className="avatar">
              <IonIcon icon={timeOutline} size="large" color="light"></IonIcon>
            </IonCol>
            <IonCol>
              <div>
                <IonText color="light">
                  <p>
                    <small>Selesaikan pembayaran dalam {TimeLimit}</small>
                  </p>
                </IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonText
          class="ion-padding"
          color="dark"
          hidden={
            TourProductDetail.TourProductModels.ProductTourCategory ===
            "Reguler"
              ? true
              : false
          }
        >
          <small>Metode Pelunasan</small>
        </IonText>
        <IonCard
          className="ion-activatable ripple-parent ion-margin-bottom"
          hidden={
            TourProductDetail.TourProductModels.ProductTourCategory ===
            "Reguler"
              ? true
              : false
          }
          onClick={() => setShowModalPaymentRepayment(true)}
        >
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <h6>
                      {paymentRepaymentMethod === 1
                        ? "Bayar Lunas"
                        : paymentRepaymentMethod === 2
                        ? "Bayar Sebagian"
                        : "Pilih Metode Pelunasan"}
                      {paymentRepaymentMethod === 1
                        ? " (100%)"
                        : paymentRepaymentMethod === 2
                        ? " (50%)"
                        : ""}
                    </h6>
                  </IonText>
                </IonCol>
                <IonCol className="ion-text-right">
                  <IonText color="primary">
                    <b>Pilih</b>
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonRippleEffect></IonRippleEffect>
          </IonCardContent>
        </IonCard>
        <IonText class="ion-padding" color="dark">
          <small>Metode Pembayaran</small>
        </IonText>
        <IonCard
          className="ion-activatable ripple-parent ion-margin-bottom"
          onClick={() => ChoosePayment()}
        >
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <h6>
                      {paymentPaymentMethod !== ""
                        ? paymentPaymentMethod
                        : "Pilih metode pembayaran"}
                    </h6>
                  </IonText>
                </IonCol>
                <IonCol className="ion-text-right">
                  <IonText color="primary">
                    <b>Pilih</b>
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonRippleEffect></IonRippleEffect>
          </IonCardContent>
        </IonCard>
        <IonText class="ion-padding" color="dark" hidden={true}>
          <small>Kode Voucher</small>
        </IonText>
        <IonCard
          hidden={true}
          className="ion-activatable ripple-parent ion-margin-bottom"
          onClick={() => setShowModalPaymentVoucher(true)}
        >
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <IonText color="dark">
                    <h6>Punya kode voucher?</h6>
                  </IonText>
                </IonCol>
                <IonCol className="ion-text-right">
                  <IonText color="primary">
                    <b>Tambah</b>
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonRippleEffect></IonRippleEffect>
          </IonCardContent>
        </IonCard>
        {/* Modal Payment Repayment */}
        <IonModal isOpen={showModalPaymentRepayment}>
          <IonContent className="gray-bg">
            <DefaultToolbar
              title="Pilih Metode Pelunasan"
              color="primary"
              backButtonRoute={() => {
                setShowModalPaymentRepayment(false);
              }}
            />
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonCard
                    onClick={() => {
                      setShowModalPaymentRepayment(false);
                      setPaymentRepaymentMethod(1);
                    }}
                    className="ion-activatable ripple-parent"
                  >
                    <IonCardContent>
                      <IonText color="dark">
                        <h6>Bayar Lunas</h6>
                      </IonText>
                      <IonText color="medium">
                        <small>Persentase pembayaran awal 100%</small>
                      </IonText>
                      <IonRippleEffect></IonRippleEffect>
                    </IonCardContent>
                  </IonCard>
                  <IonCard
                    hidden={
                      PaymentMethodData !== null
                        ? PaymentMethodData[0].paymentStatus !== "Off"
                          ? false
                          : true
                        : true
                    }
                    onClick={() => {
                      setShowModalPaymentRepayment(false);
                      setPaymentRepaymentMethod(2);
                    }}
                    className="ion-activatable ripple-parent"
                  >
                    <IonCardContent>
                      <IonText color="dark">
                        <h6>Bayar Sebagian</h6>
                      </IonText>
                      <IonText color="medium">
                        <small>Persentase pembayaran awal 50%</small>
                      </IonText>
                      <IonRippleEffect></IonRippleEffect>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
        {/* Modal Order Additional Facilities */}
        <IonModal isOpen={showModalPaymentPayment}>
          <IonContent className="gray-bg">
            <DefaultToolbar
              title="Pilih Metode Pembayaran"
              color="primary"
              backButtonRoute={() => {
                setShowModalPaymentPayment(false);
              }}
            />
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonCard
                    hidden={
                      PaymentMethodData !== null
                        ? PaymentMethodData[0].paymentStatus !== "Off"
                          ? false
                          : true
                        : true
                    }
                    onClick={() => {
                      if (Balance !== "0.00")
                        selectPaymentMethod("Saldo", "Saldo", 0);
                    }}
                    className="ion-activatable ion-margin-bottom ripple-parent"
                  >
                    <IonCardContent>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="7">
                            <IonText color="dark">
                              <h6>Saldo</h6>
                            </IonText>
                            <IonText color="medium">
                              <small>
                                Memotong saldo untuk melakukan pembayaran.
                              </small>
                            </IonText>
                          </IonCol>
                          <IonCol size="5" className="ion-text-right">
                            <IonText>
                              <b>{Balance !== "0.00" ? Balance : "Kosong"}</b>
                            </IonText>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                      <IonRippleEffect></IonRippleEffect>
                    </IonCardContent>
                  </IonCard>

                  <IonText className="ion-margin">
                    <small>
                      {PaymentMethodData
                        ? PaymentMethodData[1].PaymentMethod
                        : ""}
                    </small>
                  </IonText>
                  <IonCard
                    hidden={PaymentMethodData !== null ? false : true}
                    onClick={() =>
                      selectPaymentMethod(
                        PaymentMethodData !== null
                          ? PaymentMethodData[1].PaymentInfo[0].description
                          : "",
                        PaymentMethodData !== null
                          ? PaymentMethodData[1].PaymentInfo[0].code
                          : "",
                        PaymentMethodData !== null
                          ? PaymentMethodData[1].PaymentInfo[0].fee
                          : 0
                      )
                    }
                    className="ion-activatable ripple-parent"
                  >
                    <IonCardContent>
                      <IonItem className="ion-no-padding">
                        <IonText>
                          <small>
                            {PaymentMethodData !== null
                              ? PaymentMethodData[1].PaymentInfo[0].description
                              : ""}
                          </small>
                        </IonText>
                        <IonText slot="end" color="medium">
                          <small>{TimeLimit}</small>
                        </IonText>
                      </IonItem>
                      <img
                        src="assets/img/payment/visa.png"
                        alt=""
                        className="payment-logo"
                      />
                      <img
                        src="assets/img/payment/mastercard.png"
                        alt=""
                        className="payment-logo"
                      />
                      <img
                        src="assets/img/payment/jcb.png"
                        alt=""
                        className="payment-logo"
                      />
                      <img
                        src="assets/img/payment/american express.png"
                        alt=""
                        className="payment-logo"
                      />
                      <IonRippleEffect></IonRippleEffect>
                    </IonCardContent>
                  </IonCard>

                  <IonText className="ion-margin">
                    <small>
                      {PaymentMethodData
                        ? PaymentMethodData[2].PaymentMethod
                        : ""}
                    </small>
                  </IonText>
                  {PaymentMethodData !== null
                    ? PaymentMethodData[2].PaymentInfo.map(
                        (item: any, index: number) => (
                          <IonCard
                            key={index}
                            onClick={() =>
                              selectPaymentMethod(
                                item.description,
                                item.code,
                                item.fee
                              )
                            }
                            className="ion-activatable ripple-parent ion-margin-bottomoalah"
                          >
                            <IonCardContent>
                              <IonItem className="ion-no-padding ion-margin-bottom">
                                <img
                                  src={
                                    "assets/img/payment/" + item.code + ".png"
                                  }
                                  alt=""
                                  height="32px"
                                  className="ion-margin-end"
                                />
                                <IonText>
                                  <small>{item.description}</small>
                                </IonText>
                                <IonText slot="end" color="medium">
                                  <small>{TimeLimit}</small>
                                </IonText>
                              </IonItem>
                              <IonText color="primary">
                                Berlaku tambahan kode unik
                              </IonText>
                              <IonRippleEffect></IonRippleEffect>
                            </IonCardContent>
                          </IonCard>
                        )
                      )
                    : ""}
                  <IonText className="ion-margin">
                    <small>
                      {PaymentMethodData
                        ? PaymentMethodData[3].PaymentMethod
                        : ""}
                    </small>
                  </IonText>
                  {PaymentMethodData !== null
                    ? PaymentMethodData[3].PaymentInfo.map(
                        (item: any, index: number) => (
                          <IonCard
                            key={index}
                            onClick={() =>
                              selectPaymentMethod(
                                item.description,
                                item.code,
                                item.fee
                              )
                            }
                            className="ion-activatable ripple-parent ion-margin-bottomoalah"
                          >
                            <IonCardContent>
                              <IonItem className="ion-no-padding ion-margin-bottom">
                                <img
                                  src={
                                    "assets/img/payment/" + item.code + ".png"
                                  }
                                  alt=""
                                  height="32px"
                                  className="ion-margin-end"
                                />
                                <IonText>
                                  <small>{item.description}</small>
                                </IonText>
                                <IonText slot="end" color="medium">
                                  <small>{TimeLimit}</small>
                                </IonText>
                              </IonItem>
                              <IonText color="primary">
                                Berlaku tambahan kode unik
                              </IonText>
                              <IonRippleEffect></IonRippleEffect>
                            </IonCardContent>
                          </IonCard>
                        )
                      )
                    : ""}
                  <IonText className="ion-margin">
                    <small>
                      {PaymentMethodData
                        ? PaymentMethodData[4].PaymentMethod
                        : ""}
                    </small>
                  </IonText>
                  {PaymentMethodData !== null
                    ? PaymentMethodData[4].PaymentInfo.map(
                        (item: any, index: number) => (
                          <IonCard
                            key={index}
                            onClick={() =>
                              selectPaymentMethod(
                                item.description,
                                item.code,
                                item.fee
                              )
                            }
                            className="ion-activatable ripple-parent ion-margin-bottomoalah"
                          >
                            <IonCardContent>
                              <IonItem className="ion-no-padding ion-margin-bottom">
                                <img
                                  src={
                                    "assets/img/payment/" + item.code + ".png"
                                  }
                                  alt=""
                                  height="32px"
                                  className="ion-margin-end"
                                />
                                <IonText>
                                  <small>{item.description}</small>
                                </IonText>
                                <IonText slot="end" color="medium">
                                  <small>{TimeLimit}</small>
                                </IonText>
                              </IonItem>
                              <IonText color="primary">
                                Berlaku tambahan kode unik
                              </IonText>
                              <IonRippleEffect></IonRippleEffect>
                            </IonCardContent>
                          </IonCard>
                        )
                      )
                    : ""}
                </IonCol>
              </IonRow>
            </IonGrid>
            <div
              className="loadingData"
              hidden={PaymentMethodData !== null ? true : false}
            >
              <img src="assets/icon/loading.svg" width="80px" />
              <br />
              Memuat Metode Pembayaran
            </div>
          </IonContent>
        </IonModal>
        {/* Modal Order Special Requests */}
        <IonModal isOpen={showModalPaymentVoucher}>
          <IonContent className="gray-bg">
            <DefaultToolbar
              title="Kode Voucher"
              color="primary"
              backButtonRoute={() => {
                setShowModalPaymentVoucher(false);
              }}
            />
            <IonGrid className="ion-padding white-bg ion-margin-top">
              <IonRow>
                <IonCol size="7">
                  <IonItem>
                    <IonLabel position="floating">
                      <small>Masukkan voucher di sini</small>
                    </IonLabel>
                    <IonInput></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol size="5">
                  <IonButton
                    className="text-transform-none ion-margin-top"
                    expand="block"
                    onClick={() => setShowModalPaymentVoucher(false)}
                  >
                    Pakai Voucher
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
        <ModalTourDetail
          ShowModal={showModalTourDetail}
          TourProductStartDate={TourProductStartDate}
          TourProductDetail={TourProductDetail}
          TourProductPricingMaskapai={
            TourProductDetail.TourProductPricingList[
              TourProductPricingIndex || 0
            ].TourProductPricingMaskapai
          }
          Close={() => setShowModalTourDetail(false)}
        ></ModalTourDetail>
      </IonContent>
      <IonFooter>
        <IonCard className="ion-no-margin ion-no-padding footerPrice">
          <IonGrid>
            <IonRow class="priceCollapse">
              <IonCol size="6">
                <IonText color="medium">Harga yang harus dibayar</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-right">
                <IonText>
                  <h5 className="ion-no-margin">
                    {GrandTotal !== 0
                      ? paymentRepaymentMethod !== 2
                        ? rupiah(GrandTotal + AddOnPrice + paymentFee)
                        : rupiah((GrandTotal + AddOnPrice) / 2 + paymentFee)
                      : rupiah(0)}
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
                  {TourProductDetail.TourProductModels.ProductTourName}
                </IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-right">
                <IonText color="medium">
                  {rupiah(TourBookingPriceTotal || 0)}
                </IonText>
              </IonCol>
              <IonCol size="8">
                <IonText color="medium">Layanan tambahan</IonText>
                {TourOrderAddOnNumber !== null
                  ? TourOrderAddOnNumber.map((item, index) => (
                      <IonText color="medium" className="d-block" key={index}>
                        ({item.number} x {item.name})
                      </IonText>
                    ))
                  : ""}
              </IonCol>
              <IonCol size="4" className="ion-text-right">
                <IonText color="medium">{rupiah(AddOnPrice || 0)}</IonText>
              </IonCol>
              <IonCol size="6">
                <IonText color="medium">Admin Fee</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-right">
                <IonText color="medium">
                  {paymentFee ? rupiah(paymentFee) : "-"}
                </IonText>
              </IonCol>
              {/* <IonCol size="6">
                <IonText color="medium">
                  Kode unik
                </IonText>
              </IonCol> */}
              {/* <IonCol size="6" className="ion-text-right">
                <IonText color="medium">
                  Rp 319
                </IonText>
              </IonCol> */}
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  className="text-transform-none"
                  size="large"
                  expand="block"
                  onClick={() => Pay()}
                >
                  Bayar
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      </IonFooter>
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
    TourBookingNumberOfAdult: state.tour.TourBookingNumberOfAdult,
    TourBookingNumberOfChild: state.tour.TourBookingNumberOfChild,
    TourBookingNumberOfInfant: state.tour.TourBookingNumberOfInfant,
    TourBookingNumberOfPaxTotal: state.tour.TourBookingNumberOfPaxTotal,
    TourBookingPriceTotal: state.tour.TourBookingPriceTotal,
    TourProductDetail: state.tour.TourProductDetail,
    TourProductPricingIndex: state.tour.TourProductPricingIndex,
    TourProductStartDate: state.tour.TourProductStartDate,
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: React.memo(withRouter(TourPayment)),
});
