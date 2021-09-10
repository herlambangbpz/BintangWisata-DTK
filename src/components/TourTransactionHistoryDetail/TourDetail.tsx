import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ModalTourDetailPartial from '../ModalTourDetailPartial';
import { connect } from '../../data/connect';
import { cSharpDateCovert } from '../../helpers/datetime';
import { getHistoryTransactionIcon } from '../../helpers/HistoryTransaction';
interface OwnProps {
  TransactionHistoryDetail:any
};
interface StateProps { };
interface DispatchProps {}
interface TourDetailProps extends OwnProps, StateProps, DispatchProps,RouteComponentProps { };
const TourDetail: React.FC<TourDetailProps> = ({
  history,TransactionHistoryDetail}) => {
  const [showModalTourDetail,setShowModalTourDetail] = useState(false);
  return (
    <div>
      <p><br/></p>
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
    </IonGrid>
    <ModalTourDetailPartial
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
        ></ModalTourDetailPartial>
    </div>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: React.memo(withRouter(TourDetail))
});
