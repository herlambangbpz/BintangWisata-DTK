import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;
// const AIRLINE_AIRPORT_ORIGIN_LIST = "AirlineAirportOriginList";
// const AIRLINE_AIRPORT_DESTINATION_LIST = "AirlineAirportDestinationList";

const AIRLINE_BOOKING_ORIGIN = "AirlineBookingOrigin";
const AIRLINE_BOOKING_DESTINATION = "AirlineBookingDestination";
const AIRLINE_BOOKING_DEPARTURE_DATE = "AirlineBookingDepartureDate";
const AIRLINE_BOOKING_ARRIVAL_DATE = "AirlineBookingArrivalDate";
const AIRLINE_BOOKING_NUMBER_OF_ADULT = "AirlineBookingNumberOfAdult";
const AIRLINE_BOOKING_NUMBER_OF_CHILD = "AirlineBookingNumberOfChild";
const AIRLINE_BOOKING_NUMBER_OF_INFANT = "AirlineBookingNumberOfInfant";
const AIRLINE_BOOKING_NUMBER_OF_PAX_TOTAL = "AirlineBookingNumberOfPaxTotal";

const AIRLINE_FLIGHT_DEPARTURE = "AirlineFlightDeparture";
const AIRLINE_FLIGHT_ARRIVAL = "AirlineFlightArrival";

const AIRLINE_BOOKING_DATA_BUNDLE = "AirlineBookingDataBundle";

const AIRLINE_ORDER_PERSON_DATA = "AirlineOrderPersonData";
const AIRLINE_ORDER_PASSENGERS_DATA = "AirlineOrderPassengersData";
const AIRLINE_ORDER_PASSENGERS_BAGGAGE = "AirlineOrderPassengersBaggage";
const AIRLINE_ORDER_PRICE_TOTAL = "AirlineOrderPriceTotal";

const AIRLINE_PAYMENT_ALLOW_STATUS = "AirlinePaymentAllowStatus";
const AIRLINE_PAYMENT_METHOD = "AirlinePaymentMethod";
const AIRLINE_PAYMENT_VOUCHER_CODE = "AirlinePaymentVoucherCode";
export const setAirlineBookingDataBundleData = async (
  AirlineBookingDataBundle?: any
) => {
  // console.log(TourProductDetail);
  if (!AirlineBookingDataBundle) {
    await Storage.remove({ key: AIRLINE_BOOKING_DATA_BUNDLE });
  } else {
    await Storage.set({
      key: AIRLINE_BOOKING_DATA_BUNDLE,
      value: JSON.stringify(AirlineBookingDataBundle),
    });
  }
};
export const getAirlineBookingDataBundleData = async () => {
  const response = await Promise.all([
    Storage.get({ key: AIRLINE_BOOKING_DATA_BUNDLE }),
  ]);
  let AirlineBookingDataBundle = (await response[0].value)
    ? JSON.parse(response[0].value || "")
    : undefined;
  // AirlineBookingDataBundle=JSON.parse(AirlineBookingDataBundle)
  const data = {
    AirlineBookingDataBundle,
  };
  return data;
};
export const setAirlineOrderPassengersDataData = async (
  AirlineOrderPassengersData?: any
) => {
  // console.log(TourProductDetail);
  if (!AirlineOrderPassengersData) {
    await Storage.remove({ key: AIRLINE_ORDER_PASSENGERS_DATA });
  } else {
    await Storage.set({
      key: AIRLINE_ORDER_PASSENGERS_DATA,
      value: JSON.stringify(AirlineOrderPassengersData),
    });
  }
};
export const getAirlineOrderPassengersDataData = async () => {
  const response = await Promise.all([
    Storage.get({ key: AIRLINE_ORDER_PASSENGERS_DATA }),
  ]);
  return (await response[0].value)
    ? JSON.parse(response[0].value || "")
    : undefined;
};
export const setAirlineOrderPassengersBaggageData = async (
  AirlineOrderPassengersBaggage?: any
) => {
  if (!AirlineOrderPassengersBaggage) {
    await Storage.remove({ key: AIRLINE_ORDER_PASSENGERS_BAGGAGE });
  } else {
    await Storage.set({
      key: AIRLINE_ORDER_PASSENGERS_BAGGAGE,
      value: JSON.stringify(AirlineOrderPassengersBaggage),
    });
  }
};
export const getAirlineOrderPassengersBaggageData = async () => {
  const response = await Promise.all([
    Storage.get({ key: AIRLINE_ORDER_PASSENGERS_BAGGAGE }),
  ]);
  return (await response[0].value)
    ? JSON.parse(response[0].value || "")
    : undefined;
};
// export const getAirlineBookingData = async () => {
//   const response = await Promise.all([
//     Storage.get({ key: AIRLINE_BOOKING_ORIGIN }),
//     Storage.get({ key: AIRLINE_BOOKING_DESTINATION }),
//     Storage.get({ key: AIRLINE_BOOKING_DEPARTURE_DATE }),
//     Storage.get({ key: AIRLINE_BOOKING_ARRIVAL_DATE }),
//     Storage.get({ key: AIRLINE_BOOKING_NUMBER_OF_ADULT }),
//     Storage.get({ key: AIRLINE_BOOKING_NUMBER_OF_CHILD }),
//     Storage.get({ key: AIRLINE_BOOKING_NUMBER_OF_INFANT }),
//     Storage.get({ key: AIRLINE_BOOKING_NUMBER_OF_PAX_TOTAL }),
//   ]);
//   const AirlineBookingOrigin = (await response[0].value) || undefined;
//   const AirlineBookingDestination = (await response[1].value) || undefined;
//   const AirlineBookingDepartureDate = (await response[2].value) || undefined;
//   const AirlineBookingArrivalDate = (await response[3].value) || undefined;
//   const AirlineBookingNumberOfAdult = Number(
//     (await response[4].value) || undefined
//   );
//   const AirlineBookingNumberOfChild = Number(
//     (await response[5].value) || undefined
//   );
//   const AirlineBookingNumberOfInfant = Number(
//     (await response[6].value) || undefined
//   );
//   const AirlineBookingNumberOfPaxTotal = Number(
//     (await response[7].value) || undefined
//   );

//   const data = {
//     AirlineBookingOrigin,
//     AirlineBookingDestination,
//     AirlineBookingDepartureDate,
//     AirlineBookingArrivalDate,
//     AirlineBookingNumberOfAdult,
//     AirlineBookingNumberOfChild,
//     AirlineBookingNumberOfInfant,
//     AirlineBookingNumberOfPaxTotal,
//   };
//   return data;
// };
// export const getAirlineFlightData = async () => {
//   const response = await Promise.all([
//     Storage.get({ key: AIRLINE_FLIGHT_DEPARTURE }),
//     Storage.get({ key: AIRLINE_FLIGHT_ARRIVAL }),
//   ]);
//   const AirlineFlightDeparture: any = (await response[0].value) || undefined;
//   const AirlineFlightArrival: any = (await response[1].value) || undefined;
//   const data = {
//     AirlineFlightDeparture,
//     AirlineFlightArrival,
//   };
//   return data;
// };
// export const getAirlineOrderData = async () => {
//   const response = await Promise.all([
//     Storage.get({ key: AIRLINE_ORDER_PERSON_DATA }),
//     Storage.get({ key: AIRLINE_ORDER_PASSENGERS_DATA }),
//     Storage.get({ key: AIRLINE_ORDER_PASSENGERS_BAGGAGE }),
//     Storage.get({ key: AIRLINE_ORDER_PRICE_TOTAL }),
//   ]);
//   const AirlineOrderPersonData: any = (await response[0].value) || undefined;
//   const AirlineOrderPassengersData: any =
//     (await response[1].value) || undefined;
//   const AirlineOrderPassengersBaggage: any =
//     (await response[2].value) || undefined;
//   const AirlineOrderPriceTotal = Number((await response[3].value) || undefined);
//   const data = {
//     AirlineOrderPersonData,
//     AirlineOrderPassengersData,
//     AirlineOrderPassengersBaggage,
//     AirlineOrderPriceTotal,
//   };
//   return data;
// };
// export const getAirlinePaymentData = async () => {
//   const response = await Promise.all([
//     Storage.get({ key: AIRLINE_PAYMENT_ALLOW_STATUS }),
//     Storage.get({ key: AIRLINE_PAYMENT_METHOD }),
//     Storage.get({ key: AIRLINE_PAYMENT_VOUCHER_CODE }),
//   ]);
//   const AirlinePaymentAllowStatus = (await response[0].value) === "true";
//   const AirlinePaymentMethod = (await response[1].value) || undefined;
//   const AirlinePaymentVoucherCode = (await response[2].value) || undefined;
//   const data = {
//     AirlinePaymentAllowStatus,
//     AirlinePaymentMethod,
//     AirlinePaymentVoucherCode,
//   };
//   return data;
// };
// export const setAirlineAirportOriginListData = async (
//   AirlineAirportOriginList?: any
// ) => {
//   // console.log(TourProductDetail);
//   if (!AirlineAirportOriginList) {
//     await Storage.remove({ key: AIRLINE_AIRPORT_ORIGIN_LIST });
//   } else {
//     await Storage.set({
//       key: AIRLINE_AIRPORT_ORIGIN_LIST,
//       value: JSON.stringify(AirlineAirportOriginList),
//     });
//   }
// };
// export const setAirlineAirportDestinationListData = async (
//   AirlineAirportDestinationList?: any
// ) => {
//   // console.log(TourProductDetail);
//   if (!AirlineAirportDestinationList) {
//     await Storage.remove({ key: AIRLINE_AIRPORT_DESTINATION_LIST });
//   } else {
//     await Storage.set({
//       key: AIRLINE_AIRPORT_DESTINATION_LIST,
//       value: JSON.stringify(AirlineAirportDestinationList),
//     });
//   }
// };
// export const setTourProductPricingIndexData = async (
//   TourProductPricingIndex?: number
// ) => {
//   if (!TourProductPricingIndex && TourProductPricingIndex !== 0) {
//     await Storage.remove({ key: TOUR_PRODUCT_PRICING_INDEX });
//   } else {
//     await Storage.set({
//       key: TOUR_PRODUCT_PRICING_INDEX,
//       value: String(TourProductPricingIndex),
//     });
//   }
// };
// export const setTourProductPricingIdData = async (
//   TourProductPricingId?: number
// ) => {
//   if (!TourProductPricingId) {
//     await Storage.remove({ key: TOUR_PRODUCT_PRICING_ID });
//   } else {
//     await Storage.set({
//       key: TOUR_PRODUCT_PRICING_ID,
//       value: String(TourProductPricingId),
//     });
//   }
// };
// export const setTourProductStartDateData = async (
//   TourProductStartDate?: string
// ) => {
//   if (!TourProductStartDate) {
//     await Storage.remove({ key: TOUR_PRODUCT_START_DATE });
//   } else {
//     await Storage.set({
//       key: TOUR_PRODUCT_START_DATE,
//       value: TourProductStartDate,
//     });
//   }
// };
// export const setTourProductEndDateData = async (
//   TourProductEndDate?: string
// ) => {
//   if (!TourProductEndDate) {
//     await Storage.remove({ key: TOUR_PRODUCT_END_DATE });
//   } else {
//     await Storage.set({
//       key: TOUR_PRODUCT_END_DATE,
//       value: TourProductEndDate,
//     });
//   }
// };
// export const setTourBookingNumberOfAdultData = async (
//   TourBookingNumberOfAdult?: number
// ) => {
//   if (!TourBookingNumberOfAdult) {
//     await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_ADULT });
//   } else {
//     await Storage.set({
//       key: TOUR_BOOKING_NUMBER_OF_ADULT,
//       value: String(TourBookingNumberOfAdult),
//     });
//   }
// };
// export const setTourBookingNumberOfChildData = async (
//   TourBookingNumberOfChild?: number
// ) => {
//   if (!TourBookingNumberOfChild) {
//     await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_CHILD });
//   } else {
//     await Storage.set({
//       key: TOUR_BOOKING_NUMBER_OF_CHILD,
//       value: String(TourBookingNumberOfChild),
//     });
//   }
// };
// export const setTourBookingNumberOfInfantData = async (
//   TourBookingNumberOfInfant?: number
// ) => {
//   if (!TourBookingNumberOfInfant) {
//     await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_INFANT });
//   } else {
//     await Storage.set({
//       key: TOUR_BOOKING_NUMBER_OF_INFANT,
//       value: String(TourBookingNumberOfInfant),
//     });
//   }
// };
// export const setTourBookingNumberOfPaxTotalData = async (
//   TourBookingNumberOfPaxTotal?: number
// ) => {
//   if (!TourBookingNumberOfPaxTotal) {
//     await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_PAX_TOTAL });
//   } else {
//     await Storage.set({
//       key: TOUR_BOOKING_NUMBER_OF_PAX_TOTAL,
//       value: String(TourBookingNumberOfPaxTotal),
//     });
//   }
// };
// export const setTourBookingPriceTotalData = async (
//   TourBookingPriceTotal?: number
// ) => {
//   if (!TourBookingPriceTotal) {
//     await Storage.remove({ key: TOUR_BOOKING_PRICE_TOTAL });
//   } else {
//     await Storage.set({
//       key: TOUR_BOOKING_PRICE_TOTAL,
//       value: String(TourBookingPriceTotal),
//     });
//   }
// };
// export const setTourPaymentAllowStatusData = async (
//   TourPaymentAllowStatus: boolean
// ) => {
//   if (!TourPaymentAllowStatus) {
//     await Storage.remove({ key: TOUR_PAYMENT_ALLOW_STATUS });
//   } else {
//     await Storage.set({
//       key: TOUR_PAYMENT_ALLOW_STATUS,
//       value: String(TourPaymentAllowStatus),
//     });
//   }
// };
