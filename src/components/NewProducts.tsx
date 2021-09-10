import React, { useEffect, useState } from "react";
import { TourProductListModel } from "../models/TourProdctList";
import { connect } from "../data/connect";
import * as selectors from "../data/selectors";
import { loadNewTourProdctListData } from "../data/app/app.actions";
import { RouteComponentProps, withRouter } from "react-router";
import { rupiah } from "../helpers/currency";
import Lottie from "lottie-react";
import loadingLottie from "../Lotties/thumbnailSkeleton.json";

import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonTitle,
  IonCardContent,
  IonRouterLink,
  IonIcon,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import { ImageBasePath } from "../AppConfig";
// import { setLoading } from '../data/user/user.actions';
interface OwnProps {
  HideLinkAllView: boolean;
}
interface StateProps {
  NewTourProductListData: TourProductListModel[];
}
interface DispatchProps {
  loadNewTourProdctListData: typeof loadNewTourProdctListData;
}
interface NewsListProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const NewProducts: React.FC<NewsListProps> = ({
  history,
  NewTourProductListData,
  loadNewTourProdctListData,
  HideLinkAllView,
}) => {
  // const [showPopover, setShowPopover] = useState(false);
  // const [showLoading, setShowLoading] = useState(false);
  // const [showAlert, setShowAlert] = useState(false);
  // const [headerAlert, setHeaderAlert] = useState<string>();
  // const [messageAlert, setMessageAlert] = useState<string>();
  // const [TourProductSearchList,setTourProductSearchList] = useState([]);
  const [LoadingStatus, setLoadingStatus] = useState("waiting");
  // const failedAlert = (errorMessage:string) =>{
  //   setShowLoading(false);
  //   setHeaderAlert('Gagal');
  //   setMessageAlert(errorMessage);
  //   setShowAlert(true);
  // }
  // const successAlert = (successMessage:string) =>{
  //   setShowLoading(false);
  //   setHeaderAlert('Sukses');
  //   setMessageAlert(successMessage);
  //   setShowAlert(true);
  // }
  useEffect(() => {
    loadNewTourProdctListData();
  }, []);
  useEffect(() => {
    NewTourProductListData.length > 0
      ? setLoadingStatus("success")
      : setLoadingStatus("waiting");
  }, [NewTourProductListData]);
  return (
    <IonGrid className="tour-packages-wrapper ion-padding-top">
      <Lottie
        animationData={loadingLottie}
        hidden={LoadingStatus === "waiting" ? false : true}
      />
      <Lottie
        animationData={loadingLottie}
        hidden={LoadingStatus === "waiting" ? false : true}
      />
      <IonRow hidden={LoadingStatus === "success" ? false : true}>
        <IonCol size="8">
          <IonTitle className="ion-no-padding">Paket Terbaru</IonTitle>
        </IonCol>
        <IonCol size="4" className="ion-text-right" hidden={HideLinkAllView}>
          <IonRouterLink routerLink="/tour">
            lihat semua <IonIcon icon={chevronForward}></IonIcon>
          </IonRouterLink>
        </IonCol>
        {/* card tour packages*/}
        {NewTourProductListData.length > 0
          ? NewTourProductListData.map((dataItem, index) => (
              <IonCol
                size="6"
                key={dataItem.code}
                onClick={() =>
                  history.push(
                    `/tourDetail/${dataItem.title.replace(/\s+/g, "-")}/${
                      dataItem.code
                    }`
                  )
                }
              >
                <IonCard className="ion-no-margin tourProductCard">
                  <img
                    src={ImageBasePath + dataItem.image}
                    alt=""
                    className="tourProductThumbnail"
                    width="100%"
                  />
                  <IonCardContent>
                    <IonCardTitle>{dataItem.title}</IonCardTitle>
                    <IonCardSubtitle>{rupiah(dataItem.price)}</IonCardSubtitle>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))
          : ""}
      </IonRow>
    </IonGrid>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    NewTourProductListData: selectors.getNewTourProductList(state),
  }),
  mapDispatchToProps: { loadNewTourProdctListData },
  component: React.memo(withRouter(NewProducts)),
});
