import React, { useState } from "react";
import { connect } from "../data/connect";
import * as selectors from "../data/selectors";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCard,
  IonText,
  IonPopover,
  IonList,
  IonItem,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { RouteComponentProps, withRouter } from "react-router";
import { rupiah } from "../helpers/currency";
import {
  createTransactionDetailUrl,
  getHistoryTransactionIcon,
  getHistoryTransactionStatusColor,
  getHistoryTransactionStatusName,
} from "../helpers/HistoryTransaction";
import { cSharpDateCovert } from "../helpers/datetime";
interface OwnProps {
  TransactionID: string;
  TransactionCode: string;
  Price: number;
  ProductName: string;
  Status: string;
  ProductCategory: string;
  BuyingDate: string;
}
interface StateProps {}
interface DispatchProps {}
interface TransactionHistoryItemProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
  history,
  TransactionID,
  ProductCategory,
  TransactionCode,
  Price,
  ProductName,
  Status,
  BuyingDate,
}) => {
  const TransactionHistoryDetail = (key: string) => {
    setShowPopover({ open: false, event: undefined });
    const url = createTransactionDetailUrl(
      ProductCategory,
      key.replace(/\./g, "-")
    );
    if (url) {
      history.push(url);
    } else {
      alert("Pastikan anda memilih data transaksi dengan benar");
    }
  };
  const [showPopover, setShowPopover] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({
    open: false,
    event: undefined,
  });

  return (
    <IonCard className="ion-no-margin ion-margin-top ion-margin-bottom center-shadow">
      <IonGrid className="ion-no-padding">
        <IonRow
          className="ion-padding"
          onClick={() => TransactionHistoryDetail(TransactionID)}
        >
          <IonCol size="8">
            <IonText color="medium">
              {ProductCategory === "FlightTicket"
                ? "Kode Booking"
                : "No. Pesanan :"}{" "}
              {TransactionCode}
            </IonText>
          </IonCol>
          <IonCol size="4" className="ion-text-right">
            <IonText color="dark">{rupiah(Price)}</IonText>
          </IonCol>
        </IonRow>
        <IonRow
          className="ion-padding-start gray-bg ion-align-items-center"
          onClick={() => TransactionHistoryDetail(TransactionID)}
        >
          <IonCol size="2">
            <img
              src={getHistoryTransactionIcon(ProductCategory)}
              alt=""
              height="24px"
              className="ion-mt-16 ion-mb-16"
            />
          </IonCol>
          <IonCol size="8 ">
            <IonText color="dark">
              {ProductName} {ProductCategory}
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding">
          <IonCol
            size="9"
            onClick={() => TransactionHistoryDetail(TransactionID)}
          >
            <IonText
              color={getHistoryTransactionStatusColor(Status, ProductCategory)}
            >
              Status: {getHistoryTransactionStatusName(Status, ProductCategory)}
            </IonText>
            <IonText>
              <h6 className="ion-no-margin">
                <small>{cSharpDateCovert(BuyingDate)}</small>
              </h6>
            </IonText>
          </IonCol>
          <IonCol size="3" className="ion-text-right">
            <IonPopover
              isOpen={showPopover.open}
              event={showPopover.event}
              showBackdrop={false}
              onDidDismiss={(e) =>
                setShowPopover({ open: false, event: undefined })
              }
            >
              <IonList lines="none">
                <IonItem
                  onClick={() => TransactionHistoryDetail(TransactionID)}
                >
                  Detail
                </IonItem>
                <IonItem>Hapus</IonItem>
              </IonList>
            </IonPopover>
            <IonIcon
              icon={ellipsisVertical}
              color="primary"
              onClick={(e) =>
                setShowPopover({ open: true, event: e.nativeEvent })
              }
            ></IonIcon>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    NewsData: selectors.getNews(state),
  }),
  component: React.memo(withRouter(TransactionHistoryItem)),
});
