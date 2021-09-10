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
  IonPopover,
  IonAlert,
  IonLoading,
  isPlatform,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import "./Order.scss";
import * as selectors from "../../data/selectors";
import TourWizard from "../../components/TourWizard";
import TourOrderBuyerData from "../../components/TourOrderBuyerData";
import TourOrderOrderPerson from "../../components/TourOrderOrderPerson";
import TourOrderAddOn from "../../components/TourOrderAddOn";
import TourOrderSpecialRequest from "../../components/TourOrderSpecialRequest";
import { rupiah } from "../../helpers/currency";
import { DefaultAva } from "../../AppConfig";
import { AppId, MainUrl } from "../../AppConfig";
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
interface TourOrderProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const TourOrder: React.FC<TourOrderProps> = ({
  history,
  TourBookingPriceTotal,
  TourProductStartDate,
  TourProductDetail,
  TourProductPricingIndex,
  TourBookingNumberOfAdult,
  TourBookingNumberOfChild,
  TourBookingNumberOfInfant,
  TourBookingNumberOfPaxTotal,
  UserData,
}) => {
  const [submitWarning, setSubmitWarning] = useState(false);
  const [AddOnPrice, setAddOnPrice] = useState(
    localStorage.TourOrderAddOnPayNumber
      ? Number(localStorage.TourOrderAddOnPayNumber)
      : 0
  );
  const [GrandTotal, setGrandTotal] = useState(TourBookingPriceTotal || 0);

  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  React.useEffect(() => {
    let DataArray = new Array();
    const Adult = TourBookingNumberOfAdult || 0;
    const Child = TourBookingNumberOfChild || 0;
    const Infant = TourBookingNumberOfInfant || 0;
    for (let index = 0; index < Adult; index++) {
      DataArray.push("Dewasa " + (index + 1));
    }
    for (let index = 0; index < Child; index++) {
      DataArray.push("Anak " + (index + 1));
    }
    for (let index = 0; index < Infant; index++) {
      DataArray.push("Bayi " + (index + 1));
    }
    if (localStorage.TourOrderPaxData !== JSON.stringify(DataArray)) {
      localStorage.setItem("TourOrderPaxData", JSON.stringify(DataArray));
      const PaxFullDataArray = new Array();
      for (let index = 0; index < DataArray.length; index++) {
        const PaxMaturity: string = DataArray[index];
        // if(DataArray[index].t)
        PaxFullDataArray.push({
          PaxMaturity: PaxMaturity.includes("Bayi")
            ? "Infant"
            : PaxMaturity.includes("Anak")
            ? "Child"
            : "Adult",
          PaxTitel: "",
          PaxFirstName: "",
          PaxLastName: "",
          PaxNation: "",
          PaxBirthday: "",
          PaxPassportNumber: "",
          PaxPassportPublishDate: "",
          PaxPassportPublishCountry: "",
          PaxPassportExpiredDate: "",
        });
      }
      localStorage.setItem(
        "TourOrderPaxFullData",
        JSON.stringify(PaxFullDataArray)
      );
    }
  }, [
    TourBookingNumberOfAdult,
    TourBookingNumberOfChild,
    TourBookingNumberOfInfant,
  ]);
  React.useEffect(() => {
    const TempPrice = TourBookingPriceTotal || 0;
    setGrandTotal(TempPrice + AddOnPrice);
  }, [TourBookingPriceTotal, AddOnPrice]);
  const OrderValidation = () => {
    if (!localStorage.TourOrderOrderPerson) {
      failedAlert("Mohon melengkapi Data Pemesan");
      return false;
    }
    const TOPFD = localStorage.TourOrderPaxFullData
      ? JSON.parse(localStorage.TourOrderPaxFullData)
      : undefined;
    if (TOPFD) {
      for (let index = 0; index < TOPFD.length; index++) {
        if (TOPFD[index].PaxTitel.length < 2) {
          failedAlert(`Mohon melengkapi Data Penumpang ${index + 1}`);
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  };
  const OrderSubmit = () => {
    setSubmitWarning(false);
    setShowLoading(true);
    if (OrderValidation() === false) {
      return;
    }
    const TOPFD = localStorage.TourOrderPaxFullData
      ? JSON.parse(localStorage.TourOrderPaxFullData)
      : undefined;
    const TOAON = localStorage.TourOrderAddOnNumber
      ? JSON.parse(localStorage.TourOrderAddOnNumber)
      : undefined;
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = new FormData();
    MyData.append("AccToken", UserData.accessToken);
    MyData.append(
      "tourBookingDetailModels.TourBookingContactTitle",
      JSON.parse(localStorage.TourOrderOrderPerson).OrderPersonTitel
    );
    MyData.append(
      "tourBookingDetailModels.TourBookingContactName",
      JSON.parse(localStorage.TourOrderOrderPerson).OrderPersonFullName
    );
    MyData.append(
      "tourBookingDetailModels.nation_pemesan",
      JSON.parse(localStorage.TourOrderOrderPerson).OrderPersonNationCode
    );
    MyData.append(
      "tourBookingDetailModels.nohp_pemesan",
      JSON.parse(localStorage.TourOrderOrderPerson).OrderPersonPhoneNumber
    );
    MyData.append(
      "tourBookingDetailModels.TourBookingContactEmail",
      JSON.parse(localStorage.TourOrderOrderPerson).OrderPersonEmail
    );
    MyData.append(
      "tourBookingDetailModels.TourBookingSpecialRequest",
      localStorage.TourOrderSpecialRequest || null
    );
    if (TOPFD) {
      for (let index = 0; index < TOPFD.length; index++) {
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestMaturity`,
          TOPFD[index].PaxMaturity
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestFirstName`,
          TOPFD[index].PaxFirstName
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestLastName`,
          TOPFD[index].PaxLastName
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestTitle`,
          TOPFD[index].PaxTitel
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestNationality`,
          TOPFD[index].PaxNation
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestBirthOfDate`,
          TOPFD[index].PaxBirthday
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestPassportNumber`,
          TOPFD[index].PaxPassportNumber
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestPassportIssuedDate`,
          TOPFD[index].PaxPassportPublishDate
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestIssuedCountry`,
          TOPFD[index].PaxPassportPublishCountry
        );
        MyData.append(
          `TourBookingGuestList[${index}].TourBookingGuestExpiryDate`,
          TOPFD[index].PaxPassportExpiredDate
        );
      }
    }
    if (TOAON) {
      for (let index = 0; index < TOAON.length; index++) {
        MyData.append(
          `tourBookingAddOnList[${index}].AddOnId`,
          TOAON[index].id
        );
        MyData.append(
          `tourBookingAddOnList[${index}].NumberOfAddOn`,
          TOAON[index].number
        );
      }
    }
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "tour/Order", MyData, MyHeaders)
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Cek Koneksi Internet Anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200 && res.Data.Allowed === true) {
            setShowLoading(false);
            localStorage.setItem("TourOrderBookingCode", res.Data.bookingCode);
            history.push("/tourPayment");
          } else {
            failedAlert(res.ErrorMessage);
            // history.push('/tourSearch');
          }
        })
        .catch((e) => {
          failedAlert(e.error);
          // failedAlert('Koneksi Anda Bermasalah')
        });
    } else {
      fetch(MainUrl + "tour/Order", {
        method: "POST",
        headers: MyHeaders,
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
            localStorage.setItem("TourOrderBookingCode", res.Data.bookingCode);
            history.push("/tourPayment");
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
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tourBookingSeriesSelectPax"></IonBackButton>
          </IonButtons>
          <IonTitle>Isi Data</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="TourOrder">
        <TourWizard
          WizardIndex={1}
          TourProductStartDate={TourProductStartDate}
          TourProductDetail={TourProductDetail}
          TourBookingNumberOfPaxTotal={TourBookingNumberOfPaxTotal}
          TourProductPricingIndex={TourProductPricingIndex}
        ></TourWizard>
        {/* Login As */}
        <IonGrid className="white-bg ion-padding ion-margin-bottom">
          <IonRow>
            <IonCol size="2" className="avatar">
              <img src={UserData.photo || DefaultAva} alt="" />
            </IonCol>
            <IonCol>
              <div>
                <IonText>
                  <p className="ion-no-margin">Login sebagai {UserData.name}</p>
                </IonText>
                <IonText color="medium">
                  <p className="ion-no-margin"> {UserData.email}</p>
                </IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <TourOrderOrderPerson
          name={UserData.name}
          email={UserData.email}
        ></TourOrderOrderPerson>
        <TourOrderBuyerData
          domesticTourType={
            TourProductDetail.TourProductModels.ProductTourTourType ===
            "Internasional"
              ? false
              : true
          }
        ></TourOrderBuyerData>
        <TourOrderAddOn
          TourProductAddOnList={TourProductDetail.TourProductAddOnList}
          TourBookingPriceTotal={TourBookingPriceTotal}
          SetAddOnPrice={setAddOnPrice}
        ></TourOrderAddOn>
        <TourOrderSpecialRequest></TourOrderSpecialRequest>
      </IonContent>
      <IonPopover
        cssClass="ion-padding"
        isOpen={submitWarning}
        onDidDismiss={(e) => setSubmitWarning(false)}
      >
        <div className="ion-padding">
          <IonText>
            <h6>
              <b>Apakah pesanan Anda benar?</b>
            </h6>
          </IonText>
          <IonText color="medium">
            <p>
              Detail pesanan tidak dapat diubah setelah melanjutkan ke halaman
              pembayaran. Tetap lanjutkan?
            </p>
          </IonText>
          <IonButton
            color="primary"
            size="large"
            className="text-transform-none"
            expand="block"
            onClick={() => OrderSubmit()}
          >
            Ya, lanjutkan
          </IonButton>
          <IonButton
            color="medium"
            size="large"
            className="text-transform-none"
            expand="block"
            onClick={() => setSubmitWarning(false)}
          >
            Periksa Kembali
          </IonButton>
        </div>
      </IonPopover>
      <IonFooter>
        <IonCard className="ion-no-margin ion-no-padding footerPrice">
          <IonGrid>
            <IonRow>
              <IonCol size="7">
                <IonText color="medium">
                  <small>
                    Harga yang harus dibayar ({TourBookingNumberOfPaxTotal} pax)
                  </small>
                </IonText>
                <IonText>
                  <h4 className="ion-no-margin">{rupiah(GrandTotal || 0)}</h4>
                </IonText>
              </IonCol>
              <IonCol size="5">
                <IonButton
                  expand="block"
                  className="text-transform-none"
                  onClick={() => setSubmitWarning(true)}
                >
                  Beli Sekarang
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
  component: React.memo(withRouter(TourOrder)),
});
