import React, { useRef, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonText, IonTextarea, IonToast, IonGrid } from '@ionic/react';
import { connect } from '../data/connect';
import { useParams } from 'react-router';

interface OwnProps { }

interface DispatchProps { }

interface DokuCompleteProps extends OwnProps, DispatchProps { }

const DokuComplete: React.FC<DokuCompleteProps> = () => {
  const  parameters:any  = useParams();
  const [Submitted,setSubmitted] = useState(false);
  const [DokuData,setDokuData] = useState<any>(null);
  const DokuFormRef = useRef<HTMLFormElement>(null)
  React.useEffect(()=>{
    // console.log('asd');

  },[])
  return (
    <IonPage>
      <IonContent className="gray-bg">
        <IonGrid className="white-bg ion-padding">
          <IonRow className="ion-padding ion-text-center">
          <IonText color="medium"><b>Terima kasih telah melakukan pembayaran.</b></IonText>
          <IonText color="medium"><small>Pesanan Anda akan segera diproses.</small></IonText>

          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  component: DokuComplete
})
