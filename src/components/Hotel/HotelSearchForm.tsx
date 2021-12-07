import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import DateFnsUtils from "@date-io/date-fns";
import {
  IonActionSheet,
  IonCol,
  IonIcon,
  IonLabel,
  IonRow,
} from "@ionic/react";
import Grid from "@material-ui/core/Grid";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "date-fns";
import idLocale from "date-fns/locale/id";
import { chevronDown, chevronUp } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "../../data/connect";
import {
  setHotelSearchCheckInDate,
  setHotelSearchCheckOutDate,
  setHotelSearchRoom,
  setHotelSearchRoomType,
} from "../../data/hotel/hotel.actions";
import { stringDateConvert } from "../../helpers/datetime";
import HotelSearchFormKeys from "./HotelSearchFormKeys";

interface OwnProps {
  HSD: any;
}
interface StateProps {
  HSCID: any;
  HSCOD: any;
}
interface DispatchProps {
  setHotelSearchCheckInDate: typeof setHotelSearchCheckInDate;
  setHotelSearchCheckOutDate: typeof setHotelSearchCheckOutDate;
  setHotelSearchRoom: typeof setHotelSearchRoom;
  setHotelSearchRoomType: typeof setHotelSearchRoomType;
}
interface HotelSearchFormProps
  extends OwnProps,
    StateProps,
    DispatchProps,
    RouteComponentProps {}
const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  HSD,
  HSCID,
  HSCOD,
  setHotelSearchCheckInDate,
  setHotelSearchCheckOutDate,
  setHotelSearchRoomType,
}) => {
  const [showActionSheet, setShowActionSheet] = useState(null);
  const [HotelRoomTypeHidden, setHotelRoomTypeHidden] = useState(true);
  const [ChekInDatepickerOpen, setChekInDatepickerOpen] = useState(false);
  const [CheckOutDatepickerOpen, setCheckOutDatepickerOpen] = useState(false);
  const handleCheckInDateChange = (date) => {
    if (date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      alert("Tanggal tidak bisa dipilih");
      return;
    }
    if (date.setHours(0, 0, 0, 0) > HSCID.setHours(0, 0, 0, 0)) {
      const TempDate = new Date(date);
      const AddedDate = new Date(TempDate.setDate(date.getDate() + 1));
      setHotelSearchCheckOutDate(AddedDate);
    }
    setHotelSearchCheckInDate(date);
  };
  const handleCheckOutDateChange = (date) => {
    if (
      date.setHours(0, 0, 0, 0) <
      new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
        0,
        0,
        0,
        0
      )
    ) {
      alert("Tanggal tidak bisa dipilih");
      return;
    }
    if (date.setHours(0, 0, 0, 0) < HSCOD.setHours(0, 0, 0, 0)) {
      const TempDate = new Date(date);
      const AddedDate = new Date(TempDate.setDate(date.getDate() + -1));
      setHotelSearchCheckInDate(AddedDate);
    }
    setHotelSearchCheckOutDate(date);
  };
  const MinusRoom = () => {
    if (HSD.HotelSearchRoomType.length < 2) {
      return;
    } else {
      let RT = HSD.HotelSearchRoomType;
      RT.splice(-1);
      setHotelSearchRoomType(RT);
    }
  };
  const AddRoom = () => {
    let RT = HSD.HotelSearchRoomType;
    RT.push({ roomType: "Double" });
    setHotelSearchRoomType(RT);
  };
  return (
    <>
      <HotelSearchFormKeys></HotelSearchFormKeys>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={idLocale}>
        <Grid container justify="space-around">
          <DatePicker
            margin="normal"
            open={ChekInDatepickerOpen}
            hidden={true}
            onOpen={() => setChekInDatepickerOpen(true)}
            onClose={() => setChekInDatepickerOpen(false)}
            format="d MMM yyyy"
            value={HSCID}
            onChange={handleCheckInDateChange}
          />
          <DatePicker
            margin="normal"
            open={CheckOutDatepickerOpen}
            hidden={true}
            onOpen={() => setCheckOutDatepickerOpen(true)}
            onClose={() => setCheckOutDatepickerOpen(false)}
            format="d MMM yyyy"
            value={HSCOD}
            onChange={handleCheckOutDateChange}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <IonRow className="bb-lightgray-1">
        <IonCol size="12">
          <IonLabel color="medium">
            <small>Check In</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/Datepicker.svg" alt="" />
        </IonCol>
        <IonCol
          size="11"
          onClick={() => {
            setChekInDatepickerOpen(true);
          }}
        >
          <IonLabel>
            {stringDateConvert(HSCID ? HSCID.toISOString() : "")}
          </IonLabel>
        </IonCol>
      </IonRow>
      <IonRow className="bb-lightgray-1">
        <IonCol size="12">
          <IonLabel color="medium">
            <small>Check Out</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/Datepicker.svg" alt="" />
        </IonCol>
        <IonCol
          size="7"
          onClick={() => {
            setCheckOutDatepickerOpen(true);
          }}
        >
          <IonLabel>
            {stringDateConvert(HSCOD ? HSCOD.toISOString() : "")}
          </IonLabel>
        </IonCol>
      </IonRow>
      <IonRow className="bb-lightgray-1" onClick={() => {}}>
        <IonCol size="12">
          <IonLabel color="medium">
            <small>Jumlah Kamar</small>
          </IonLabel>
        </IonCol>
        <IonCol size="1">
          <img src="assets/icon/HotelRoomPrimary.svg" alt="" />
        </IonCol>
        <IonCol size="9">
          <IonLabel>{HSD.HotelSearchRoomType.length} Kamar</IonLabel>
        </IonCol>
        <IonCol
          onClick={() => {
            MinusRoom();
          }}
        >
          <MinusCircleOutlined />
        </IonCol>
        <IonCol
          onClick={() => {
            AddRoom();
          }}
        >
          <PlusCircleOutlined />
        </IonCol>
      </IonRow>
      <IonRow
        className="ion-margin-top ion-margin-bottom ion-p-8 gray-bg"
        onClick={() => {
          setHotelRoomTypeHidden(HotelRoomTypeHidden ? false : true);
        }}
      >
        <IonCol size="11">
          <IonLabel color="medium">Pilihan Kamar</IonLabel>
        </IonCol>
        <IonCol size="1">
          <IonIcon
            icon={HotelRoomTypeHidden ? chevronDown : chevronUp}
            color="medium"
          ></IonIcon>
        </IonCol>
      </IonRow>
      {HSD.HotelSearchRoomType.map((item, key) => (
        <IonRow
          className="bb-lightgray-1"
          onClick={() => {
            setShowActionSheet(key);
          }}
          hidden={HotelRoomTypeHidden}
        >
          <IonCol size="12">
            <IonLabel color="medium">
              <small>
                Jenis Kamar {HSD.HotelSearchRoomType.length > 1 ? key + 1 : ""}
              </small>
            </IonLabel>
          </IonCol>
          <IonCol size="1">
            <img src="assets/icon/HotelRoomDark.svg" alt="" />
          </IonCol>
          <IonCol size="10">
            <IonActionSheet
              isOpen={showActionSheet === key}
              onDidDismiss={() => setShowActionSheet(null)}
              buttons={[
                {
                  text: "Single",
                  role: "destructive",
                  handler: () => {
                    let RT = HSD.HotelSearchRoomType;
                    RT[key] = { roomType: "Single" };
                    setHotelSearchRoomType(RT);
                  },
                },
                {
                  text: "Double",
                  role: "destructive",
                  handler: () => {
                    let RT = HSD.HotelSearchRoomType;
                    RT[key] = { roomType: "Double" };
                    setHotelSearchRoomType(RT);
                  },
                },
                {
                  text: "Twin",
                  role: "destructive",
                  handler: () => {
                    let RT = HSD.HotelSearchRoomType;
                    RT[key] = { roomType: "Twin" };
                    setHotelSearchRoomType(RT);
                  },
                },
                {
                  text: "King Size",
                  role: "destructive",
                  handler: () => {
                    let RT = HSD.HotelSearchRoomType;
                    RT[key] = { roomType: "King Size" };
                    setHotelSearchRoomType(RT);
                  },
                },
              ]}
            ></IonActionSheet>
            <IonLabel>{item.roomType}</IonLabel>
          </IonCol>
          <IonCol>
            <IonIcon icon={chevronDown}></IonIcon>
          </IonCol>
        </IonRow>
      ))}
    </>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    HSCID: state.hotel.HotelSearchCheckInDate,
    HSCOD: state.hotel.HotelSearchCheckOutDate,
  }),
  mapDispatchToProps: {
    setHotelSearchCheckInDate,
    setHotelSearchCheckOutDate,
    setHotelSearchRoom,
    setHotelSearchRoomType,
  },
  component: React.memo(withRouter(HotelSearchForm)),
});
