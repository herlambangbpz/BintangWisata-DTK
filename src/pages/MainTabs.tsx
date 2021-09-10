import React, { useEffect, useState }  from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { calendarOutline, compassOutline, bookmarkOutline, personCircleOutline } from 'ionicons/icons';
import Beranda from './Beranda';
import TransactionList from './TransactionList';
import Inbox from './Inbox';
import Account from './Account';
import './MainTabs.scss';
import { Plugins } from '@capacitor/core';
// import { resolve } from 'dns';

interface MainTabsProps { }
const MainTabs: React.FC<MainTabsProps> = () => {
  const [loggedInStatus,setLoggedInStatus] = useState<any>(null);
  useEffect(() => {
    Plugins.Storage.get({ key: 'isLoggedin' })
    .then(r=>{
      const result = r.value==='true';

      setLoggedInStatus(result?result:false);
    })
  }, []);
      return loggedInStatus===true?(
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/Main" to="/Main" />
            <Route path="/main/Index" render={() => <Beranda />} exact={true} />
            <Route path="/main/transactionList" render={() => <TransactionList />} exact={true} />
            <Route path="/main/inbox" render={() => <Inbox />} exact={true} />
            <Route path="/main/account" render={() => <Account />} exact={true} />
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
      )
      :
      loggedInStatus===false?
      (
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/Main" to="/Main" />
            <Route path="/main/Index" render={() => <Beranda />} exact={true} />
            <Route path="/main/transactionList" render={() => <Redirect to="/login"/>} exact={true} />
            <Route path="/main/inbox" render={() => <Redirect to="/login"/>} exact={true} />
            <Route path="/main/account" render={() => <Redirect to="/login"/>} exact={true} />
            {/* <Route path="/main/account" render={() => <Account />} exact={true} /> */}

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
      ):<div>loading</div>
  // if(loggedInStatus!==null){
  //   if(loggedInStatus===true){
  //     return (
  //       <IonTabs>
  //         <IonRouterOutlet>
  //           <Redirect exact path="/Main" to="/Main" />
  //           <Route path="/main/Index" render={() => <Beranda />} exact={true} />
  //           <Route path="/main/transactionList" render={() => <TransactionList />} exact={true} />
  //           <Route path="/main/inbox" render={() => <Inbox />} exact={true} />
  //           <Route path="/main/account" render={() => <Account />} exact={true} />
  //         </IonRouterOutlet>
  //         <IonTabBar slot="bottom" color="light">
  //           <IonTabButton tab="beranda" href="/main/index" className="bottomMainTabButton">
  //             <IonIcon icon={compassOutline} />
  //             <IonLabel>Beranda</IonLabel>
  //           </IonTabButton>
  //           <IonTabButton tab="transactionList" href="/main/transactionList" className="bottomMainTabButton">
  //             <IonIcon icon={calendarOutline} />
  //             <IonLabel>Pesanan</IonLabel>
  //           </IonTabButton>
  //           <IonTabButton tab="inbox" href="/main/inbox" className="bottomMainTabButton">
  //             <IonIcon icon={bookmarkOutline} />
  //             <IonLabel>Inbox</IonLabel>
  //           </IonTabButton>
  //           <IonTabButton tab="account" href="/main/account" className="bottomMainTabButton">
  //             <IonIcon icon={personCircleOutline} />
  //             <IonLabel>Akun</IonLabel>
  //           </IonTabButton>
  //         </IonTabBar>
  //       </IonTabs>
  //     );
  //   }else{
  //     return (
  //       <IonTabs>
  //         <IonRouterOutlet>
  //           <Redirect exact path="/Main" to="/Main" />
  //           <Route path="/main/Index" render={() => <Beranda />} exact={true} />
  //           <Route path="/main/transactionList" render={() => <Redirect to="/bera"/>} exact={true} />
  //           <Route path="/main/inbox" render={() => <Redirect to="/login"/>} exact={true} />
  //           <Route path="/main/account" render={() => <Redirect to="/login"/>} exact={true} />
  //         </IonRouterOutlet>
  //         <IonTabBar slot="bottom" color="light">
  //           <IonTabButton tab="beranda" href="/main/index" className="bottomMainTabButton">
  //             <IonIcon icon={compassOutline} />
  //             <IonLabel>Beranda</IonLabel>
  //           </IonTabButton>
  //           <IonTabButton tab="transactionList" href="/main/transactionList" className="bottomMainTabButton">
  //             <IonIcon icon={calendarOutline} />
  //             <IonLabel>Pesanan</IonLabel>
  //           </IonTabButton>
  //           <IonTabButton tab="inbox" href="/main/inbox" className="bottomMainTabButton">
  //             <IonIcon icon={bookmarkOutline} />
  //             <IonLabel>Inbox</IonLabel>
  //           </IonTabButton>
  //           <IonTabButton tab="account" href="/main/account" className="bottomMainTabButton">
  //             <IonIcon icon={personCircleOutline} />
  //             <IonLabel>Akun</IonLabel>
  //           </IonTabButton>
  //         </IonTabBar>
  //       </IonTabs>
  //     );
  //   }
  // }else{
  //   return(<div>authentiaticng</div>)
  // }

};

export default MainTabs;
