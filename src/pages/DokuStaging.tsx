import React, { useRef, useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { connect } from "../data/connect";
import { useParams } from "react-router";
import { decode } from "string-encode-decode";
import { decodeHelp } from "../helpers/stringManipulation";

interface OwnProps {}

interface DispatchProps {}

interface SupportProps extends OwnProps, DispatchProps {}

const DokuStaging: React.FC<SupportProps> = () => {
  const parameters: any = useParams();
  const [Submitted, setSubmitted] = useState(false);
  const [DokuData, setDokuData] = useState<any>(null);
  const [DokuUrl, setDokuUrl] = useState<any>(null);
  const DokuFormRef = useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    // alert(JSON.stringify(localStorage));
    // alert('asd');
    const Data = decode(decodeHelp(parameters.data));
    // console.log(Data);

    const ReturnUrl = decode(decodeHelp(parameters.returnurl));
    // console.log(ReturnUrl);

    setDokuData(JSON.parse(Data));
    setDokuUrl(ReturnUrl);
    setTimeout(() => {
      try {
        DokuFormRef.current && DokuFormRef.current.submit();
      } catch (error) {
        alert("Gagal Mengarahkan ke Doku");
      }
    }, 2000);
    // try {
    //   setDokuData(JSON.parse(decodeURIComponent(parameters.data.replaceAll("prcntg","%"))));
    //   setParsingError(false);
    // } catch (error) {
    //   alert('data anda tidak valid 1')
    // }
    // try {
    //   setDokuUrl(decodeURIComponent(parameters.returnurl.replaceAll("prcntg","%")));
    //   setParsingError(false);
    // } catch (error) {
    //   alert('data anda tidak valid 2')
    // }
    // if(!ParsingError){
    //   setTimeout(() => {
    //     try {
    //       DokuFormRef.current && DokuFormRef.current.submit()
    //     } catch (error) {
    //       alert('data anda tidak valid 3')
    //     }
    //   }, 2000);
    // }else{
    //   alert('data anda tidak valid 4')
    // }
  }, []);
  if (Submitted) {
    return (
      <IonPage>
        <IonContent>
          <div className="loadingData">
            <img src="assets/icon/loading.svg" width="80px" />
            <br />
            Menuju Doku
          </div>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <IonContent>
          <div className="loadingData">
            <img src="assets/icon/loading.svg" width="80px" />
            <br />
            Menuju Doku
          </div>
          <form
            action={DokuUrl}
            ref={DokuFormRef}
            hidden={true}
            method="post"
            id="DokuForm"
          >
            {DokuData !== null
              ? DokuData.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    name={item.id}
                    value={item.value || ""}
                    readOnly
                  />
                ))
              : ""}
          </form>
        </IonContent>
      </IonPage>
    );
  }
};

export default connect<OwnProps, {}, DispatchProps>({
  component: DokuStaging,
});
