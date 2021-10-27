import { HotelAction } from "./hotel.actions";
import { HotelState } from "./hotel.state";

export const hotelReducer = (
  state: HotelState,
  action: HotelAction
): HotelState => {
  switch (action.type) {
    case "set-hotel-data": {
      return { ...state, ...action.data };
    }
    case "set-hotel-search": {
      return {
        ...state,
        HotelSearch: action.HotelSearch,
      };
    }
    case "set-hotel-search-check-in-date": {
      return {
        ...state,
        HotelSearchCheckInDate: action.HotelSearchCheckInDate,
      };
    }
    case "set-hotel-search-check-out-date": {
      return {
        ...state,
        HotelSearchCheckOutDate: action.HotelSearchCheckOutDate,
      };
    }
    case "set-hotel-search-room": {
      return {
        ...state,
        HotelSearchRoom: action.HotelSearchRoom,
      };
    }
    case "set-hotel-search-room-type": {
      return {
        ...state,
        HotelSearchRoomType: action.HotelSearchRoomType,
      };
    }
    //Hotel Details
    case "set-hotel-detail-hcode": {
      return {
        ...state,
        HotelDetailHCode: action.HotelDetailHCode,
      };
    }
    case "set-hotel-detail-icode": {
      return {
        ...state,
        HotelDetailICode: action.HotelDetailICode,
      };
    }
    case "set-hotel-detail-data": {
      return {
        ...state,
        HotelDetailData: action.HotelDetailData,
      };
    }
    //Hotel Order
    case "set-hotel-order-guest-request-parameter": {
      return {
        ...state,
        HotelOrderGuestRequestParameter: action.HotelOrderGuestRequestParameter,
      };
    }
    case "set-hotel-order-booking-paxes": {
      return {
        ...state,
        HotelOrderBookingPaxes: action.HotelOrderBookingPaxes,
      };
    }
    case "set-hotel-order-id-order": {
      return {
        ...state,
        HotelOrderIdOrder: action.HotelOrderIdOrder,
      };
    }
  }
};
