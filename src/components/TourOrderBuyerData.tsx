import React, { useEffect, useState } from 'react';
import TourOrderBuyerDataItem from '../components/TourOrderBuyerDataItem';

import { IonGrid, IonText } from '@ionic/react';

export default function TourOrderBuyerData({ domesticTourType}: { domesticTourType:boolean}) {
  const [TourOrderPaxData, setTourOrderPaxData] = useState<any>(null);
  useEffect(() => {
    setTourOrderPaxData(JSON.parse(localStorage.TourOrderPaxData?localStorage.TourOrderPaxData:null))
    // loadNewTourProdctListData();
  }, [localStorage.TourOrderPaxData]);
  return (
    <div className="ion-no-padding">
      <IonText class="ion-padding" color="dark">
        <small>Data Pembeli</small>
        {
          TourOrderPaxData!==null?TourOrderPaxData.map((item,index)=>(
            <TourOrderBuyerDataItem indexItem={index} type={item} domesticTourType={domesticTourType} key={index}></TourOrderBuyerDataItem>
          )):(<IonText>Anda belum memilih pax</IonText>)
        }
      </IonText>
    </div>
  );
}
