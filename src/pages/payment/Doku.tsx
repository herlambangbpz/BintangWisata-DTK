import React, { useState } from "react";
import {
  IonAlert,
  IonContent,
  IonLoading,
  IonPage,
  isPlatform,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import { AppId, MainUrl } from "../../AppConfig";
import * as selectors from "../../data/selectors";
interface StateProps {
  UserData: any;
}
interface DispatchProps {}

interface DokuProps extends DispatchProps, StateProps, RouteComponentProps {}

const Doku: React.FC<DokuProps> = ({ UserData, history }) => {
  const [DokuLoaded, setDokuLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  React.useEffect(() => {
    var MyHeaders = {
      appid: AppId,
      RequestVerificationToken: UserData.requestVerificationToken,
    };
    var MyData = new FormData();
    MyData.append("AccToken", UserData.accessToken);

    MyData.append("amount", "");
    MyData.append("invoice", localStorage.getItem("TourOrderInvoice") || "");
    MyData.append("currency", "360");
    MyData.append("device_id", "PWA");
    MyData.append("pairing_code ", "");
    MyData.append("token ", "");
    if (isPlatform("cordova")) {
      // HTTP.setDataSerializer("multipart");
      // HTTP.post(MainUrl + "tour/Order", MyData, MyHeaders)
      //   .then((res) => {
      //     if (res.status !== 200) {
      //       failedAlert("Cek Koneksi Internet Anda");
      //     }
      //     return JSON.parse(res.data);
      //   })
      //   .then((res) => {
      //     if (res.StatusCode === 200 && res.Data.Allowed === true) {
      //       setShowLoading(false);
      //       localStorage.removeItem("RepaymentStatus");
      //       localStorage.setItem("TourOrderBookingCode", res.Data.bookingCode);
      //       localStorage.setItem("TourOrderInvoice", res.Data.Invoice);
      //       TourProductDetail.TourProductModels.ProductTourCategory ===
      //       "Reguler"
      //         ? res.Data.bookingCode === null || res.Data.bookingCode === ""
      //           ? history.push("/main/transactionList")
      //           : history.push(
      //               "/transactionHistoryDetail/" +
      //                 res.Data.bookingCode.replace(/\./g, "-")
      //             )
      //         : history.push("/tourPayment");
      //     } else {
      //       failedAlert(res.ErrorMessage);
      //       // history.push('/tourSearch');
      //     }
      //   })
      //   .catch((e) => {
      //     failedAlert(e.error);
      //     // failedAlert('Koneksi Anda Bermasalah')
      //   });
    } else {
      fetch(MainUrl + "Payment/doGenerateWords", {
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
          if (res.StatusCode === 200) {
            localStorage.setItem("dokuwords", res.Data.words);
            history.push("/payment/dokuform");
          } else {
            failedAlert(res.ErrorMessage);
          }
        })
        .catch((e) => {
          failedAlert("Koneksi Anda Bermasalah");
        });
    }
  }, []);
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      <IonContent>
        <div doku-div="form-payment" hidden={!DokuLoaded}></div>
        <div className="loadingData" hidden={DokuLoaded}>
          <img src="assets/icon/loading.svg" width="80px" />
          <br />
          Menuju Doku
        </div>
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

export default connect<{}, DispatchProps, StateProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
  }),
  component: React.memo(withRouter(Doku)),
});
