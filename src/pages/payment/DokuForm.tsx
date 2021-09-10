import React, { useRef, useState } from "react";
import {
  IonAlert,
  IonContent,
  IonLoading,
  IonPage,
  isPlatform,
} from "@ionic/react";
import { connect } from "../../data/connect";
import { AppId, MainUrl } from "../../AppConfig";
import * as selectors from "../../data/selectors";
import { Helmet } from "react-helmet";
import $ from "jquery";

declare var getForm;
// A $( document ).ready() block.
$(function () {
  var data = new Object();
  data["req_merchant_code"] = "9164";
  data["req_chain_merchant"] = "NA";
  data["req_payment_channel"] = "15";
  data["req_server_url"] =
    "https://m.dutatravel.net/api/Payment/doPaymentRequest";
  data["req_transaction_id"] = "full_" + new Date().getTime();
  data["req_amount"] = "10000.00";
  data["req_currency"] = "360";
  data["req_words"] = localStorage.getItem("dokuwords");
  data["req_session_id"] = new Date().getTime();
  data["req_form_type"] = "full";
  data["req_customer_id"] = "";
  data["req_token_payment"] = "";
  // console.log(data);
  getForm(data);
});
// $(document).ready(function () {
// var data = new Object();
// var data = {
//   req_merchant_code: "9164",
//   req_chain_merchant: "NA",
//   req_payment_channel: "15",
//   req_server_url: "https://m.dutatravel.net/api/Payment/doPaymentRequest",
//   req_transaction_id: "full_" + new Date().getTime(),
//   req_amount: "10000.00",
//   req_currency: "360",
//   req_words: localStorage.getItem("dokuwords"),
//   req_session_id: new Date().getTime(),
//   req_form_type: "full",
//   req_customer_id: "",
//   req_token_payment: "",
// };
// console.log(data);
// getForm(data);
// const DokuFormBuild = (words: string) => {
//   // setDokuLoaded(true);
//   const getDokuForm = (data: any) => {
//     getForm(data);
//   };
// };
// });
interface StateProps {
  UserData: any;
}
interface DispatchProps {}

interface DokuProps extends DispatchProps, StateProps {}

const DokuForm: React.FC<DokuProps> = ({ UserData }) => {
  const [DokuLoaded, setDokuLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  // var data = {
  //   req_merchant_code: "9164",
  //   req_chain_merchant: "NA",
  //   req_payment_channel: "15",
  //   req_server_url: "https://m.dutatravel.net/api/Payment/doPaymentRequest",
  //   req_transaction_id: "full_" + new Date().getTime(),
  //   req_amount: "10000.00",
  //   req_currency: "360",
  //   req_words: localStorage.getItem("dokuwords"),
  //   req_session_id: new Date().getTime(),
  //   req_form_type: "full",
  //   req_customer_id: "",
  //   req_token_payment: "",
  // };
  // console.log(data);

  // getForm(data);

  // const DokuFormBuild = (words: string) => {
  //   setDokuLoaded(true);
  //   const getDokuForm = (data: any) => {
  //     getForm(data);
  //   };
  // let data = new Object();

  // data.req_merchant_code = "9164"; //mall id or merchant id
  // data.req_chain_merchant = "NA"; //chain merchant id
  // data.req_payment_channel = "15"; //payment channel
  // data.req_server_url = "./paymentDoku_CreditCard.php"; //merchant payment url to receive pairing code & token
  // data.req_transaction_id = "full_1612851771"; //invoice no
  // data.req_amount = "10000.00";
  // data.req_currency = "360"; //360 for IDR
  // data.req_words = words; //your merchant unique key
  // data.req_session_id = new Date().getTime(); //your server timestamp
  // data.req_form_type = "full";
  // data.req_customer_id = "";
  // data.req_token_payment = "";
  // getForm(data);

  // console.log(data);

  // getDokuForm(data);
  // };
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      <IonContent>
        <Helmet>
          <style>
            {/* @import
              "https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css";
              @import "https://staging.doku.com/doku-js/assets/css/doku.css"; */}
            @import
            url(https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css);
            @import url(https://staging.doku.com/doku-js/assets/css/doku.css);
          </style>
          <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js"></script>
          <script src="https://staging.doku.com/doku-js/assets/js/doku.js"></script>
        </Helmet>
        <div doku-div="form-payment" hidden={DokuLoaded}></div>
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
  component: DokuForm,
});
