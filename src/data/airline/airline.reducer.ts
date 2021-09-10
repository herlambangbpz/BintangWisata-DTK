import { AirlineAction } from "./airline.actions";
import { AirlineState } from "./airline.state";

export const airlineReducer = (
  state: AirlineState,
  action: AirlineAction
): AirlineState => {
  switch (action.type) {
    case "set-airline-data": {
      return { ...state, ...action.data };
    }
    case "set-airline-origin-routes": {
      return {
        ...state,
        AirlineOriginRoutes: action.AirlineOriginRoutes,
      };
    }
    case "set-airline-booking-origin": {
      return {
        ...state,
        AirlineBookingOrigin: action.AirlineBookingOrigin,
      };
    }
    case "set-airline-booking-destination": {
      return {
        ...state,
        AirlineBookingDestination: action.AirlineBookingDestination,
      };
    }
    case "set-airline-booking-origin-detail": {
      return {
        ...state,
        AirlineBookingOriginDetail: action.AirlineBookingOriginDetail,
      };
    }
    case "set-airline-booking-destination-detail": {
      return {
        ...state,
        AirlineBookingDestinationDetail: action.AirlineBookingDestinationDetail,
      };
    }
    case "set-airline-booking-departure-date": {
      return {
        ...state,
        AirlineBookingDepartureDate: action.AirlineBookingDepartureDate,
      };
    }
    case "set-airline-booking-arrival-date": {
      return {
        ...state,
        AirlineBookingArrivalDate: action.AirlineBookingArrivalDate,
      };
    }
    case "set-airline-booking-trip-type": {
      return {
        ...state,
        AirlineBookingTripType: action.AirlineBookingTripType,
      };
    }
    case "set-airline-booking-number-of-adult": {
      return {
        ...state,
        AirlineBookingNumberOfAdult: action.AirlineBookingNumberOfAdult,
      };
    }
    case "set-airline-booking-number-of-child": {
      return {
        ...state,
        AirlineBookingNumberOfChild: action.AirlineBookingNumberOfChild,
      };
    }
    case "set-airline-booking-number-of-infant": {
      return {
        ...state,
        AirlineBookingNumberOfInfant: action.AirlineBookingNumberOfInfant,
      };
    }
    case "set-airline-booking-number-of-pax-total": {
      return {
        ...state,
        AirlineBookingNumberOfPaxTotal: action.AirlineBookingNumberOfPaxTotal,
      };
    }
    case "set-airline-flight-journey": {
      return {
        ...state,
        AirlineFlightJourney: action.AirlineFlightJourney,
      };
    }
    case "set-airline-flight-departure": {
      return {
        ...state,
        AirlineFlightDeparture: action.AirlineFlightDeparture,
      };
    }
    case "set-airline-flight-arrival": {
      return {
        ...state,
        AirlineFlightArrival: action.AirlineFlightArrival,
      };
    }
    case "set-airline-booking-data-bundle": {
      return {
        ...state,
        AirlineBookingDataBundle: action.AirlineBookingDataBundle,
      };
    }
    case "set-airline-order-person-data": {
      return {
        ...state,
        AirlineOrderPersonData: action.AirlineOrderPersonData,
      };
    }
    case "set-airline-order-passengers-data": {
      return {
        ...state,
        AirlineOrderPassengersData: action.AirlineOrderPassengersData,
      };
    }
    case "set-airline-order-passengers-baggage": {
      return {
        ...state,
        AirlineOrderPassengersBaggage: action.AirlineOrderPassengersBaggage,
      };
    }
    case "set-airline-order-price-total": {
      return {
        ...state,
        AirlineOrderPriceTotal: action.AirlineOrderPriceTotal,
      };
    }
    case "set-airline-payment-allow-status": {
      return {
        ...state,
        AirlinePaymentAllowStatus: action.AirlinePaymentAllowStatus,
      };
    }
    case "set-airline-payment-method": {
      return {
        ...state,
        AirlinePaymentMethod: action.AirlinePaymentMethod,
      };
    }
    case "set-airline-payment-voucher-code": {
      return {
        ...state,
        AirlinePaymentVoucherCode: action.AirlinePaymentVoucherCode,
      };
    }
  }
};
