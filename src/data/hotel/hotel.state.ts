export interface HotelState {
  HotelSearch?: any;
  HotelSearchCheckInDate?: Date;
  HotelSearchCheckOutDate?: Date;
  HotelSearchRoom?: number;
  HotelSearchRoomType?: any;
  HotelSearchResults?: any;
  //HotelDetails
  HotelDetailHCode?: string;
  HotelDetailICode?: string;
  HotelDetailData?: any;
  //HotelOrder
  HotelOrderRoomDetail?: any;
  HotelOrderGuest?: any;
  HotelOrderBookingPaxes?: any;
  HotelOrderIdOrder?: string;
}
