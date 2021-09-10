import React, { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonTitle,
  IonBackButton,
  IonInput,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonCardContent,
  IonItemDivider,
  isPlatform,
  IonLoading,
  IonAlert,
} from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import "./BalanceActivities.scss";
import { connect } from "../../data/connect";
import {
  chevronBackOutline,
  chevronDown,
  chevronUp,
  filter,
  funnel,
  newspaper,
} from "ionicons/icons";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import BalanceActivitiesItem from "../../components/BalanceActivitiesItem";
import { HTTP } from "@ionic-native/http";
import { AppId, MainUrl } from "../../AppConfig";
const { TabPane } = Tabs;

interface StateProps {
  accessToken: string;
}
interface BalanceActivitiesProps extends RouteComponentProps, StateProps {}
const BalanceActivities: React.FC<BalanceActivitiesProps> = ({
  history,
  accessToken,
}) => {
  const callback = (key: any) => {
    key === "pending"
      ? getBalanceActivities("belum lunas")
      : getBalanceActivities("lunas");
  };
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const [startDate, setStartDate] = useState<string>("2020/01/01");
  const [endDate, setEndDate] = useState<string>("2022/01/01");
  const [PaidMutation, setPaidMutation] = useState<any>(null);
  const [ItemActive, setItemActive] = useState(
    localStorage.getItem("BalanceActivitiesItemActive") || "none"
  );
  React.useEffect(() => {
    localStorage.setItem("BalanceActivitiesItemActive", "none");
    getBalanceActivities("belum lunas");
  }, []);
  const getBalanceActivities = (paidStatus: string) => {
    setShowLoading(true);
    const MyData = new FormData();
    MyData.append("startDate", startDate);
    MyData.append("endDate", endDate);
    MyData.append("paidStatus", paidStatus);
    MyData.append("accToken", accessToken);
    const myHeaders = {
      appid: AppId,
    };
    if (isPlatform("cordova")) {
      HTTP.setDataSerializer("multipart");
      HTTP.post(MainUrl + "member/RequestDepositHistory", MyData, myHeaders)
        .then((res) => {
          if (res.status !== 200) {
            failedAlert("Periksa Koneksi Internet");
          }
          return JSON.parse(res.data);
        })
        .then((res) => {
          if (res.StatusCode === 200) {
            if (res.Data.RequestDeposit.length > 0) {
              setPaidMutation(res.Data.RequestDeposit);
              setShowLoading(false);
            } else {
              failedAlert("Tidak ada data");
              setPaidMutation(null);
              setShowLoading(false);
            }
          } else {
            setPaidMutation(null);
            failedAlert("Periksa koneksi Internet");
          }
        })
        .catch((error) => {
          setPaidMutation(null);
          failedAlert("Periksa Koneksi Internet Anda");
        });
    } else {
      fetch(MainUrl + "member/RequestDepositHistory", {
        method: "POST",
        headers: myHeaders,
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
          if (res.StatusCode === 200) {
            if (res.Data.RequestDeposit.length > 0) {
              setPaidMutation(res.Data.RequestDeposit);
              setShowLoading(false);
            } else {
              failedAlert("Tidak ada data");
              setPaidMutation(null);
              setShowLoading(false);
            }
          } else {
            setPaidMutation(null);
            failedAlert("Periksa koneksi Internet");
          }
        })
        .catch((err) => {
          setPaidMutation(null);
          failedAlert("Periksa Koneksi Internet Anda");
        });
    }
  };
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const successAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Sukses");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton
              icon={chevronBackOutline}
              defaultHref="/balance"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Aktifitas Saldo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-start ion-padding-end balanceActivities">
        <Tabs defaultActiveKey="transaction" onChange={callback} size="large">
          <TabPane
            tab="Tertunda"
            key="pending"
            className="ion-text-center gray-bg ion-pb-80"
          >
            <IonCard
              className="ion-no-margin ion-padding"
              style={{
                borderRadius: "0",
                zIndex: "1",
                position: "sticky",
                top: "0",
              }}
            >
              <IonLabel>
                Menampilkan aktivitas dalam{" "}
                <IonText color="primary">90 hari terakhir.</IonText>
              </IonLabel>
            </IonCard>
            {PaidMutation !== null && PaidMutation.length > 0
              ? PaidMutation.map((item, index) => (
                  <BalanceActivitiesItem
                    key={index}
                    itemIndex={index}
                    itemData={item}
                    setItemActive={setItemActive}
                    itemActive={ItemActive}
                  ></BalanceActivitiesItem>
                ))
              : ""}
          </TabPane>
          <TabPane tab="Selesai" key="done" className="ion-text-center gray-bg">
            <IonCard
              className="ion-no-margin ion-padding"
              style={{
                borderRadius: "0",
                zIndex: "1",
                position: "sticky",
                top: "0",
              }}
            >
              <IonLabel>
                Menampilkan aktivitas dalam{" "}
                <IonText color="primary">90 hari terakhir.</IonText>
              </IonLabel>
            </IonCard>
          </TabPane>
        </Tabs>
        <TabPane tab="Tertunda" key="pending" className="ion-text-center">
          <IonLabel>
            Menampilkan aktivitas dalam{" "}
            <IonText color="primary">90 hari terakhir.</IonText>
          </IonLabel>
        </TabPane>
        <IonCard className="tourSearchFilterSort">
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
        <IonLoading
          isOpen={showLoading}
          message={"Mengambil Laporan Request Deposit..."}
        />
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

export default connect<BalanceActivitiesProps>({
  mapStateToProps: (state) => ({
    accessToken: state.user.accessToken,
  }),
  component: React.memo(withRouter(BalanceActivities)),
});
