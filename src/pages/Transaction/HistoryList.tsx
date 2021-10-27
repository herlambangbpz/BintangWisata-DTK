import React, { useState } from "react";
import {
  IonContent,
  IonIcon,
  IonText,
  IonModal,
  IonAlert,
  IonLoading,
  IonToolbar,
  IonPopover,
  IonItem,
  IonSearchbar,
  IonPage,
  IonHeader,
  IonCard,
  IonLabel,
  IonDatetime,
  IonCol,
  IonCardContent,
  IonButton,
  IonRow,
  IonGrid,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonCheckbox,
  IonFooter,
  IonButtons,
  isPlatform,
} from "@ionic/react";
import { funnel, filter, chevronBackOutline } from "ionicons/icons";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

import { RouteComponentProps, withRouter } from "react-router";
import DefaultToolbar from "../../components/shared/DefaultToolbar";
import TransactionHistoryItem from "../../components/TransactionHistoryItem";
import { connect } from "../../data/connect";
import "./HistoryList.scss";
import { AppId, MainUrl } from "../../AppConfig";
import { cSharpDateCovert, monthNameIndonesia } from "../../helpers/datetime";
import { HTTP } from "@ionic-native/http";
import Lottie from "lottie-react";
import loadingLottie from "../../Lotties/loading_4463.json";

interface OwnProps {
  id: string;
}
interface StateProps {
  requestVerificationToken?: string;
  accessToken?: string;
}
interface DispatchProps {}
interface SearchProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Search: React.FC<SearchProps> = ({
  history,
  requestVerificationToken,
  accessToken,
}) => {
  // datepicker
  const today: Date = new Date();
  const tomorrow: Date = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    today.toISOString()
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    tomorrow.toISOString()
  );
  // alert
  const changeStartDate = (value: string) => {
    const startDate: Date = new Date(value);
    const endDate: Date = new Date(selectedEndDate);
    if (endDate <= startDate) {
      setHeaderAlert("Gagal Memilih Tanggal");
      setMessageAlert("Tanggal Kembali harus lebih dari Tanggal Berangkat");
      setShowAlert(true);
    } else {
      setSelectedStartDate(value);
    }
  };
  const changeEndDate = (value: string) => {
    const endDate: Date = new Date(value);
    const startDate: Date = new Date(selectedStartDate);
    if (endDate <= startDate) {
      setHeaderAlert("Gagal Memilih Tanggal");
      setMessageAlert("Tanggal Kembali harus lebih dari Tanggal Berangkat");
      setShowAlert(true);
    } else {
      setSelectedEndDate(value);
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string>("biff");
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingLogout, setShowLoadingLogout] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const [TransactionList, setTransactionList] = useState<any>("pending");
  const [LimitedTransactionList, setLimitedTransactionList] = useState<any>([]);
  const [PageFrom, setPageFrom] = useState(0);
  const [PageTo, setPageTo] = useState(10);
  const [TransactionListBuyingDate, setTransactionListBuyingDate] =
    useState<any>(null);
  React.useEffect(() => {
    setShowLoading(true);
    const myHeaders = {
      appid: AppId,
      RequestVerificationToken: requestVerificationToken || "",
    };
    if (isPlatform("cordova")) {
      HTTP.get(
        MainUrl +
          "member/ProfileEdit?AccToken=" +
          accessToken +
          "&profilType=transaksi",
        {},
        myHeaders
      )
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Cek Koneksi Internet Anda");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            if (res.Data.transactionList.length) {
              const Transactions = res.Data.transactionList;
              Transactions.forEach((item) => {
                const buyingDate = new Date(
                  parseInt(item.buyingDate.replace(/[^0-9 +]/g, ""))
                );
                item.DateBuyingString = `${monthNameIndonesia(
                  buyingDate.getMonth()
                )} ${buyingDate.getFullYear()}`;
              });
              const TransactionsBuyingDate = new Array();
              Transactions.forEach((item) => {
                if (
                  TransactionsBuyingDate.includes(item.DateBuyingString) ===
                  false
                )
                  TransactionsBuyingDate.push(item.DateBuyingString);
              });
              setTransactionListBuyingDate(TransactionsBuyingDate);
              setTransactionList(Transactions);
              loadMore(Transactions);
              setShowLoading(false);
            } else {
              setTransactionList(null);
            }
          } else {
            setTransactionList(null);
          }
        })
        .catch((error) => {
          failedAlert(error);
        });
    } else {
      fetch(
        MainUrl +
          "member/ProfileEdit?AccToken=" +
          accessToken +
          "&profilType=transaksi",
        {
          headers: myHeaders,
        }
      )
        // Check Connection
        .then((res) => {
          if (!res.ok) {
            failedAlert("Periksa Koneksi Internet");
          }
          return res.json();
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            if (res.Data.transactionList.length) {
              const Transactions = res.Data.transactionList;
              Transactions.forEach((item) => {
                const buyingDate = new Date(
                  parseInt(item.buyingDate.replace(/[^0-9 +]/g, ""))
                );
                item.DateBuyingString = `${monthNameIndonesia(
                  buyingDate.getMonth()
                )} ${buyingDate.getFullYear()}`;
              });
              const TransactionsBuyingDate = new Array();
              Transactions.forEach((item) => {
                if (
                  TransactionsBuyingDate.includes(item.DateBuyingString) ===
                  false
                )
                  TransactionsBuyingDate.push(item.DateBuyingString);
              });
              setTransactionListBuyingDate(TransactionsBuyingDate);
              setTransactionList(Transactions);
              loadMore(Transactions);
              setShowLoading(false);
            } else {
              setTransactionList(null);
            }
          } else {
            setTransactionList(null);
          }
        })
        .catch((error) => {
          failedAlert(error);
        });
    }
  }, []);
  const failedAlert = (errorMessage: string) => {
    setShowLoadingLogout(false);
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const loadMore = (data?: any) => {
    if (data.length > PageTo) {
      setLimitedTransactionList([
        ...LimitedTransactionList,
        ...data.slice(PageFrom, PageTo),
      ]);
      setPageFrom(PageFrom + 10);
      setPageTo(PageTo + 10);
    } else {
      if (data.length > 10) {
        alert("Semua Data Transaksi Sudah Muncul");
      } else {
        setLimitedTransactionList([
          ...LimitedTransactionList,
          ...data.slice(PageFrom, PageTo),
        ]);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <DefaultToolbar
          title="Riwayat Pesanan"
          color="primary"
          backButtonRoute="/main/transactionList"
        />
        <IonToolbar color="light" className="ion-text-center">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonText color="medium">
                  <small>Menampilkan riwayat pesanan dalam </small>
                </IonText>
                <IonText color="primary">
                  <small>90 hari terakhir.</small>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="history-list ion-margin-bottom">
        <IonGrid className="serachTourList ion-no-padding">
          <IonRow className="ion-margin-bottom ">
            <IonCol size="12" className="ion-padding ion-pb-80">
              {TransactionList === null ? (
                <IonText className="ion-text-center">
                  Transaksi tidak ditemukan
                </IonText>
              ) : TransactionList === "pending" ? (
                <div className="ion-text-center">
                  <Lottie animationData={loadingLottie} />
                  <IonText>Proses pengambilan data transaksi</IonText>
                </div>
              ) : (
                ""
              )}
              {/* {TransactionList !== null && TransactionList !== "pending"
                ? TransactionListBuyingDate.map((item: any, index: any) => {
                    return (
                      <div key={index}>
                        <IonText>
                          <p>
                            <b>{item}</b>
                          </p>
                        </IonText>
                        {LimitedTransactionList.map(
                          (transaction: any, transactionIndex: any) => {
                            return (
                              <TransactionHistoryItem
                                key={transactionIndex}
                                TransactionID={transaction.transactionID}
                                ProductCategory={transaction.productCategory}
                                TransactionCode={transaction.transactionCode}
                                Price={transaction.price}
                                ProductName={transaction.productName}
                                Status={transaction.status}
                              />
                            );
                          }
                        )}
                        <IonButton
                          onClick={() => loadMore(TransactionList)}
                          className="text-transform-none"
                          expand="block"
                          hidden={
                            TransactionList !== null &&
                            TransactionList !== "pending"
                              ? false
                              : true
                          }
                        >
                          Tampilkan Lebih Banyak
                        </IonButton>
                      </div>
                    );
                  })
                : ""} */}
              {LimitedTransactionList.map(
                (transaction: any, transactionIndex: any) => {
                  return (
                    <TransactionHistoryItem
                      key={transactionIndex}
                      TransactionID={transaction.transactionID}
                      ProductCategory={transaction.productCategory}
                      TransactionCode={transaction.transactionCode}
                      Price={transaction.price}
                      ProductName={transaction.productName}
                      Status={transaction.status}
                      BuyingDate={transaction.buyingDate}
                    />
                  );
                }
              )}
              <IonButton
                onClick={() => loadMore(TransactionList)}
                className="text-transform-none"
                expand="block"
                hidden={
                  TransactionList !== null &&
                  TransactionList !== "pending" &&
                  TransactionList.length > 10
                    ? false
                    : true
                }
              >
                Tampilkan Lebih Banyak
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonCard
          className="tourSearchFilterSort"
          onClick={() => setShowModal(true)}
        >
          <IonCardContent>
            <IonRow>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={filter} color="primary"></IonIcon>
                <IonText color="primary">&nbsp; Urutkan</IonText>
              </IonCol>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={funnel} color="primary"></IonIcon>
                <IonText color="primary">&nbsp; Filter</IonText>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonModal isOpen={showModal}>
        <IonContent>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Pilih Tanggal</Typography>
            </AccordionSummary>
            <AccordionDetails className="MustNoPadding">
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonRadioGroup
                      value={selected}
                      onIonChange={(e) => setSelected(e.detail.value)}
                    >
                      <IonItem>
                        <IonLabel>90 hari terakhir</IonLabel>
                        <IonRadio slot="end" value="90days" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Bulan ini</IonLabel>
                        <IonRadio slot="end" value="1month" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Bulan lalu</IonLabel>
                        <IonRadio slot="end" value="pastmonth" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Pilih tanggal</IonLabel>
                        <IonRadio slot="end" value="customdate" />
                      </IonItem>
                    </IonRadioGroup>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel>Tanggal Berangkat</IonLabel>
                      <IonDatetime
                        displayFormat="DD MMMM YYYY"
                        value={selectedStartDate}
                        onIonChange={(e) => changeStartDate(e.detail.value!)}
                        doneText="Pilih"
                        cancelText="Batal"
                      ></IonDatetime>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel>Tanggal Kembali</IonLabel>
                      <IonDatetime
                        displayFormat="DD MMMM YYYY"
                        value={selectedEndDate}
                        onIonChange={(e) => changeEndDate(e.detail.value!)}
                        doneText="Pilih"
                        cancelText="Batal"
                      ></IonDatetime>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Tipe Produk</Typography>
            </AccordionSummary>
            <AccordionDetails className="MustNoPadding">
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonItem lines="full">
                      <img
                        slot="start"
                        src="assets/img/Services/Airplane.svg"
                        alt=""
                        width="24px"
                      />
                      <IonLabel slot="start">Pesawat</IonLabel>
                      <IonCheckbox slot="end" value="Airplane" />
                    </IonItem>
                    <IonItem lines="full">
                      <img
                        slot="start"
                        src="assets/img/Services/Hotel.svg"
                        alt=""
                        width="24px"
                      />
                      <IonLabel slot="start">Hotel</IonLabel>
                      <IonCheckbox slot="end" value="Hotel" />
                    </IonItem>
                    <IonItem lines="full">
                      <img
                        slot="start"
                        src="assets/img/Services/Tour.svg"
                        alt=""
                        width="24px"
                      />
                      <IonLabel slot="start">Tur</IonLabel>
                      <IonCheckbox slot="end" value="Tur" />
                    </IonItem>
                    <IonItem lines="full">
                      <img
                        slot="start"
                        src="assets/img/Services/Bus.svg"
                        alt=""
                        width="24px"
                      />
                      <IonLabel slot="start">Bus</IonLabel>
                      <IonCheckbox slot="end" value="Bus" />
                    </IonItem>
                    <IonItem lines="full">
                      <img
                        slot="start"
                        src="assets/img/Services/Ship.svg"
                        alt=""
                        width="24px"
                      />
                      <IonLabel slot="start">PELNI</IonLabel>
                      <IonCheckbox slot="end" value="PELNI" />
                    </IonItem>
                    <IonItem lines="full">
                      <img
                        slot="start"
                        src="assets/img/Services/Phone.svg"
                        alt=""
                        width="24px"
                      />
                      <IonLabel slot="start">Top up</IonLabel>
                      <IonCheckbox slot="end" value="Top up" />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Status pemesanan</Typography>
            </AccordionSummary>
            <AccordionDetails className="MustNoPadding">
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonRadioGroup
                      value={selected}
                      onIonChange={(e) => setSelected(e.detail.value)}
                    >
                      <IonItem>
                        <IonLabel>Semua</IonLabel>
                        <IonRadio slot="end" value="all" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Belum Dibayar</IonLabel>
                        <IonRadio slot="end" value="waitingpayment" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Sudah Dibayar</IonLabel>
                        <IonRadio slot="end" value="paid" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Kadaluarsa</IonLabel>
                        <IonRadio slot="end" value="expired" />
                      </IonItem>
                    </IonRadioGroup>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </AccordionDetails>
          </Accordion>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            cssClass="alert"
            header={headerAlert}
            message={messageAlert}
            buttons={["OK"]}
          />
        </IonContent>
        <IonRow>
          <IonCol>
            <IonButton
              onClick={() => setShowModal(false)}
              color="light"
              expand="block"
            >
              Reset
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              onClick={() => setShowModal(false)}
              color="primary"
              expand="block"
              className="text-transform-none"
            >
              Simpan
            </IonButton>
          </IonCol>
        </IonRow>
      </IonModal>
    </IonPage>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    accessToken: state.user.accessToken,
    requestVerificationToken: state.user.requestVerificationToken,
  }),
  component: React.memo(withRouter(Search)),
});
