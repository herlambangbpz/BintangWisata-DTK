export interface HotelState {
  HotelSearch?: any;
  HotelSearchCheckInDate?: Date;
  HotelSearchCheckOutDate?: Date;
  HotelSearchRoom?: number;
  HotelSearchRoomType?: any;

  //HotelDetails
  HotelDetailHCode?: string;
  HotelDetailICode?: string;
  HotelDetailData?: any;
  //HotelOrder
  HotelOrderGuestRequestParameter?: any;
  HotelOrderBookingPaxes?: any;
  HotelOrderIdOrder?: string;
}
