import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;
const HOTEL_ORDER_ROOM_DETAIL = "HotelOrderRoomDetail";
export const setHotelOrderRoomDetailData = async (
  HotelOrderRoomDetail?: any
) => {
  // console.log(TourProductDetail);
  if (!HotelOrderRoomDetail) {
    await Storage.remove({ key: HOTEL_ORDER_ROOM_DETAIL });
  } else {
    await Storage.set({
      key: HOTEL_ORDER_ROOM_DETAIL,
      value: JSON.stringify(HotelOrderRoomDetail),
    });
  }
};
export const getHotelOrderRoomDetailData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HOTEL_ORDER_ROOM_DETAIL }),
  ]);
  let HotelOrderRoomDetail = (await response[0].value)
    ? JSON.parse(response[0].value || "")
    : undefined;
  const data = {
    HotelOrderRoomDetail,
  };
  return data;
};
