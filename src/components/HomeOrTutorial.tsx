import React, { useEffect, useState } from 'react';
// import { connect } from '../data/connect';
import { Redirect } from 'react-router';
import { Plugins } from '@capacitor/core';
import { isPlatform } from '@ionic/react';

interface Props { }

const HomeOrTutorial: React.FC<Props> = () => {
  const [hasSeenTutorialStatus,setHasSeenTutorialStatus] = useState<any>(null);
  useEffect(() => {
    Plugins.Storage.get({ key: 'hasSeenTutorial' })
    .then(r=>{
      const result = r.value==='true';
      if(isPlatform('cordova')){
        setHasSeenTutorialStatus(result?result:false);
      }else{
        setHasSeenTutorialStatus(true);
      }
    })
  }, []);
  return hasSeenTutorialStatus===true?(
    <Redirect to="/main/index" />
  )
  :
  hasSeenTutorialStatus===false?
  (
    <Redirect to="/tutorial" />
  ):<div>loading</div>
  // return hasSeenTutorialStatus ? <Redirect to="/main/index" /> : <Redirect to="/tutorial" />
};
export default HomeOrTutorial;

// export default connect<{}, StateProps, {}>({
//   mapStateToProps: (state) => ({
//     hasSeenTutorial: state.user.hasSeenTutorial
//   }),
//   component: HomeOrTutorial
// });
