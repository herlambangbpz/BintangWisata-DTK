import React, {useState} from 'react';
import { IonContent,IonAlert, IonItem, IonSearchbar ,IonPage,IonHeader,IonCard,IonLabel,IonDatetime,IonCardContent, IonButton, IonList, IonModal, IonText} from '@ionic/react';
import EcommerceNewProducts from '../../components/EcommerceNewProducts';
import DefaultToolbar from '../../components/shared/DefaultToolbar';
import './Index.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from '../../data/connect';

interface IndexProps extends RouteComponentProps{ };
const Index: React.FC<IndexProps> = ({history}) => {

  // datepicker
  const today:Date = new Date();
  const tomorrow:Date = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(today.toISOString());
  const [selectedEndDate, setSelectedEndDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() + 6)).toISOString());
  const [searchText, setSearchText] = useState('');

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [headerAlert,setHeaderAlert] = useState<string>();
  const [messageAlert, setMessageAlert] = useState<string>();

  //Modal
  const [showModal, setShowModal] = useState(false);

  const changeStartDate = (value:string) =>{
    const startDate:Date = new Date(value);
    const endDate:Date = new Date(selectedEndDate);
    if(endDate < startDate){
      setHeaderAlert('Gagal Memilih Tanggal');
      setMessageAlert('Tanggal Kembali harus lebih dari Tanggal Berangkat');
      setShowAlert(true);
    }else{
      setSelectedStartDate(value);
    }
  }
  const changeEndDate = (value:string) =>{
    const endDate:Date = new Date(value);
    const startDate:Date = new Date(selectedStartDate);

    if(endDate < startDate){
      setHeaderAlert('Gagal Memilih Tanggal');
      setMessageAlert('Tanggal Kembali harus lebih dari Tanggal Berangkat');
      setShowAlert(true);
    }else{
      setSelectedEndDate(value);
    }
  }
  const TourSearchSubmit = () => {
    localStorage.setItem("filterSearchText", searchText);
    localStorage.setItem("filterStartDate", selectedStartDate);
    localStorage.setItem("filterEndDate", selectedEndDate);
    history.push('/tourSearch');
  }
  return (
    <IonPage id="tourIndex">
      <IonContent fullscreen={true}>
      <IonHeader translucent >
        <DefaultToolbar
        title="Paket Tour" color="primary" backButtonRoute="/main/index"
        />
      </IonHeader>
      <IonCard className="ion-no-margin ion-padding-bottom ion-header-card">
        <IonCardContent className="ion-no-padding">
          <IonItem>
            <IonSearchbar
            value={searchText}
            placeholder="Mau kemana hari Ini?"
            mode="ios" className="ion-no-padding"
            onClick={() => setShowModal(true)}
            >

            </IonSearchbar>
          </IonItem>
          <IonItem>
            <IonLabel>Tanggal Berangkat</IonLabel>
            <IonDatetime
              min={new Date().toISOString()}
              max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString()}
              displayFormat="DD MMMM YYYY" value={selectedStartDate}
              onIonChange={e => changeStartDate(e.detail.value!)}doneText="Pilih" cancelText="Batal">
            </IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel>Tanggal Kembali</IonLabel>
            <IonDatetime
              min={new Date().toISOString()}
              max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString()}
              displayFormat="DD MMMM YYYY" value={selectedEndDate}
              onIonChange={e => changeEndDate(e.detail.value!)} doneText="Pilih" cancelText="Batal">
            </IonDatetime>
          </IonItem>
          <IonItem>
              <IonButton size="large" onClick={()=>TourSearchSubmit()}>Cari Paket Tour</IonButton>
          </IonItem>
        </IonCardContent>
      </IonCard>
      <EcommerceNewProducts HideLinkAllView={true}/>

      <IonModal isOpen={showModal} cssClass='my-custom-class'>
        <IonContent>
          <DefaultToolbar
            title="Cari Lokasi Tujuan" color="primary" backButtonRoute={()=>setShowModal(false)}
            />
            <IonSearchbar
            placeholder="Mau kemana hari Ini?" value={searchText}
            mode="ios" className="ion-padding"
            onIonChange={e => setSearchText(e.detail.value!)}>
            </IonSearchbar>

            <IonList className="ion-padding" onClick={()=>setShowModal(false)}>
              <IonText color="medium">
                <small>Rekomendasi</small>
              </IonText>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Denmark')}>
                Denmark
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Korea')}>
                Korea
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Singapura')}>
                Singapura
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Malaysia')}>
                Malaysia
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Jakarta')}>
                Jakarta
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Surabaya')}>
                Surabaya
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Denpasar')}>
                Denpasar
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Ambon')}>
                Ambon
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Nias')}>
                Nias
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Lombok')}>
                Lombok
              </IonItem>
              <IonItem className="ion-no-padding" onClick={()=>setSearchText('Medan')}>
                Medan
              </IonItem>
            </IonList>

        </IonContent>
      </IonModal>
      </IonContent>

      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='alert'
          header={headerAlert}
          message={messageAlert}
          buttons={['OK']}
        />
    </IonPage>
  );
};
export default connect<IndexProps>({
  component: withRouter(Index)
});
