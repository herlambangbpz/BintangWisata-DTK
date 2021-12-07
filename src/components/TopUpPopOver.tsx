import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../data/connect";
import { IonPopover, IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";
import { AppCategory } from "../AppConfig";

interface OwnProps {
  showTopupPopover: any;
  setShowTopupPopover: any;
}
interface DispatchProps {}
interface TopUpPopOverProps
  extends OwnProps,
    DispatchProps,
    RouteComponentProps {}

const TopUpPopOver: React.FC<TopUpPopOverProps> = ({
  history,
  showTopupPopover,
  setShowTopupPopover,
}) => {
  const [TopUpServices, setTopUpServices] = useState<any>(null);
  const [HighlightOne, setHighlightOne] = useState<any>(null);
  const [HighlightTwo, setHighlightTwo] = useState<any>(null);
  const [HighlightAll, setHighlightAll] = useState<any>(null);
  React.useEffect(() => {
    fetch("/assets/data/TopUpServices.json")
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          setTopUpServices(res);
        }
      });
  }, []);
  return (
    <IonPopover
      isOpen={showTopupPopover}
      cssClass="servicesPopover"
      onDidDismiss={(e) => setShowTopupPopover(false)}
    >
      <IonGrid fixed className="services">
        <IonRow class="ion-padding-vertical">
          {TopUpServices !== null
            ? TopUpServices.map((service: any, indexService: number) => (
                <>
                  <IonCol size="12" className="ion-padding">
                    <h5>{service.name}</h5>
                  </IonCol>
                  {service.services.map((subservice, itemSubservice) => (
                    <IonCol
                      size="3"
                      class="ion-text-center"
                      key={itemSubservice}
                      onClick={() => {
                        if (subservice.historyPush !== "") {
                          setShowTopupPopover(false);
                          AppCategory === 1
                            ? history.push("/ecommerce")
                            : history.push("/tour");
                        }
                      }}
                    >
                      <img src={subservice.imagePath} alt="" />
                      <br />
                      <IonLabel>{subservice.label}</IonLabel>
                    </IonCol>
                  ))}
                </>
              ))
            : ""}
        </IonRow>
      </IonGrid>
    </IonPopover>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  component: withRouter(TopUpPopOver),
});
