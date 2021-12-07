import { HTTP } from "@ionic-native/http";
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonViewWillEnter,
} from "@ionic/react";
import { Collapse, Modal } from "antd";
import { informationCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { AppId, DefaultAva, MainUrl } from "../../AppConfig";
import HotelOrderBuyerData from "../../components/Hotel/HotelOrderBuyerData";
import HotelOrderOrderPerson from "../../components/Hotel/HotelOrderOrderPerson";
import HotelWizard from "../../components/Hotel/HotelWizard";
import { connect } from "../../data/connect";
import { loadHotelOrderRoomDetail } from "../../data/hotel/hotel.actions";
import * as selectors from "../../data/selectors";
import { rupiah } from "../../helpers/currency";
import "./Order.scss";
const { Panel } = Collapse;
interface OwnProps {}
interface StateProps {
  UserData: any;
  HORD?: any;
}
interface DispatchProps {
  loadHotelOrderRoomDetail: typeof loadHotelOrderRoomDetail;
}
interface OrderProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const Order: React.FC<OrderProps> = ({
  history,
  UserData,
  HORD,
  loadHotelOrderRoomDetail,
}) => {
  const [HotelPanelData, setHotelPanelData] = useState<any>(null);

  const [HotelOrderGuest, setHotelOrderGuest] = useState<any>(
    localStorage.getItem("HotelOrderGuest")
      ? JSON.parse(localStorage.getItem("HotelOrderGuest") || "")
      : null
  );
  const [ModalPolicy, setModalPolicy] = useState<any>(null);
  const [ModalPolicyTitle, setModalPolicyTitle] = useState<any>(null);
  const [ModalPolicyContent, setModalPolicyContent] = useState<any>(null);
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
  useEffect(() => {
    if (HORD) {
      if (!HotelOrderGuest && !showLoading) {
        setShowLoading(true);
        localStorage.setItem("HotelOrderGuest", "null");
        var MyData = JSON.stringify({
          roomName: HORD.HotelRoomSelected.name,
          roomID: HORD.HotelRoomSelected.ID,
          internalCode: HORD.HotelDetail.HotelDetail.internalCode,
          hotelID: HORD.HotelDetail.HotelDetail.ID,
          breakfast: HORD.HotelRoomSelected.breakfast,
          acctoken: UserData.accessToken,
        });
        var MyHeaders = {
          appid: AppId,
          RequestVerificationToken: UserData.requestVerificationToken,
          "Content-Type": "application/json",
        };
        //Cordova Only
        if (isPlatform("cordova")) {
          HTTP.setDataSerializer("multipart");
          HTTP.setRequestTimeout(180);
          HTTP.post(MainUrl + "Hotel/Guest", MyData, MyHeaders)
            .then((res) => {
              if (res.status !== 200) {
                alert("Periksa Koneksi anda");
              }
              return JSON.parse(res.data);
            })
            .then((res) => {
              HotelGuestFetch(res);
            })
            .catch((err) => {
              history.push("rep");
            });
        } else {
          fetch(MainUrl + "Hotel/Guest", {
            method: "POST",
            headers: MyHeaders,
            body: MyData,
          })
            .then((r) => {
              if (r.ok) {
                return r.json();
              } else {
                if (r.status === 401) {
                  // failedAlert("Session telah habis, silahkan login ulang");

                  history.push("/login");
                } else {
                  // failedAlert(r.statusText);
                }
                return r.json();
              }
            })
            .then((res) => {
              HotelGuestFetch(res);
            })
            .catch((err) => {
              failedAlert("Periksa Koneksi Internet");
            });
        }
      }
    }
  }, [HORD]);
  useEffect(() => {
    if (HotelOrderGuest) {
      setHotelPanelData({
        HotelName: HotelOrderGuest.HotelDetail.name || "",
        HotelAddress: HotelOrderGuest.HotelDetail.address || "",
        CheckInDate: HotelOrderGuest.CheckInDate || "",
        CheckOutDate: HotelOrderGuest.CheckOutDate || "",
        RoomRequest: HotelOrderGuest.Prebook.rooms || "",
        TotalPrice: HotelOrderGuest.PriceAndPolicy.TotalPrice || 0,
      });
    }
  }, [HotelOrderGuest]);
  const HotelGuestFetch = (res) => {
    if (res.StatusCode == 200) {
      localStorage.setItem("HotelOrderGuest", JSON.stringify(res.Data));
      setHotelOrderGuest(res.Data);
      setShowLoading(false);
    } else {
      localStorage.removeItem("HotelOrderGuest");
      history.replace("hotelSearch");
      failedAlert(res.ErrorMessage || "Proses Gagal");
    }
  };
  useIonViewWillEnter(() => {
    loadHotelOrderRoomDetail();
  });
  const HOGCheck = () => {
    let status = true;
    HotelOrderGuest.Prebook.rooms.forEach((r) => {
      if (r.paxes === null) {
        status = false;
      } else {
        r.paxes.forEach((p) => {
          if (p.FirstName === null) {
            status = false;
          }
        });
      }
    });
    return status;
  };
  const submitBooking = () => {
    setShowLoading(true);
    if (HotelOrderGuest && HOGCheck()) {
      const HOG = HotelOrderGuest;
      const HOOP = JSON.parse(localStorage.HotelOrderOrderPerson);
      let Rooms = new Array();
      HOG.Prebook.rooms.forEach((room, indexRoom) => {
        const RoomTemp = {
          email: HOOP.OrderPersonEmail,
          isRequestChildBed: room.isRequestChildBed,
          isSmokingRoom: room.isSmokingRoom,
          paxes: room.paxes,
          phone: HOOP.OrderPersonPhoneNumber,
          requestDescription: room.requestDescription,
          roomtype: room.roomType,
          specialRequestArray: room.specialRequestArray,
        };
        Rooms.push(RoomTemp);
      });
      var MyHeaders = {
        appid: AppId,
        "Content-Type": "application/json",
        RequestVerificationToken: UserData.requestVerificationToken,
      };
      var MyData = JSON.stringify({
        rooms: Rooms,
        accToken: UserData.accessToken,
      });
      if (isPlatform("cordova")) {
        HTTP.setDataSerializer("json");
        HTTP.post(MainUrl + "Hotel/Booking", JSON.parse(MyData), MyHeaders)
          .then((res) => {
            if (res.status !== 200) {
              alert("Periksa Koneksi anda");
            }
            return JSON.parse(res.data);
          })
          .then((res) => {
            BookingSuccess(res);
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
          });
      } else {
        fetch(MainUrl + "Hotel/Booking", {
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
            BookingSuccess(res);
          })
          .catch((err) => {
            failedAlert("Periksa Koneksi Internet");
          });
      }
    } else {
      failedAlert("Mohon Lengkapi Data terlebih dahulu");
    }
  };
  const BookingSuccess = (res) => {
    if (res.StatusCode === 200 && res.Data) {
      setShowLoading(false);
      localStorage.setItem("HotelBookingData", JSON.stringify(res.Data));
      history.push("/hotelPayment");
    } else if (res.StatusCode === 401) {
      history.replace("/hotelSearch");
    } else {
      failedAlert(res.ErrorMessage);
    }
  };
  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/hotelSearch"></IonBackButton>
          </IonButtons>
          <IonTitle>Data Pesanan</IonTitle>
        </IonToolbar>
        <HotelWizard
          WizardIndex={1}
          HotelPanelData={HotelPanelData}
        ></HotelWizard>
      </IonHeader>
      <IonContent fullscreen={true} className="hotelorder">
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
        <HotelOrderOrderPerson
          name={UserData.name}
          email={UserData.email}
        ></HotelOrderOrderPerson>
        <HotelOrderBuyerData
          setHotelOrderGuest={(data) => {
            setHotelOrderGuest(data);
          }}
          GuestRooms={
            HotelOrderGuest &&
            HotelOrderGuest.Prebook &&
            HotelOrderGuest.Prebook.rooms &&
            HotelOrderGuest.Prebook.rooms.length > 0
              ? HotelOrderGuest.Prebook.rooms
              : null
          }
        ></HotelOrderBuyerData>

        <div className="ion-margin ion-padding white-bg">
          <IonLabel
            color="primary"
            onClick={() => {
              setModalPolicyTitle("Aturan Pembatalan");
              setModalPolicyContent(
                HotelOrderGuest && HotelOrderGuest.PriceAndPolicy
                  ? HotelOrderGuest.PriceAndPolicy.CancelPolicy
                  : ""
              );
              setModalPolicy(true);
            }}
          >
            Aturan Pembatalan <IonIcon icon={informationCircle}></IonIcon>
          </IonLabel>
        </div>
        <div className="ion-margin ion-padding white-bg">
          <IonLabel
            color="primary"
            onClick={() => {
              setModalPolicyTitle("AChild and Extrabed Policy");
              setModalPolicyContent(
                HotelOrderGuest && HotelOrderGuest.PriceAndPolicy
                  ? HotelOrderGuest.PriceAndPolicy.AdditionalInformation
                  : ""
              );
              setModalPolicy(true);
            }}
          >
            Child and Extrabed Policy&nbsp;
            <IonIcon icon={informationCircle}></IonIcon>
          </IonLabel>
        </div>
        <div
          style={{ backgroundColor: "#FF8551" }}
          className="ion-m-8 ion-padding"
          hidden={true}
        >
          <IonLabel color="light">
            Saldo Anda tidak mencukupi untuk melakukan transaksi. Harap
            melakukan deposit terlebih dahulu.
          </IonLabel>
        </div>
        <Modal
          title={ModalPolicyTitle}
          visible={ModalPolicy}
          footer={null}
          onCancel={() => setModalPolicy(false)}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: ModalPolicyContent || "",
            }}
          ></div>
        </Modal>
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
                  <h6 className="ion-no-margin ion-no-padding">
                    {HotelOrderGuest && HotelOrderGuest.PriceAndPolicy
                      ? rupiah(HotelOrderGuest.PriceAndPolicy.TotalPrice || 0)
                      : "Rp 0"}
                  </h6>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  className="text-transform-none"
                  size="large"
                  expand="block"
                  onClick={() => submitBooking()}
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
    UserData: selectors.getUserData(state),
    HORD: state.hotel.HotelOrderRoomDetail,
  }),
  mapDispatchToProps: { loadHotelOrderRoomDetail },
  component: React.memo(withRouter(Order)),
});
