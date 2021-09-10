export interface AirlineState {
  AirlineOriginRoutes?: any;
  // Airline Booking
  AirlineBookingOrigin?: string;
  AirlineBookingDestination?: string;
  AirlineBookingOriginDetail?: string;
  AirlineBookingDestinationDetail?: string;
  AirlineBookingDepartureDate?: Date;
  AirlineBookingArrivalDate?: Date;
  AirlineBookingTripType?: string;
  AirlineBookingNumberOfAdult?: number;
  AirlineBookingNumberOfChild?: number;
  AirlineBookingNumberOfInfant?: number;
  AirlineBookingNumberOfPaxTotal?: number;
  // Airline Flight
  AirlineFlightJourney?: any;
  AirlineFlightDeparture?: any;
  AirlineFlightArrival?: any;
  //Airline Booking Data Bundle
  AirlineBookingDataBundle?: any;
  // Airline Order
  AirlineOrderPersonData?: any;
  AirlineOrderPassengersData?: any;
  AirlineOrderPassengersBaggage?: any;
  AirlineOrderPriceTotal?: number;
  // Airline Payment
  AirlinePaymentAllowStatus: boolean;
  AirlinePaymentMethod?: string;
  AirlinePaymentVoucherCode?: string;
}
