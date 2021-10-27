import { ActionType } from "../../util/types";
import { HotelState } from "./hotel.state";
export const setData = (data: Partial<HotelState>) =>
  ({
    type: "set-hotel-data",
    data,
  } as const);
export const setHotelSearch = (HotelSearch?: any) =>
  ({
    type: "set-hotel-search",
    HotelSearch,
  } as const);
export const setHotelSearchCheckInDate = (HotelSearchCheckInDate?: any) =>
  ({
    type: "set-hotel-search-check-in-date",
    HotelSearchCheckInDate,
  } as const);
export const setHotelSearchCheckOutDate = (HotelSearchCheckOutDate?: any) =>
  ({
    type: "set-hotel-search-check-out-date",
    HotelSearchCheckOutDate,
  } as const);
export const setHotelSearchRoom = (HotelSearchRoom?: any) =>
  ({
    type: "set-hotel-search-room",
    HotelSearchRoom,
  } as const);
export const setHotelSearchRoomType = (HotelSearchRoomType?: any) =>
  ({
    type: "set-hotel-search-room-type",
    HotelSearchRoomType,
  } as const);
export const setHotelDetailHCode = (HotelDetailHCode?: any) =>
  ({
    type: "set-hotel-detail-hcode",
    HotelDetailHCode,
  } as const);
export const setHotelDetailICode = (HotelDetailICode?: any) =>
  ({
    type: "set-hotel-detail-icode",
    HotelDetailICode,
  } as const);
export const setHotelDetailData = (HotelDetailData?: any) =>
  ({
    type: "set-hotel-detail-data",
    HotelDetailData,
  } as const);
export const setHotelOrderGuestRequestParameter = (
  HotelOrderGuestRequestParameter?: any
) =>
  ({
    type: "set-hotel-order-guest-request-parameter",
    HotelOrderGuestRequestParameter,
  } as const);
export const setHotelOrderBookingPaxes = (HotelOrderBookingPaxes?: any) =>
  ({
    type: "set-hotel-order-booking-paxes",
    HotelOrderBookingPaxes,
  } as const);
export const setHotelOrderIdOrder = (HotelOrderIdOrder?: any) =>
  ({
    type: "set-hotel-order-id-order",
    HotelOrderIdOrder,
  } as const);

export type HotelAction =
  | ActionType<typeof setData>
  | ActionType<typeof setHotelSearch>
  | ActionType<typeof setHotelSearchCheckInDate>
  | ActionType<typeof setHotelSearchCheckOutDate>
  | ActionType<typeof setHotelSearchRoom>
  | ActionType<typeof setHotelSearchRoomType>
  | ActionType<typeof setHotelDetailHCode>
  | ActionType<typeof setHotelDetailICode>
  | ActionType<typeof setHotelDetailData>
  | ActionType<typeof setHotelOrderGuestRequestParameter>
  | ActionType<typeof setHotelOrderBookingPaxes>
  | ActionType<typeof setHotelOrderIdOrder>;
