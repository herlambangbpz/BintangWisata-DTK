import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButtons,
  IonIcon,
  IonButton,
  isPlatform,
} from "@ionic/react";
import { connect } from "../data/connect";
import "./ReadPDF.scss";
import { closeOutline, downloadOutline } from "ionicons/icons";
import {
  Downloader,
  DownloadRequest,
  NotificationVisibility,
} from "@ionic-native/downloader";

interface OwnProps {}

interface StateProps {}

interface DispatchProps {}

interface ReadPDFProps extends OwnProps, StateProps, DispatchProps {}
const ReadPDF: React.FC<ReadPDFProps> = ({}) => {
  const DownloadFile = () => {
    const FileUri =
      "https://dutatravel.net/Print/ItineraryTour?title=Labuan-Bajo-2H1M&code=5aff95fb-0b7f-4bfb-932c-5f390c82dd98";

    if (isPlatform("cordova")) {
      const request: DownloadRequest = {
        uri: FileUri,
        title: "Voucher Itenerary",
        description: "",
        mimeType: "application/pdf",
        visibleInDownloadsUi: true,
        notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
        destinationInExternalFilesDir: {
          dirType: "Downloads",
          subPath: "Voucher Itenerary.pdf",
        },
      };
      Downloader.download(request)
        .then((location: string) => alert("File downloaded at:" + location))
        .catch((error: any) => alert(error));
    } else {
      window.open(FileUri, "_blank");
    }
  };
  return (
    <IonPage id="map-view">
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton>
              <IonIcon slot="start" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Voucher</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={DownloadFile}>
              <IonIcon slot="end" icon={downloadOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="map-page">
        {/* <iframe
          src="http://docs.google.com/gview?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true" // width="100%"
          // height="500px"
          // frameborder="0"
        ></iframe> */}

        {/* <iframe src="https://docs.google.com/gview?embedded=true&url=http://www.africau.edu/images/default/sample.pdf"></iframe> */}
        {/* <iframe
          src="https://docs.google.com/gview?embedded=true&url=https://dutatravel.net/Print/ItineraryTour?title=Labuan-Bajo-2H1M&code=5aff95fb-0b7f-4bfb-932c-5f390c82dd98"
          width="100%"
          height="500px"
        ></iframe> */}
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  component: ReadPDF,
});
