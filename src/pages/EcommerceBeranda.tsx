import React from 'react';
import { IonContent, IonPage} from '@ionic/react';
import { connect } from '../data/connect';
// import * as selectors from '../data/selectors';
import Header from '../components/Header';
import ServicesPopOver from '../components/ServicesPopOver';
import PromoForYou from '../components/PromoForYou';
import NewProducts from '../components/EcommerceNewProducts';
import News from '../components/News';
import './Beranda.scss';
import { RouteComponentProps } from 'react-router';

interface OwnProps {}
interface StateProps {
  name? : string
  photo? : string
  isLoggedin : boolean
};

interface DispatchProps {
}


interface BerandaListProps extends OwnProps, StateProps, DispatchProps,RouteComponentProps { };
const Beranda: React.FC<BerandaListProps> = ({ history,name,isLoggedin,photo }) => {
  return (
    <IonPage id="beranda">
      <Header
        name={name}
        isLoggedin={isLoggedin}
        photo={photo}
        color="primary"
      />
      <IonContent fullscreen={true}>
        <ServicesPopOver api="https://dutasparepart.co.id/API/ecommerce/DisplayProduct" useDarmawisataServices={true}/>
        <PromoForYou/>
        <NewProducts HideLinkAllView={false}/>
        {/* <News/> */}
      </IonContent>
    </IonPage>
  );
};

// export default connect<OwnProps, StateProps, DispatchProps>({
//   component: React.memo(Beranda)
// });
export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    name: state.user.name,
    isLoggedin: state.user.isLoggedin,
    photo: state.user.photo,
  }),
  mapDispatchToProps: {},
  component: React.memo(Beranda)
});
