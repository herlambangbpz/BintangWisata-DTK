import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Slider } from "antd";
import { chevronBackOutline, filter, funnel, star } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { rupiah } from "../../helpers/currency";
import { stringDateConvert } from "../../helpers/datetime";
import "./SearchResult.scss";

interface OwnProps {}
interface StateProps {
  SearchResult: any;
  UserData: any;
}
interface DispatchProps {}
interface SearchResultProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const HotelSearchResult: React.FC<SearchResultProps> = ({
  SearchResult,
  UserData,
  history,
}) => {
  const [BottomDrawerIsOpen, setBottomDrawerIsOpen] = useState(false);
  const [BottomDrawerIsDestroy, setBottomDrawerIsDestroy] = useState(true);
  const [BottomDrawerOpacityStyle, setBottomDrawerOpacityStyle] = useState({
    opacity: "0",
    "z-index": "-9999",
    display: "none",
  });
  const [BottomDrawerCardStyle, setBottomDrawerCardStyle] = useState({
    bottom: "-100vh",
  });
  const [FilterPriceMin, setFilterPriceMin] = useState(0);
  const [FilterPriceMax, setFilterPriceMax] = useState(10000000);

  useEffect(() => {
    if (BottomDrawerIsDestroy) {
      // open
      setBottomDrawerCardStyle({ bottom: "-100vh" });
      setBottomDrawerOpacityStyle({
        opacity: "0",
        "z-index": "9999",
        display: "block",
      });

      setTimeout(() => {
        setBottomDrawerIsOpen(false);
        setBottomDrawerOpacityStyle({
          opacity: "0",
          "z-index": "-9999",
          display: "none",
        });
      }, 500);
    } else {
      // close
      setBottomDrawerIsOpen(true);
      setBottomDrawerOpacityStyle({
        opacity: "0",
        "z-index": "9999",
        display: "block",
      });
      setTimeout(() => {
        setBottomDrawerCardStyle({ bottom: "0" });
        setBottomDrawerOpacityStyle({
          opacity: "1",
          "z-index": "9999",
          display: "block",
        });
      }, 100);
    }
  }, [BottomDrawerIsDestroy]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/hotelSearch"
              icon={chevronBackOutline}
            ></IonBackButton>
          </IonButtons>
          <IonTitle className="ion-no-padding">
            <b>
              {SearchResult.totalItem || 0} Hotel di{" "}
              {SearchResult.Booking.cityName || ""}
            </b>
          </IonTitle>
          <IonTitle className="ion-sub-title ion-no-padding">
            {stringDateConvert(SearchResult.Booking.checkInDate || "")}
            {" - "}
            {stringDateConvert(SearchResult.Booking.checkOutDate || "")}
          </IonTitle>
          <IonButtons slot="end" className="ion-margin-end">
            <IonButton
              className="btn-outline-light text-transform-none"
              onClick={() => {
                setBottomDrawerIsDestroy(false);
              }}
            >
              Filter
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} class="gray-bg">
        {SearchResult.Hotel
          ? SearchResult.Hotel.hotels.map((item) => (
              <IonCard
                className="ion-margin"
                onClick={() => {
                  if (item.ID && item.internalCode) {
                    history.push(
                      encodeURI(
                        "/hotelDetail/" + item.ID + "/" + item.internalCode
                      )
                    );
                  } else {
                    alert(item.ID);
                  }
                }}
              >
                <IonRow>
                  <IonCol size="4" className="ion-no-padding">
                    <img
                      className="ofc"
                      src={item.logo || "assets/img/news/news-1.jpg"}
                      alt=""
                      width="100%"
                      height="100%"
                    />
                  </IonCol>
                  <IonCol size="8" className="ion-p-8">
                    <IonText>
                      <h6>
                        <b>{item.name || ""}</b>
                      </h6>
                    </IonText>
                    <div>
                      <IonIcon
                        icon={star}
                        color="warning"
                        hidden={item.rating > 0 ? false : true}
                      ></IonIcon>
                      <IonIcon
                        icon={star}
                        color="warning"
                        hidden={item.rating > 1 ? false : true}
                      ></IonIcon>
                      <IonIcon
                        icon={star}
                        color="warning"
                        hidden={item.rating > 2 ? false : true}
                      ></IonIcon>
                      <IonIcon
                        icon={star}
                        color="warning"
                        hidden={item.rating > 3 ? false : true}
                      ></IonIcon>
                      <IonIcon
                        icon={star}
                        color="warning"
                        hidden={item.rating > 4 ? false : true}
                      ></IonIcon>
                    </div>
                    <IonText color="dark">
                      <p>
                        <small>
                          {item.address ? item.address.substr(0, 30) : ""}
                          {item.address
                            ? item.address.length > 30
                              ? "..."
                              : ""
                            : ""}
                        </small>
                      </p>
                    </IonText>
                    <IonText>
                      <p className="ion-no-margin">
                        {item.ratingAverage || ""}
                        <br></br>
                        {item.ratingAverage > 9
                          ? "Ideal"
                          : item.ratingAverage > 8
                          ? "Luar Biasa"
                          : item.ratingAverage > 7
                          ? "Sangat Baik"
                            ? item.ratingAverage > 6
                              ? "Bagus"
                              : "Dibawah Eksepektasi"
                            : ""
                          : ""}
                      </p>
                    </IonText>
                    <IonText color="primary">
                      <b>{rupiah(item.priceStart || 0)}</b>
                    </IonText>
                  </IonCol>
                </IonRow>
              </IonCard>
            ))
          : ""}
        <div className="bottomDrawer" hidden={!BottomDrawerIsOpen}>
          <div
            className="bottomDrawerOpacity"
            onClick={() => {
              setBottomDrawerIsDestroy(true);
            }}
            style={BottomDrawerOpacityStyle}
          ></div>
          <div className="bottomDrawerCard" style={BottomDrawerCardStyle}>
            <div
              className="bottomDrawerDragPad"
              onClick={() => {
                setBottomDrawerIsDestroy(true);
              }}
            ></div>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Kata Kunci</IonLabel>
                <IonInput
                  value={""}
                  placeholder="Kota, Area, Nama Hotel"
                ></IonInput>
              </IonItem>
              <IonRow>
                <IonCol size="12">
                  <IonLabel position="stacked">Kisaran Harga</IonLabel>
                </IonCol>
                <IonCol>
                  <IonInput value={rupiah(FilterPriceMin)} disabled></IonInput>
                </IonCol>
                <IonCol>
                  <IonInput value={rupiah(FilterPriceMax)} disabled></IonInput>
                </IonCol>
              </IonRow>
              <Slider
                className="dt-slider"
                range
                step={1000}
                min={0}
                max={10000000}
                value={[FilterPriceMin, FilterPriceMax]}
                onChange={(v) => {
                  setFilterPriceMin(v[0]);
                  setFilterPriceMax(v[1]);
                }}
              />
              <IonItem>
                <IonLabel>Menampilkan Harga</IonLabel>
                <IonSelect interface="action-sheet" value={"total"}>
                  <IonSelectOption value="total">Total</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Urutkan Berdasarkan</IonLabel>
                <IonSelect interface="action-sheet" value={"popularity"}>
                  <IonSelectOption value="price">Harga</IonSelectOption>
                  <IonSelectOption value="popularity">
                    Popularitas
                  </IonSelectOption>
                  <IonSelectOption value="latest">
                    Produk Terbaru
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              className="text-transform-none"
              onClick={() => {
                setBottomDrawerIsDestroy(true);
              }}
            >
              Filter
            </IonButton>
            <IonButton
              color="light"
              expand="block"
              className="text-transform-none ion-color-primary"
              onClick={() => {
                setFilterPriceMin(0);
                setFilterPriceMax(10000000);
              }}
            >
              Reset
            </IonButton>
          </div>
        </div>
        <IonCard className="tourSearchFilterSort" hidden={true}>
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
    </IonPage>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    SearchResult: state.hotel.HotelSearchResults,
    UserData: selectors.getUserData(state),
  }),
  mapDispatchToProps: {},
  component: React.memo(withRouter(HotelSearchResult)),
});
