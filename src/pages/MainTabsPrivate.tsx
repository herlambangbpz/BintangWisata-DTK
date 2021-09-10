import React  from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { calendarOutline, compassOutline, bookmarkOutline, personCircleOutline } from 'ionicons/icons';
import Beranda from './Beranda';
import './MainTabs.scss';
import Login from '../pages/Member/Login';

interface MainTabsPrivateProps { }

const MainTabsPrivate: React.FC<MainTabsPrivateProps> = () => {

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/Main" to="/Main" />
        <Route path="/main/Index" render={() => <Beranda />} exact={true} />
        <Route path="/main/transactionList" render={() => <Redirect to="/login" />} exact={true} />
        <Route path="/main/inbox" render={() => <Redirect to="/login" />} exact={true} />
        <Route path="/main/account" render={() => <Redirect to="/login" />} exact={true} />
        {/* <Route path="/main/transactionList" component={Login} />
        <Route path="/main/inbox" component={Login} />
        <Route path="/main/account" component={Login} /> */}
      </IonRouterOutlet>
      <IonTabBar slot="bottom" color="light">
        <IonTabButton tab="beranda" href="/main/index" className="bottomMainTabButton">
          <IonIcon icon={compassOutline} />
          <IonLabel>Beranda</IonLabel>
        </IonTabButton>
        <IonTabButton tab="transactionList" href="/main/transactionList" className="bottomMainTabButton">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Pesanan</IonLabel>
        </IonTabButton>
        <IonTabButton tab="inbox" href="/main/inbox" className="bottomMainTabButton">
          <IonIcon icon={bookmarkOutline} />
          <IonLabel>Inbox</IonLabel>
        </IonTabButton>
        <IonTabButton tab="account" href="/main/account" className="bottomMainTabButton">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Akun</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabsPrivate;
