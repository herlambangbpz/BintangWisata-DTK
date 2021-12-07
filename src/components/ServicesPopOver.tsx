import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../data/connect";
import { IonPopover, IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";
import { AppCategory } from "../AppConfig";
import TopUpPopOver from "../components/TopUpPopOver";

interface OwnProps {
  api: string;
  useDarmawisataServices: boolean;
}
interface DispatchProps {}
interface ServicesPopOverProps
  extends OwnProps,
    DispatchProps,
    RouteComponentProps {}

const ServicesPopOver: React.FC<ServicesPopOverProps> = ({
  history,
  api,
  useDarmawisataServices,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [showTopupPopover, setShowTopupPopover] = useState(false);
  const [DarmawisataServices, setDarmawisataServices] = useState<any>(null);
  const [DarmawisataServicesAll, setDarmawisataServicesAll] =
    useState<any>(null);
  const [HighlightOne, setHighlightOne] = useState<any>(null);
  const [HighlightTwo, setHighlightTwo] = useState<any>(null);
  const [HighlightAll, setHighlightAll] = useState<any>(null);
  React.useEffect(() => {
    fetch(
      useDarmawisataServices
        ? "/assets/data/DarmawisataServices.json"
        : "/assets/data/DarmawisataServicesNull.json"
    )
      .then((res) => res.json())
      .then((res) => {
        const DSLength = res.length;
        if (DSLength > 0) {
          setDarmawisataServices(res.slice(0, 3));
          setDarmawisataServicesAll(res);
        }
        if (api === "LocalHighlight") {
          fetch("/assets/data/Highlight.json")
            .then((res) => res.json())
            .then((res) => {
              HighlightBuild(res, DSLength);
            });
        } else {
          fetch(api)
            .then((r) => {
              if (r.ok) {
                return r.json();
              } else {
                alert("Periksa Koneksi Anda");
              }
            })
            .then((r) => {
              const Data = HighlightRename(r.Data);
              HighlightBuild(Data, DSLength);
            });
        }
      });
  }, []);
  const HighlightRename = (data: any) => {
    let CategoriesArray = new Array();
    if (data) {
      data.forEach((item) => {
        CategoriesArray.push({
          history: "/productSearch/" + item.DisplayProductDescription,
          label: "" + item.DisplayProductDescription,
          imagePath: "assets/icon/OutboundIcon.png",
        });
      });
      return CategoriesArray;
    }
  };
  const HighlightBuild = (data: any, DSLength: number) => {
    if (DSLength > 0) {
      setHighlightOne(data.slice(0, 4));
      setHighlightTwo(data.slice(4, 8));
    } else {
      if (data.length === 4) {
        setHighlightOne(data.slice(0, 4));
        setHighlightTwo(data.slice(4, 8));
      } else {
        setHighlightOne(data.slice(0, 4));
        setHighlightTwo(data.slice(4, 7));
      }
    }
    setHighlightAll(data);
  };
  return (
    <>
      <IonGrid fixed className="services">
        <IonRow class="ion-padding-vertical">
          {HighlightOne !== null
            ? HighlightOne.map((item: any, index: number) => (
                <IonCol
                  size="3"
                  class="ion-text-center"
                  key={index}
                  onClick={() => {
                    setShowPopover(false);
                    history.push(item.historyPush);
                  }}
                >
                  <img src={item.imagePath} alt="" />
                  <br />
                  <IonLabel>{item.label}</IonLabel>
                </IonCol>
              ))
            : ""}
        </IonRow>
        <IonRow class="ion-padding-bottom">
          {HighlightTwo !== null
            ? HighlightTwo.map((item: any, index: number) => (
                <IonCol
                  class="ion-text-center"
                  key={index}
                  onClick={() => {
                    setShowPopover(false);
                    history.push(item.historyPush);
                  }}
                  size="3"
                >
                  <img src={item.imagePath} alt="" />
                  <br />
                  <IonLabel>{item.label}</IonLabel>
                </IonCol>
              ))
            : ""}
          <IonCol
            class="ion-text-center"
            onClick={() => setShowPopover(true)}
            hidden={
              DarmawisataServicesAll === null && HighlightAll !== null
                ? HighlightAll.length > 8
                  ? false
                  : true
                : true
            }
            size="3"
          >
            <img src="assets/icon/OthersIcon.svg" alt="" />
            <br />
            <IonLabel>Lainnya</IonLabel>
          </IonCol>
        </IonRow>
        <IonRow
          class="ion-padding-bottom"
          hidden={DarmawisataServicesAll !== null ? false : true}
        >
          {DarmawisataServices !== null
            ? DarmawisataServices.map((item: any, index: number) => (
                <IonCol
                  class="ion-text-center"
                  key={index}
                  onClick={() => {
                    setShowPopover(false);
                    history.push(item.historyPush);
                  }}
                >
                  <img src={item.imagePath} alt="" />
                  <br />
                  <IonLabel>{item.label}</IonLabel>
                </IonCol>
              ))
            : ""}
          <IonCol class="ion-text-center" onClick={() => setShowPopover(true)}>
            <img src="assets/icon/OthersIcon.svg" alt="" />
            <br />
            <IonLabel>Lainnya</IonLabel>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonPopover
        isOpen={showPopover}
        cssClass="servicesPopover"
        onDidDismiss={(e) => setShowPopover(false)}
      >
        <IonGrid fixed className="services">
          <IonRow class="ion-padding-vertical">
            {HighlightAll !== null
              ? HighlightAll.map((item: any, index: number) => (
                  <IonCol
                    size="3"
                    class="ion-text-center"
                    key={index}
                    onClick={() => {
                      if (item.historyPush !== "") {
                        setShowPopover(false);
                        AppCategory === 1
                          ? history.push("/ecommerce")
                          : history.push("/tour");
                      }
                    }}
                  >
                    <img src={item.imagePath} alt="" />
                    <br />
                    <IonLabel>{item.label}</IonLabel>
                  </IonCol>
                ))
              : ""}
          </IonRow>
          <IonRow class="ion-padding-vertical">
            {DarmawisataServicesAll !== null
              ? DarmawisataServicesAll.map((item: any, index: number) => (
                  <IonCol
                    size="3"
                    class="ion-text-center"
                    key={index}
                    onClick={() => {
                      if (item.historyPush === "/TopUp") {
                        setShowPopover(false);
                        setShowTopupPopover(true);
                      } else if (item.historyPush !== "") {
                        setShowPopover(false);
                        AppCategory === 1
                          ? history.push("/ecommerce")
                          : history.push("/tour");
                      }
                    }}
                  >
                    <img src={item.imagePath} alt="" />
                    <br />
                    <IonLabel>{item.label}</IonLabel>
                  </IonCol>
                ))
              : ""}
          </IonRow>
        </IonGrid>
      </IonPopover>
      <TopUpPopOver
        showTopupPopover={showTopupPopover}
        setShowTopupPopover={(v) => {
          setShowTopupPopover(v);
        }}
      />
    </>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  component: withRouter(ServicesPopOver),
});
