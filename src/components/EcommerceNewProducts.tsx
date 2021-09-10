import React, { useEffect, useState } from "react";
import { EcommerceProductListModel } from "../models/EcommerceProdctList";
import { connect } from "../data/connect";
import * as selectors from "../data/selectors";
import { loadNewEcommerceProdctListData } from "../data/app/app.actions";
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
import { setLoading } from "../data/user/user.actions";
interface OwnProps {
  HideLinkAllView: boolean;
}
interface StateProps {
  NewEcommerceProductListData: EcommerceProductListModel[];
}
interface DispatchProps {
  loadNewEcommerceProdctListData: typeof loadNewEcommerceProdctListData;
}
interface NewsListProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const EcommerceNewProducts: React.FC<NewsListProps> = ({
  history,
  NewEcommerceProductListData,
  loadNewEcommerceProdctListData,
  HideLinkAllView,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert, setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const [TourProductSearchList, setTourProductSearchList] = useState([]);
  const [LoadingStatus, setLoadingStatus] = useState("waiting");
  const failedAlert = (errorMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Gagal");
    setMessageAlert(errorMessage);
    setShowAlert(true);
  };
  const successAlert = (successMessage: string) => {
    setShowLoading(false);
    setHeaderAlert("Sukses");
    setMessageAlert(successMessage);
    setShowAlert(true);
  };
  useEffect(() => {
    loadNewEcommerceProdctListData();
  }, []);
  useEffect(() => {
    NewEcommerceProductListData.length > 0
      ? setLoadingStatus("success")
      : setLoadingStatus("waiting");
  }, [NewEcommerceProductListData]);

  // console.log(NewEcommerceProductListData);

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
          <IonTitle className="ion-no-padding">Produk Terbaru</IonTitle>
        </IonCol>
        <IonCol size="4" className="ion-text-right" hidden={HideLinkAllView}>
          <IonRouterLink routerLink="/tour">
            lihat semua <IonIcon icon={chevronForward}></IonIcon>
          </IonRouterLink>
        </IonCol>
        {/* card tour packages*/}
        {NewEcommerceProductListData.length > 0
          ? NewEcommerceProductListData.map((dataItem, index) => (
              <IonCol
                size="6"
                key={dataItem.ProductCode}
                onClick={() =>
                  history.push(`/ProductDetail/${dataItem.ProductCode}`)
                }
              >
                <IonCard className="ion-no-margin tourProductCard">
                  <img
                    src={ImageBasePath + dataItem.Image}
                    alt=""
                    className="tourProductThumbnail"
                    width="100%"
                  />
                  <IonCardContent>
                    <IonCardTitle>{dataItem.Title}</IonCardTitle>
                    <IonCardSubtitle>
                      {rupiah(dataItem.LowPrice)}
                    </IonCardSubtitle>
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
    NewEcommerceProductListData: selectors.getNewEcommerceProductList(state),
  }),
  mapDispatchToProps: { loadNewEcommerceProdctListData },
  component: React.memo(withRouter(EcommerceNewProducts)),
});
