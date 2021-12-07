import { HTTP } from "@ionic-native/http";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonModal,
  IonRippleEffect,
  IonRow,
  IonText,
  isPlatform,
} from "@ionic/react";
import React, { useState } from "react";
import { MainUrl } from "../../AppConfig";
import DefaultToolbar from "../shared/DefaultToolbar";

export default function HotelPaymentChoosePayment({
  UserData,
  setPaymentMethodSelected,
}: // TourProductAddOnList,
// TourBookingPriceTotal,
// SetAddOnPrice,
{
  UserData: any;
  setPaymentMethodSelected: any;
  // TourProductAddOnList: any;
  // TourBookingPriceTotal?: number;
  // SetAddOnPrice: any;
}) {
  const [ModalPayment, setModalPayment] = useState(false);
  const [PaymentMethodData, setPaymentMethodData] = useState<any>(null);
  const [Balance, setBalance] = useState<string>(UserData.balance || "0.00");
  // const [Balance, setBalance] = useState<string>("0.00");

  React.useEffect(() => {
    // if (localStorage.TourOrderAddOnNumber)
    //   setTourOrderAddOnNumber(JSON.parse(localStorage.TourOrderAddOnNumber));
    // setShowLoading(true);
    // getTimeLimit();
    // updateBalance();
    getPaymentMethod();
    // console.log(TourProductDetail);
  }, []);
  const getPaymentMethod = () => {
    if (PaymentMethodData === null) {
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("json");
        HTTP.post(
          MainUrl + "Payment/PaymentMethod?transType=HotelBooking",
          {},
          {}
        )
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
        fetch(MainUrl + "Payment/PaymentMethod?transType=HotelBooking", {
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
            failedAlert("KoneksHotelBookingi Anda Bermasalah");
          });
      }
    }
  };

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
  const [paymentPaymentMethod, setPaymentPaymentMethod] = useState<string>("");
  const [paymentFee, setPaymentFee] = useState<number>(0);
  const [paymentPaymentMethodCode, setPaymentPaymentMethodCode] =
    useState<string>("");
  const selectPaymentMethod = (Name, Code, Fee) => {
    setModalPayment(false);
    setPaymentMethodSelected({ Name: Name, Code: Code, Fee: Fee });
    setPaymentPaymentMethod(Name);
    setPaymentPaymentMethodCode(Code);
    setPaymentFee(Fee);
  };
  return (
    <>
      <IonText class="ion-padding">Metode Pembayaran</IonText>
      <IonCard
        className="ion-activatable ripple-parent ion-margin-bottom"
        onClick={() => setModalPayment(true)}
      >
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonText color="dark">
                  <h6>
                    <img
                      src={
                        "assets/img/payment/" +
                        paymentPaymentMethodCode +
                        ".png"
                      }
                      hidden={paymentPaymentMethodCode === "" ? true : false}
                      alt=""
                      height="24px"
                      className="ion-margin-end"
                    />
                    {paymentPaymentMethod !== ""
                      ? paymentPaymentMethod
                      : "Pilih metode pembayaran"}
                  </h6>
                  {/* <h6>{"Pilih metode pembayaran"}</h6> */}
                </IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                <IonText
                  color="primary"
                  hidden={paymentPaymentMethod === "" ? false : true}
                >
                  <b>Pilih</b>
                </IonText>
                <IonText
                  color="primary"
                  hidden={paymentPaymentMethod === "" ? true : false}
                >
                  <b>Ubah</b>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonRippleEffect></IonRippleEffect>
        </IonCardContent>
      </IonCard>
      {/* Modal Choose Payment */}
      <IonModal isOpen={ModalPayment}>
        <IonContent className="gray-bg">
          <DefaultToolbar
            title="Pilih Metode Pembayaran"
            color="primary"
            backButtonRoute={() => {
              setModalPayment(false);
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

                <IonText className="ion-margin" hidden={true}>
                  <small>
                    {PaymentMethodData
                      ? PaymentMethodData[1].PaymentMethod
                      : ""}
                  </small>
                </IonText>
                <IonCard
                  // hidden={PaymentMethodData !== null ? false : true}
                  hidden={true}
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
                        {/* <small>{TimeLimit}</small> */}
                        <small>5 menit lagi</small>
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
                                src={"assets/img/payment/" + item.code + ".png"}
                                alt=""
                                height="32px"
                                className="ion-margin-end"
                              />
                              <IonText>
                                <small>{item.description}</small>
                              </IonText>
                              <IonText slot="end" color="medium">
                                {/* <small>{TimeLimit}</small> */}

                                <small>5 menit lagi</small>
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
                <IonText className="ion-margin" hidden={true}>
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
                          hidden={true}
                          className="ion-activatable ripple-parent ion-margin-bottomoalah"
                        >
                          <IonCardContent>
                            <IonItem className="ion-no-padding ion-margin-bottom">
                              <img
                                src={"assets/img/payment/" + item.code + ".png"}
                                alt=""
                                height="32px"
                                className="ion-margin-end"
                              />
                              <IonText>
                                <small>{item.description}</small>
                              </IonText>
                              <IonText slot="end" color="medium">
                                {/* <small>{TimeLimit}</small> */}
                                <small>5 menit lagi</small>
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
    </>
  );
}
