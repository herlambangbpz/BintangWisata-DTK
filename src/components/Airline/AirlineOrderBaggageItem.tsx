import React, { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonRippleEffect,
  IonModal,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonDatetime,
  IonButton,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonAlert,
  isPlatform,
  useIonViewDidEnter,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import { chevronForward, person } from "ionicons/icons";
import { close, chevronBackOutline } from "ionicons/icons";
import {
  setAirlineOrderPassengersBaggage,
  setAirlineOrderPassengersData,
} from "../../data/airline/airline.actions";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from "../../data/connect";
import * as selectors from "../../data/selectors";
import { rupiah } from "../../helpers/currency";
import { Radio } from "antd";
interface OwnProps {
  indexItem: number;
  item: any;
  BaggageData?: any;
  calculateBaggage?: any;
  indexBaggage: number;
  AOPD?: any;
  AOPB?: any;

  // PassengerTitle?: any;
  // domesticTourType: boolean;
}
interface StateProps {}
interface DispatchProps {
  setAirlineOrderPassengersData: typeof setAirlineOrderPassengersData;
  setAirlineOrderPassengersBaggage: typeof setAirlineOrderPassengersBaggage;
}
interface AirlineOrderBaggageItemProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const AirlineOrderBaggageItem: React.FC<AirlineOrderBaggageItemProps> = ({
  indexItem,
  item,
  BaggageData,
  calculateBaggage,
  indexBaggage,
  // domesticTourType,
  // PassengerTitle,
  setAirlineOrderPassengersData,
  setAirlineOrderPassengersBaggage,
  AOPD,
  AOPB,
}) => {
  const SO = {
    freeMode: true,
    slidesPerView: 2.7,
    spaceBetween: 10,
  };
  const [bd, setbd] = useState<any>(BaggageData);
  const [SlideOptions, setSlideOptions] = useState<any>(SO);
  useEffect(() => {
    if (BaggageData) {
      setbd(BaggageData);
    } else {
      setbd([]);
    }
  }, [BaggageData]);

  const changeBaggage = (val) => {
    // let AOBS = JSON.parse(localStorage.AirlineOrderBaggageSelected);
    let AOPBTemp = AOPB;
    const getBaggage =
      BaggageData[indexBaggage || 0].baggageInfos.filter(
        (b) => b.code === val
      )[0] || null;

    if (AOPBTemp && getBaggage) {
      AOPBTemp[indexBaggage][indexItem] = getBaggage;
      setAirlineOrderPassengersBaggage(AOPBTemp);
      localStorage.setItem(
        "AirlineOrderBaggageSelected",
        JSON.stringify(AOPBTemp)
      );
      calculateBaggage();
    }
  };
  const [modal, setModal] = useState(false);
  const [PaxBatikMilesNo, setPaxBatikMilesNo] = useState(item.PaxBatikMilesNo);
  const [PaxBirthCountry, setPaxBirthCountry] = useState("ID");
  const [PaxBirthDate, setPaxBirthDate] = useState(
    item.PaxBirthDate || new Date().toString()
  );
  const [PaxFirstName, setPaxFirstName] = useState(item.PaxFirstName);
  const [PaxGender, setPaxGender] = useState(item.PaxGender);
  const [PaxLastName, setPaxLastName] = useState(item.PaxLastName);
  const [PaxNationality, setPaxNationality] = useState("ID");
  const [PaxPassportExpiredDate, setPaxPassportExpiredDate] = useState(
    item.PaxPassportExpiredDate
  );
  const [PaxPassportIssuedCountry, setPaxPassportIssuedCountry] =
    useState("ID");
  const [PaxPassportIssuedDate, setPaxPassportIssuedDate] = useState(
    item.PaxPassportIssuedDate
  );
  const [PaxPassportNumber, setPaxPassportNumber] = useState(
    item.PaxPassportNumber
  );
  const [PaxGarudaFrequentFlyer, setPaxGarudaFrequentFlyer] = useState(
    item.PaxGarudaFrequentFlyer
  );
  const [PaxTitle, setPaxTitle] = useState(item.PaxTitle);
  const [CountryList, setCountryList] = useState<any>(null);
  useIonViewDidEnter(() => {
    setPaxBatikMilesNo(item.PaxBatikMilesNo);
    setPaxBirthCountry(item.PaxBirthCountry);
    setPaxBirthDate(item.PaxBirthDate);
    setPaxFirstName(item.PaxFirstName);
    setPaxGender(item.PaxGender);
    setPaxLastName(item.PaxLastName);
    setPaxNationality(item.PaxNationality);
    setPaxPassportExpiredDate(item.PaxPassportExpiredDate);
    setPaxPassportIssuedCountry(item.PaxPassportIssuedCountry);
    setPaxPassportIssuedDate(item.PaxPassportIssuedDate);
    setPaxPassportNumber(item.PaxPassportNumber);
    setPaxGarudaFrequentFlyer(item.PaxGarudaFrequentFlyer);
    setPaxTitle(item.PaxTitle);
  });
  const PaxDataSubmit = () => {
    // if (!PaxTitle || PaxTitle === "") {
    //   failedAlert("Titel Harus Dipilih");
    //   return;
    // }
    // if (!PaxFirstName || PaxFirstName === "") {
    //   failedAlert("Nama Depan Wajib Diisi");
    //   return;
    // }
    // if (!PaxLastName || PaxLastName === "") {
    //   failedAlert("Nama Belakang Wajib Diisi");
    //   return;
    // }
    // if (!PaxNationality || PaxNationality === "") {
    //   failedAlert("Kewarganegaraan Wajib dipilih");
    //   return;
    // }
    // if (!PaxBirthDate || PaxBirthDate === "") {
    //   failedAlert("Tanggal Lahir Wajib Diisi");
    //   return;
    // }
    // if (!PaxBirthCountry || PaxBirthCountry === "") {
    //   failedAlert("Negara Kelahiran Wajib Diisi");
    //   return;
    // }
    // if (!PaxGender || PaxGender === "") {
    //   failedAlert("Jenis Kelamin Wajib dipilih");
    //   return;
    // }
    PaxDataSaveToLocal();
    setModal(false);
  };
  const PaxDataSaveToLocal = () => {
    const PassengersData = AOPD;
    PassengersData[indexItem] = {
      PaxIDNumber: null,
      PaxAddOns: null,
      PaxBatikMilesNo: PaxBatikMilesNo,
      PaxBirthCountry: PaxBirthCountry,
      PaxBirthDate: PaxBirthDate,
      PaxFirstName: PaxFirstName,
      PaxGarudaFrequentFlyer: PaxGarudaFrequentFlyer,
      PaxGender: PaxGender,
      PaxLastName: PaxLastName,
      PaxNationality: PaxNationality,
      PaxParent: null,
      PaxPassportExpiredDate: PaxPassportExpiredDate,
      PaxPassportIssuedCountry: PaxPassportIssuedCountry,
      PaxPassportIssuedDate: PaxPassportIssuedDate,
      PaxPassportNumber: PaxPassportNumber,
      PaxTitle: PaxTitle,
      PaxType: (PassengersData && PassengersData.PaxType) || "",
      PaxLabel: (PassengersData && PassengersData.PaxLabel) || "",
    };
    setAirlineOrderPassengersData(PassengersData);
    // localStorage.setItem("TourOrderPaxFullData", JSON.stringify(PaxFullData));
  };
  const closeModal = () => {
    setPaxBatikMilesNo(item.PaxBatikMilesNo);
    setPaxBirthCountry(item.PaxBirthCountry);
    setPaxBirthDate(item.PaxBirthDate);
    setPaxFirstName(item.PaxFirstName);
    setPaxGender(item.PaxGender);
    setPaxLastName(item.PaxLastName);
    setPaxNationality(item.PaxNationality);
    setPaxPassportExpiredDate(item.PaxPassportExpiredDate);
    setPaxPassportIssuedCountry(item.PaxPassportIssuedCountry);
    setPaxPassportIssuedDate(item.PaxPassportIssuedDate);
    setPaxPassportNumber(item.PaxPassportNumber);
    setPaxGarudaFrequentFlyer(item.PaxGarudaFrequentFlyer);
    setPaxTitle(item.PaxTitle);
    setModal(false);
  };
  const dv = JSON.parse(localStorage.AirlineOrderBaggageSelected)[indexBaggage];
  const [dvs, setdvs] = useState<any>(null);
  const [bi, setbi] = useState<any>([]);

  useEffect(() => {
    if (dv && dv[indexItem]) {
      setdvs(dv[indexItem]);
      if (
        BaggageData !== null &&
        BaggageData[indexBaggage].baggageInfos.sort((a, b) => a.fare - b.fare)
      ) {
        setbi(
          BaggageData[indexBaggage] &&
            BaggageData[indexBaggage].baggageInfos.sort(
              (a, b) => a.fare - b.fare
            )
        );
      }
    }
  }, []);
  return (
    <IonGrid className="ion-padding-top">
      <IonRow>
        <IonCol size="12">
          <IonText color="medium">
            {item.PaxTitle}. {item.PaxFirstName} {item.PaxLastName}
          </IonText>
        </IonCol>
        {/* <IonCol size="4" className="ion-text-right">
          <IonText color="medium">5kg</IonText>
        </IonCol> */}
      </IonRow>
      <IonRow className="bb-lightgray-1 ion-padding-bottom ">
        <IonCol>
          <Radio.Group
            onChange={(e) => {
              changeBaggage(e.target.value);
            }}
            defaultValue={
              // dvs && dvs.code
              //   ? dvs && dvs.code
              //   : bi.length > 0
              //   ? bi[0].code
              //     : ""
              // ""
              // "PBAA"
              dv && dv[indexItem] !== null
                ? dv[indexItem].code
                : BaggageData !== null &&
                  BaggageData[indexBaggage].baggageInfos.sort(
                    (a, b) => a.fare - b.fare
                  )[0]
                ? BaggageData[indexBaggage].baggageInfos.sort(
                    (a, b) => a.fare - b.fare
                  )[0].code
                : ""
              // dvs && dvs.code
              //   ? dvs && dvs.code
              //   : bi.length > 0
              //   ? bi[0] !== null
              //     ? bi[0].code
              //     : ""
              //   : ""
              // item.PaxAddOns && item.PaxAddOns.Baggage
              //   ? item.PaxAddOns.Baggage
              //   : ""
            }
          >
            {(bd &&
              bd.length > 0 &&
              bd[0].baggageInfos
                .sort((a, b) => a.fare - b.fare)
                .map((baggageitem, index) => (
                  <Radio.Button value={baggageitem.code} key={index}>
                    {baggageitem.desc.split(" - ")[1]} :{" "}
                    {rupiah(baggageitem.fare)}
                  </Radio.Button>
                ))) ||
              ""}
          </Radio.Group>
          {/* <IonSlides options={SlideOptions}>
            {(bd.length > 0 &&
              bd[0].baggageInfos
                .sort((a, b) => a.fare - b.fare)
                .map((baggageitem, index) => (
                  <IonSlide
                    key={index}
                    className={
                      AOPD[indexItem] === ""
                        ? "white-bg ion-br-8 ion-p-8"
                        : "white-bg ion-br-8 ion-p-8 baggage-active"
                    }
                  >
                    <div>
                      <IonText>{baggageitem.desc.split(" - ")[1]}</IonText>
                      <IonText color="medium">
                        <p className="ion-no-margin">
                          <small>{rupiah(baggageitem.fare)}</small>
                        </p>
                      </IonText>
                    </div>
                  </IonSlide>
                ))) ||
              ""}
          </IonSlides> */}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  // mapStateToProps: (state) => ({
  //   ABDB: state.airline.AirlineBookingDataBundle,
  //   AOPD: state.airline.AirlineOrderPassengersData,
  //   UserData: selectors.getUserData(state),
  // }),
  mapDispatchToProps: {
    setAirlineOrderPassengersData,
    setAirlineOrderPassengersBaggage,
  },
  component: React.memo(withRouter(AirlineOrderBaggageItem)),
});
