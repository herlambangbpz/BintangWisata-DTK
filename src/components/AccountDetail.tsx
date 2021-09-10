import React, {} from 'react';
import { connect } from '../data/connect';
import {IonList, IonItem, IonText} from '@ionic/react';
import { limitWithDots } from '../helpers/stringManipulation';

interface OwnProps {}
interface StateProps{
  username? : string
  email? : string
  fullname? : string
  phone? : string
  address? : string
  city? : string
  postcode? : string
}
interface DispatchProps {}
interface AccountDetailProps extends OwnProps,StateProps,DispatchProps {}

const AccountDetail: React.FC<AccountDetailProps> =
({
  username,
  email,
  fullname,
  phone,
  address,
  city,
  postcode,
}) => {
  return (
    <IonList lines="full" className="ion-margin-bottom">
      <IonItem>
        <IonText slot="start">
          Username
        </IonText>
        <IonText slot="end" color="medium">{limitWithDots(username,20)}</IonText>
      </IonItem>
      <IonItem>
        <IonText slot="start">
          Email
        </IonText>
        <IonText slot="end" color="medium">{limitWithDots(email,20)}</IonText>
      </IonItem>
      <IonItem>
        <IonText slot="start">
          Nama Lengkap
        </IonText>
        <IonText slot="end" color="medium">{limitWithDots(fullname,20)}</IonText>
      </IonItem>
      <IonItem>
        <IonText slot="start">
          Nomor Telepon
        </IonText>
        <IonText slot="end" color="medium">{limitWithDots(phone,20)}</IonText>
      </IonItem>
      <IonItem>
        <IonText slot="start">
          Alamat
        </IonText>
        <IonText slot="end" color="medium">{limitWithDots(address,20)}</IonText>
      </IonItem>
      <IonItem>
        <IonText slot="start">
          Kota
        </IonText>
        <IonText slot="end" color="medium">{limitWithDots(city,20)}</IonText>
      </IonItem>
      <IonItem lines="none">
        <IonText slot="start">
          Kode Pos
        </IonText>
        <IonText slot="end" color="medium">{limitWithDots(postcode,20)}</IonText>
      </IonItem>
    </IonList>
  );
};

export default connect<{},StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    username: state.user.username,
    email: state.profile.email,
    fullname: state.profile.fullname,
    phone: state.profile.phone,
    address: state.profile.address,
    city: state.profile.city,
    postcode: state.profile.postcode,
  }),
  component: AccountDetail
});
