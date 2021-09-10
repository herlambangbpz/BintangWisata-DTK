import React, { useState, useRef } from "react";
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
  IonItem,
  IonLabel,
  IonDatetime,
  IonItemDivider,
  isPlatform,
  IonAlert,
} from "@ionic/react";
import {
  calendarOutline,
  timerOutline,
  chevronBackOutline,
  chevronDown,
  chevronUp,
  chevronForward,
  chevronForwardOutline,
} from "ionicons/icons";
import { RouteComponentProps, withRouter } from "react-router";
import { useParams } from "react-router-dom";
import { connect } from "../../data/connect";
import "./HistoryList.scss";
import { AppId, MainUrl } from "../../AppConfig";
import * as selectors from "../../data/selectors";
import { cSharpDateCovert } from "../../helpers/datetime";
import ModalTourDetailPartial from "../../components/ModalTourDetailPartial";

import HistoryDetailTourDetail from "../../components/shared/DefaultToolbar";
import {
  getHistoryTransactionCtaLabel,
  getHistoryTransactionCtaTarget,
  getHistoryTransactionIcon,
  getHistoryTransactionStatusColor,
  getHistoryTransactionStatusName,
} from "../../helpers/HistoryTransaction";
import { rupiah } from "../../helpers/currency";
import { HTTP } from "@ionic-native/http";
import { AppName } from "../../AppConfig";
interface OwnProps {}
interface StateProps {
  UserData: any;
}
interface DispatchProps {}
interface EcommerceHistoryDetailProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}

const EcommerceHistoryDetail: React.FC<EcommerceHistoryDetailProps> = ({
  history,
  UserData,
}) => {
  const parameters: any = useParams();
  const [hiddenCollapse, setHiddenCollapse] = useState<boolean>(true);
  const [iconCollapse, setIconCollapse] = useState<string>(chevronDown);
  const [TransactionHistoryDetail, setTransactionHistoryDetail] =
    useState<any>(null);
  const [AdultPaxTotal, setAdultPaxTotal] = useState<number>(0);
  const [ChildPaxTotal, setChildPaxTotal] = useState<number>(0);
  const [InfantPaxTotal, setInfantPaxTotal] = useState<number>(0);
  const [AdultPrice, setAdultPrice] = useState<number>(0);
  const [ChildPrice, setChildPrice] = useState<number>(0);
  const [InfantPrice, setInfantPrice] = useState<number>(0);

  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  const [showModalTourDetail, setShowModalTourDetail] = useState(false);
  // React.useState(()=>{
  //   setTransactionHistoryDetail(null)
  //   var MyData = new FormData();
  //   MyData.append("AccToken", UserData.accessToken);
  //   MyData.append("id_order", parameters.inv.replace(/-/g, '.'));
  //   if(isPlatform('cordova')){
  //     HTTP.setDataSerializer('multipart');
  //     HTTP.post(MainUrl+'Member/OrderDetail',MyData,{'appid':AppId,'RequestVerificationToken': UserData.requestVerificationToken})
  //     .then(res => {
  //       if(res.status!==200){
  //         failedAlert('Cek Koneksi Internet Anda');
  //         // history.push('/transactionHistoryList')
  //       }
  //       return JSON.parse(res.data)
  //     })
  //     .then(res=>{
  //       if(res.StatusCode===200){
  //         setTransactionHistoryDetail(res.Data);
  //         res.Data.guestModels.forEach(item => {
  //           if(item.TourBookingGuestMaturity==='Adult'){
  //             setAdultPaxTotal(AdultPaxTotal+1)
  //             setAdultPrice(item.TourBookingGuestPrice)
  //           }else if(item.TourBookingGuestMaturity==='Child'){
  //             setChildPaxTotal(ChildPaxTotal+1)
  //             setChildPrice(item.TourBookingGuestPrice)
  //           }else if(item.TourBookingGuestMaturity==='Infant'){
  //             setInfantPaxTotal(InfantPaxTotal+1)
  //             setInfantPrice(item.TourBookingGuestPrice)
  //           }
  //         });
  //       }else{
  //         failedAlert('Data Histori Transaksi tidak ditemukan');
  //         // history.push('/transactionHistoryList')
  //       }
  //     })
  //     .catch(e=>{
  //       failedAlert(e.error);
  //       // history.push('/transactionHistoryList')
  //     })
  //   }else{
  //     fetch(MainUrl+'Member/OrderDetail',{
  //       method:'POST',
  //       body:MyData,
  //       headers: {'appid':AppId,'RequestVerificationToken': UserData.requestVerificationToken}
  //     })
  //     // Check Connection
  //     .then(res => {
  //       if(!res.ok){
  //         failedAlert('Periksa Koneksi anda');
  //         history.push('/transactionHistoryList')
  //       }
  //       return res.json();
  //     })
  //     .then(res=>{
  //       if(res.StatusCode===200){
  //         setTransactionHistoryDetail(res.Data);
  //         res.Data.guestModels.forEach(item => {
  //           if(item.TourBookingGuestMaturity==='Adult'){
  //             setAdultPaxTotal(AdultPaxTotal+1)
  //             setAdultPrice(item.TourBookingGuestPrice)
  //           }else if(item.TourBookingGuestMaturity==='Child'){
  //             setChildPaxTotal(ChildPaxTotal+1)
  //             setChildPrice(item.TourBookingGuestPrice)
  //           }else if(item.TourBookingGuestMaturity==='Infant'){
  //             setInfantPaxTotal(InfantPaxTotal+1)
  //             setInfantPrice(item.TourBookingGuestPrice)
  //           }
  //         });
  //       }else{
  //         failedAlert('Data Histori Transaksi tidak ditemukan');
  //         history.push('/transactionHistoryList')
  //       }
  //     })
  //     .catch(e=>{
  //       failedAlert('Data Histori Transaksi tidak ditemukan');
  //       history.push('/transactionHistoryList')
  //     })
  //   }
  // })
  const toggleCollapse = () => {
    if (hiddenCollapse === false) {
      setHiddenCollapse(true);
      setIconCollapse(chevronDown);
    } else {
      setHiddenCollapse(false);
      setIconCollapse(chevronUp);
    }
  };
  const failedAlert = (errorMessage: string) => {
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/transactionHistoryList"
              icon={chevronBackOutline}
            ></IonBackButton>
          </IonButtons>
          <IonTitle className="ion-no-padding">
            {/* {TransactionHistoryDetail.ProductTourName} */}
            INV20202010
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="gray-bg">
        <IonCard className="ion-p-8 ion-margin-bottom">
          <IonGrid>
            <IonRow className="ion-mb-8">
              <IonCol>
                {/* <IonText color={getHistoryTransactionStatusColor(TransactionHistoryDetail.TourBookingStatus,'tour')}>
                    Status: {getHistoryTransactionStatusName(TransactionHistoryDetail.TourBookingStatus,'tour')}</IonText> */}
                <IonText color="success">Status: Berhasil</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="medium">Tanggal pembelian</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                {/* <IonText color="medium">{cSharpDateCovert(TransactionHistoryDetail.TourBookingTransactionDate)}</IonText> */}
                <IonText color="medium">Min, 23 Nov 2020</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8">
              <IonCol>
                <IonText color="medium">Metode pelunasan</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                {/* <IonText color="medium">Bayar {TransactionHistoryDetail.payment_type}</IonText> */}
                <IonText color="medium">VA Mandiri</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-mb-8" onClick={() => toggleCollapse()}>
              <IonCol>
                <IonText color="medium">Total pembelian</IonText>
              </IonCol>
              <IonCol className="ion-text-right">
                {/* <IonText color="dark">{rupiah(TransactionHistoryDetail.TourBookingPrice)}</IonText> */}
                <IonText color="dark">Rp 105.000</IonText>
                <IonIcon
                  icon={iconCollapse}
                  color="primary"
                  className="ion-margin-start"
                ></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonGrid hidden={hiddenCollapse} className="bt-lightgray-1">
            <IonRow>
              <IonCol>
                <IonRow className="ion-mb-8">
                  <IonCol>
                    <IonText color="medium">Harga Produk</IonText>
                  </IonCol>
                  <IonCol className="ion-text-right">
                    {/* <IonText color="medium">{AdultPaxTotal===0?0:`${AdultPaxTotal} X ${rupiah(AdultPrice)}`}</IonText> */}
                    <IonText color="medium">Rp 100.000</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-mb-8">
                  <IonCol size="8">
                    <IonText style={{ "font-size": "10px" }} color="medium">
                      Ongkos Kirim - JNE Reguler (1 Kg)
                    </IonText>
                  </IonCol>
                  <IonCol className="ion-text-right">
                    {/* <IonText color="medium">{ChildPaxTotal===0?0:`${ChildPaxTotal} X ${rupiah(AdultPrice)}`}</IonText> */}
                    <IonText color="medium">Rp 100.000</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-mb-8">
                  <IonCol>
                    <IonText color="medium">Voucher</IonText>
                  </IonCol>
                  <IonCol className="ion-text-right">
                    {/* <IonText color="medium">{InfantPaxTotal===0?0:`${InfantPaxTotal} X ${rupiah(InfantPrice)}`}</IonText> */}
                    <IonText color="medium">- Rp 5.000</IonText>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* <IonButton expand="block"
              disabled={getHistoryTransactionCtaTarget(TransactionHistoryDetail.TourBookingStatus,'tour')===''?true:false}
              onClick={()=>{
                if(getHistoryTransactionCtaTarget(TransactionHistoryDetail.TourBookingStatus,'tour')){
                  history.push(getHistoryTransactionCtaTarget(TransactionHistoryDetail.TourBookingStatus,'tour'))
                }}}>
              {getHistoryTransactionCtaLabel(TransactionHistoryDetail.TourBookingStatus,'tour')}
              </IonButton> */}
          <IonGrid className="bt-lightgray-1">
            <IonButton expand="block">
              CTA GOAL UTAMA (TERGANTUNG STATUS)
            </IonButton>
          </IonGrid>
        </IonCard>
        {/* <p><br/></p>
          <IonText className="ion-margin">
            <small><b>Detail Produk</b></small>
          </IonText>
          <IonGrid className="ion-margin-top white-bg ion-padding" onClick={()=>{setShowModalTourDetail(true)}}>
            <IonRow className="ion-align-items-center">
              <IonCol size="1">
                <img src={getHistoryTransactionIcon('tour')} alt="" width="48px"/>
              </IonCol>
              <IonCol className="ion-pl-10">
                <IonText color="dark"><small>{TransactionHistoryDetail.ProductTourName}</small></IonText>
                <br/>
                <IonText color="medium" hidden={true}><small>Ulasan terkirim</small></IonText>
              </IonCol>
              <IonCol size="1">
                <IonIcon icon={chevronForwardOutline} color="primary" size="large"></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid> */}

        <p>
          <br />
        </p>
        <IonText className="ion-margin">
          <small>
            <b>Atur Pesanan</b>
          </small>
        </IonText>
        <IonGrid className="ion-margin-top white-bg">
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonText color="dark">
                <small>Lanjutkan pembayaran</small>
              </IonText>
            </IonCol>
            <IonCol size="2" className="ion-text-right">
              <IonIcon
                icon={chevronForwardOutline}
                color="medium"
                size="large"
              ></IonIcon>
            </IonCol>
          </IonRow>
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonText color="dark">
                <small>Lihat invoice 1</small>
              </IonText>
            </IonCol>
            <IonCol size="2" className="ion-text-right">
              <IonIcon
                icon={chevronForwardOutline}
                color="medium"
                size="large"
              ></IonIcon>
            </IonCol>
          </IonRow>
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonText color="dark">
                <small>Lihat E-Voucher</small>
              </IonText>
            </IonCol>
            <IonCol size="2" className="ion-text-right">
              <IonIcon
                icon={chevronForwardOutline}
                color="medium"
                size="large"
              ></IonIcon>
            </IonCol>
          </IonRow>
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonText color="dark">
                <small>Batalkan Pesanan</small>
              </IonText>
            </IonCol>
            <IonCol size="2" className="ion-text-right">
              <IonIcon
                icon={chevronForwardOutline}
                color="medium"
                size="large"
              ></IonIcon>
            </IonCol>
          </IonRow>
        </IonGrid>

        <p>
          <br />
        </p>
        <IonText className="ion-margin">
          <small>
            <b>Hubungi {AppName}</b>
          </small>
        </IonText>
        <IonGrid className="ion-margin-top white-bg ion-padding ion-margin-bottom">
          <IonRow className="ion-align-items-center">
            <IonCol size="12">
              <IonText>
                <small>No. Pesanan</small>
              </IonText>
            </IonCol>
            <IonCol size="12">
              <p color="medium">
                <small>
                  Customer service kami akan menanyakan No. Pesanan tersebut
                  saat Anda menghubungi kami
                </small>
              </p>
            </IonCol>
            <IonCol size="12">
              <IonText color="primary">
                <b>HUBUNGI KAMI</b>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        <p>
          <br />
        </p>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="alert"
          header={headerAlert}
          message={messageAlert}
          buttons={["OK"]}
        />
        {/* <ModalTourDetailPartial
          ShowModal={showModalTourDetail}
          CloseModalFunction={()=>setShowModalTourDetail(false)}
          Name={TransactionHistoryDetail.ProductTourName}
          Date={cSharpDateCovert(TransactionHistoryDetail.TourProductPricingTanggal)}
          Duration={TransactionHistoryDetail.TourProductDuration}
          Airlines={TransactionHistoryDetail.TourProductPricingMaskapai}
          Country={TransactionHistoryDetail.ProductTourCountry}
          TourCategory={TransactionHistoryDetail.TourProductPricingTourCategoryProduct}
          Activity={TransactionHistoryDetail.ProductTourActivity}
          GuideLeanguage={TransactionHistoryDetail.ProductTourTourGuideLanguage}
          Image={TransactionHistoryDetail.TourProductImageList.length > 0 ? TransactionHistoryDetail.TourProductImageList[0].TPImageImagePath:''}
        ></ModalTourDetailPartial> */}
      </IonContent>
    </IonPage>
  );
};
export default connect<EcommerceHistoryDetailProps>({
  mapStateToProps: (state) => ({
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: withRouter(EcommerceHistoryDetail),
});
