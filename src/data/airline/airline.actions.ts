import { ActionType } from "../../util/types";
import // getAirlineBookingData,
// getAirlineFlightData,
// getAirlineOrderData,
// getAirlinePaymentData,
"../airlineApi";
import {
  getAirlineBookingDataBundleData,
  getAirlineOrderPassengersBaggageData,
  getAirlineOrderPassengersDataData,
  setAirlineBookingDataBundleData,
  setAirlineOrderPassengersBaggageData,
  setAirlineOrderPassengersDataData,
} from "../airlineApi";
import { AirlineState } from "./airline.state";
export const loadAirlineBookingDataBundleData =
  () => async (dispatch: React.Dispatch<any>) => {
    const data = await getAirlineBookingDataBundleData();

    dispatch(setData(data));
  };
export const setAirlineBookingDataBundle =
  (AirlineBookingDataBundle?: any) => async (dispatch: React.Dispatch<any>) => {
    setAirlineBookingDataBundleData(AirlineBookingDataBundle);
    loadAirlineBookingDataBundleData();
    return {
      type: "set-airline-booking-data-bundle",
      AirlineBookingDataBundle,
    } as const;
  };
export const loadAirlineOrderPassengersData =
  () => async (dispatch: React.Dispatch<any>) => {
    const data = await getAirlineOrderPassengersDataData();

    dispatch(setData({ AirlineOrderPassengersData: data }));
  };
export const setAirlineOrderPassengersData =
  (AirlineOrderPassengersData?: any) =>
  async (dispatch: React.Dispatch<any>) => {
    setAirlineOrderPassengersDataData(AirlineOrderPassengersData);
    loadAirlineOrderPassengersData();
    return {
      type: "set-airline-order-passengers-data",
      AirlineOrderPassengersData,
    } as const;
  };
export const loadAirlineOrderPassengersBaggage =
  () => async (dispatch: React.Dispatch<any>) => {
    const data = await getAirlineOrderPassengersBaggageData();

    dispatch(setData({ AirlineOrderPassengersBaggage: data }));
  };
export const setAirlineOrderPassengersBaggage =
  (AirlineOrderPassengersBaggage?: any) =>
  async (dispatch: React.Dispatch<any>) => {
    setAirlineOrderPassengersBaggageData(AirlineOrderPassengersBaggage);
    loadAirlineOrderPassengersBaggage();
    return {
      type: "set-airline-order-passengers-baggage",
      AirlineOrderPassengersBaggage,
    } as const;
  };
// export const loadAirlineBookingData =
//   () => async (dispatch: React.Dispatch<any>) => {
//     const data = await getAirlineBookingData();
//     dispatch(setData(data));
//   };
// export const loadAirlineFlightData =
//   () => async (dispatch: React.Dispatch<any>) => {
//     const data = await getAirlineFlightData();
//     dispatch(setData(data));
//   };
// export const loadAirlineOrderData =
//   () => async (dispatch: React.Dispatch<any>) => {
//     const data = await getAirlineOrderData();
//     dispatch(setData(data));
//   };
// export const loadAirlinePaymentData =
//   () => async (dispatch: React.Dispatch<any>) => {
//     const data = await getAirlinePaymentData();
//     dispatch(setData(data));
//   };
export const setData = (data: Partial<AirlineState>) =>
  ({
    type: "set-airline-data",
    data,
  } as const);
export const setAirlineOriginRoutes = (AirlineOriginRoutes?: any) =>
  ({
    type: "set-airline-origin-routes",
    AirlineOriginRoutes,
  } as const);
export const setAirlineBookingOrigin = (AirlineBookingOrigin?: string) =>
  ({
    type: "set-airline-booking-origin",
    AirlineBookingOrigin,
  } as const);
export const setAirlineBookingDestination = (
  AirlineBookingDestination?: string
) =>
  ({
    type: "set-airline-booking-destination",
    AirlineBookingDestination,
  } as const);
export const setAirlineBookingOriginDetail = (
  AirlineBookingOriginDetail?: string
) =>
  ({
    type: "set-airline-booking-origin-detail",
    AirlineBookingOriginDetail,
  } as const);
export const setAirlineBookingDestinationDetail = (
  AirlineBookingDestinationDetail?: string
) =>
  ({
    type: "set-airline-booking-destination-detail",
    AirlineBookingDestinationDetail,
  } as const);
export const setAirlineBookingDepartureDate = (
  AirlineBookingDepartureDate?: Date
) =>
  ({
    type: "set-airline-booking-departure-date",
    AirlineBookingDepartureDate,
  } as const);
export const setAirlineBookingArrivalDate = (
  AirlineBookingArrivalDate?: Date
) =>
  ({
    type: "set-airline-booking-arrival-date",
    AirlineBookingArrivalDate,
  } as const);
export const setAirlineBookingTripType = (AirlineBookingTripType?: string) =>
  ({
    type: "set-airline-booking-trip-type",
    AirlineBookingTripType,
  } as const);
export const setAirlineBookingNumberOfAdult = (
  AirlineBookingNumberOfAdult?: number
) =>
  ({
    type: "set-airline-booking-number-of-adult",
    AirlineBookingNumberOfAdult,
  } as const);
export const setAirlineBookingNumberOfChild = (
  AirlineBookingNumberOfChild?: number
) =>
  ({
    type: "set-airline-booking-number-of-child",
    AirlineBookingNumberOfChild,
  } as const);
export const setAirlineBookingNumberOfInfant = (
  AirlineBookingNumberOfInfant?: number
) =>
  ({
    type: "set-airline-booking-number-of-infant",
    AirlineBookingNumberOfInfant,
  } as const);
export const setAirlineBookingNumberOfPaxTotal = (
  AirlineBookingNumberOfPaxTotal?: number
) =>
  ({
    type: "set-airline-booking-number-of-pax-total",
    AirlineBookingNumberOfPaxTotal,
  } as const);
export const setAirlineFlightJourney = (AirlineFlightJourney?: any) =>
  ({
    type: "set-airline-flight-journey",
    AirlineFlightJourney,
  } as const);
export const setAirlineFlightDeparture = (AirlineFlightDeparture?: any) =>
  ({
    type: "set-airline-flight-departure",
    AirlineFlightDeparture,
  } as const);
export const setAirlineFlightArrival = (AirlineFlightArrival?: any) =>
  ({
    type: "set-airline-flight-arrival",
    AirlineFlightArrival,
  } as const);
export const setAirlineOrderPersonData = (AirlineOrderPersonData?: any) =>
  ({
    type: "set-airline-order-person-data",
    AirlineOrderPersonData,
  } as const);
// export const setAirlineOrderPassengersData = (
//   AirlineOrderPassengersData?: any
// ) =>
//   ({
//     type: "set-airline-order-passengers-data",
//     AirlineOrderPassengersData,
//   } as const);
export const setAirlineOrderPriceTotal = (AirlineOrderPriceTotal?: number) =>
  ({
    type: "set-airline-order-price-total",
    AirlineOrderPriceTotal,
  } as const);
export const setAirlinePaymentAllowStatus = (
  AirlinePaymentAllowStatus: boolean
) =>
  ({
    type: "set-airline-payment-allow-status",
    AirlinePaymentAllowStatus,
  } as const);
export const setAirlinePaymentMethod = (AirlinePaymentMethod?: string) =>
  ({
    type: "set-airline-payment-method",
    AirlinePaymentMethod,
  } as const);
export const setAirlinePaymentVoucherCode = (
  AirlinePaymentVoucherCode?: string
) =>
  ({
    type: "set-airline-payment-voucher-code",
    AirlinePaymentVoucherCode,
  } as const);
export type AirlineAction =
  | ActionType<typeof setData>
  | ActionType<typeof setAirlineOriginRoutes>
  | ActionType<typeof setAirlineBookingOrigin>
  | ActionType<typeof setAirlineBookingDestination>
  | ActionType<typeof setAirlineBookingOriginDetail>
  | ActionType<typeof setAirlineBookingDestinationDetail>
  | ActionType<typeof setAirlineBookingDepartureDate>
  | ActionType<typeof setAirlineBookingArrivalDate>
  | ActionType<typeof setAirlineBookingTripType>
  | ActionType<typeof setAirlineBookingNumberOfAdult>
  | ActionType<typeof setAirlineBookingNumberOfChild>
  | ActionType<typeof setAirlineBookingNumberOfInfant>
  | ActionType<typeof setAirlineBookingNumberOfPaxTotal>
  | ActionType<typeof setAirlineBookingOrigin>
  | ActionType<typeof setAirlineFlightJourney>
  | ActionType<typeof setAirlineFlightArrival>
  | ActionType<typeof setAirlineFlightDeparture>
  | ActionType<typeof setAirlineBookingDataBundle>
  | ActionType<typeof setAirlineOrderPersonData>
  | ActionType<typeof setAirlineOrderPassengersData>
  | ActionType<typeof setAirlineOrderPassengersBaggage>
  | ActionType<typeof setAirlineOrderPriceTotal>
  | ActionType<typeof setAirlinePaymentAllowStatus>
  | ActionType<typeof setAirlinePaymentMethod>
  | ActionType<typeof setAirlinePaymentVoucherCode>;
