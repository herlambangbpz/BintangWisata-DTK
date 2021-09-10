import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../data/connect";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonSearchbar,
} from "@ionic/react";
import { DefaultAva, AppLogo } from "../AppConfig";
interface OwnProps {
  name: any;
  color: any;
  isLoggedin: boolean;
  photo: any;
}
interface DispatchProps {}
interface ServicesPopOverProps
  extends OwnProps,
    DispatchProps,
    RouteComponentProps {}

const Header: React.FC<ServicesPopOverProps> = ({
  history,
  name,
  color,
  isLoggedin,
  photo,
}) => {
  // export default function Header({ name, color,isLoggedin,photo}: { name: any; color: any;isLoggedin:boolean; photo: any; }) {
  const [searchText, setSearchText] = useState("");
  const SearctWithText = (key) => {
    if (key === "Enter") {
      if (!localStorage.filterStartDate && !localStorage.filterEndDate) {
        localStorage.setItem(
          "filterStartDate",
          new Date(new Date().setDate(new Date().getDate() + 6)).toISOString()
        );
        localStorage.setItem(
          "filterEndDate",
          new Date(new Date().setDate(new Date().getDate() + 14)).toISOString()
        );
      }
      localStorage.setItem("filterSearchText", searchText);

      history.push("/tourSearch");
    }
  };
  return (
    <IonHeader translucent>
      <IonToolbar color={color}>
        <IonTitle>
          <img src={AppLogo} height="32px" width="auto" alt="" />
        </IonTitle>
        <IonButtons slot="end">
          <IonButton routerLink={isLoggedin ? "/main/account" : "/login"}>
            {isLoggedin ? "Hi, " + name : "Masuk | Daftar"}
            {isLoggedin ? <img src={photo || DefaultAva} alt="" /> : ""}
            {/* Hi, {name}
          <img src="assets/img/ava.png" alt=""/> */}
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonToolbar color="primary" className="search">
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          placeholder="Mau kemana hari ini?"
          onKeyUp={(e) => {
            SearctWithText(e.key);
          }}
        ></IonSearchbar>
      </IonToolbar>
    </IonHeader>
  );
};
export default connect<OwnProps, {}, DispatchProps>({
  component: withRouter(Header),
});
