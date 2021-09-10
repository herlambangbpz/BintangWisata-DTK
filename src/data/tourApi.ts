import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
const TOUR_PRODUCT_DETAIL = 'TourProductDetail';
const TOUR_PRODUCT_PRICING_INDEX = 'TourProductPricingIndex';
const TOUR_PRODUCT_PRICING_ID = 'TourProductPricingId';
const TOUR_PRODUCT_START_DATE = 'TourProductStartDate';
const TOUR_PRODUCT_END_DATE = 'TourProductEndDate';
const TOUR_BOOKING_NUMBER_OF_ADULT = 'TourBookingNumberOfAdult';
const TOUR_BOOKING_NUMBER_OF_CHILD = 'TourBookingNumberOfChild';
const TOUR_BOOKING_NUMBER_OF_INFANT = 'TourBookingNumberOfInfant';
const TOUR_BOOKING_NUMBER_OF_PAX_TOTAL = 'TourBookingNumberOfPaxTotal';
const TOUR_BOOKING_PRICE_TOTAL = 'TourBookingPriceTotal';
const TOUR_PAYMENT_ALLOW_STATUS = 'TourPaymentAllowStatus';

export const getTourProductData = async () => {
  const response = await Promise.all([
    Storage.get({ key: TOUR_PRODUCT_DETAIL }),
    Storage.get({ key: TOUR_PRODUCT_PRICING_INDEX }),
    Storage.get({ key: TOUR_PRODUCT_PRICING_ID }),
    Storage.get({ key: TOUR_PRODUCT_START_DATE }),
    Storage.get({ key: TOUR_PRODUCT_END_DATE }),
    // Storage.get({ key: TOUR_BOOKING_NUMBER_OF_ADULT }),
    // Storage.get({ key: TOUR_BOOKING_NUMBER_OF_CHILD }),
    // Storage.get({ key: TOUR_BOOKING_NUMBER_OF_INFANT }),
    // Storage.get({ key: TOUR_BOOKING_NUMBER_OF_PAX_TOTAL }),
    // Storage.get({ key: TOUR_BOOKING_PRICE_TOTAL }),
  ]);
  const TourProductDetailTemp:any = await response[0].value || undefined;
  const TourProductDetail:any =  TourProductDetailTemp?JSON.parse(TourProductDetailTemp):undefined;
  const TourProductPricingIndex = Number(await response[1].value || undefined);
  const TourProductPricingId = Number(await response[2].value || undefined);
  const TourProductStartDate = await response[3].value || undefined;
  const TourProductEndDate = await response[4].value || undefined;
  // const TourBookingNumberOfAdult = Number(await response[5].value || undefined);
  // const TourBookingNumberOfChild = Number(await response[6].value || undefined);
  // const TourBookingNumberOfInfant = Number(await response[7].value || undefined);
  // const TourBookingNumberOfPaxTotal = Number(await response[8].value || undefined);
  // const TourBookingPriceTotal = Number(await response[9].value || undefined);

  const data = {
    TourProductDetail,
    TourProductPricingIndex,
    TourProductPricingId,
    TourProductStartDate,
    TourProductEndDate,
    // TourBookingNumberOfAdult,
    // TourBookingNumberOfChild,
    // TourBookingNumberOfInfant,
    // TourBookingNumberOfPaxTotal,
    // TourBookingPriceTotal,
  }
  // console.log(data);

  return data;
}
export const getTourBookingData = async () => {
  const response = await Promise.all([
    Storage.get({ key: TOUR_BOOKING_NUMBER_OF_ADULT }),
    Storage.get({ key: TOUR_BOOKING_NUMBER_OF_CHILD }),
    Storage.get({ key: TOUR_BOOKING_NUMBER_OF_INFANT }),
    Storage.get({ key: TOUR_BOOKING_NUMBER_OF_PAX_TOTAL }),
    Storage.get({ key: TOUR_BOOKING_PRICE_TOTAL }),
  ]);
  const TourBookingNumberOfAdult = Number(await response[0].value || undefined);
  const TourBookingNumberOfChild = Number(await response[1].value || undefined);
  const TourBookingNumberOfInfant = Number(await response[2].value || undefined);
  const TourBookingNumberOfPaxTotal = Number(await response[3].value || undefined);
  const TourBookingPriceTotal = Number(await response[4].value || undefined);

  const data = {
    TourBookingNumberOfAdult,
    TourBookingNumberOfChild,
    TourBookingNumberOfInfant,
    TourBookingNumberOfPaxTotal,
    TourBookingPriceTotal,
  }
  return data;
}
export const getTourPaymentData = async () => {
  const response = await Promise.all([
    Storage.get({ key: TOUR_PAYMENT_ALLOW_STATUS }),
  ]);
  const TourPaymentAllowStatus = await response[0].value === 'true';
  const data = {
    TourPaymentAllowStatus
  }
  return data;
}
export const setTourProductDetailData = async (TourProductDetail?: any) => {
  // console.log(TourProductDetail);
  if (!TourProductDetail) {
    await Storage.remove({ key: TOUR_PRODUCT_DETAIL });
  } else {
    await Storage.set({ key: TOUR_PRODUCT_DETAIL, value : JSON.stringify(TourProductDetail) });
  }
}
export const setTourProductPricingIndexData = async (TourProductPricingIndex?: number) => {
  if (!TourProductPricingIndex && TourProductPricingIndex !== 0) {
    await Storage.remove({ key: TOUR_PRODUCT_PRICING_INDEX });
  } else {
    await Storage.set({ key: TOUR_PRODUCT_PRICING_INDEX, value : String(TourProductPricingIndex) });
  }
}
export const setTourProductPricingIdData = async (TourProductPricingId?: number) => {
  if (!TourProductPricingId) {
    await Storage.remove({ key: TOUR_PRODUCT_PRICING_ID });
  } else {
    await Storage.set({ key: TOUR_PRODUCT_PRICING_ID, value : String(TourProductPricingId) });
  }
}
export const setTourProductStartDateData = async (TourProductStartDate?: string) => {
  if (!TourProductStartDate) {
    await Storage.remove({ key: TOUR_PRODUCT_START_DATE });
  } else {
    await Storage.set({ key: TOUR_PRODUCT_START_DATE, value : TourProductStartDate });
  }
}
export const setTourProductEndDateData = async (TourProductEndDate?: string) => {
  if (!TourProductEndDate) {
    await Storage.remove({ key: TOUR_PRODUCT_END_DATE });
  } else {
    await Storage.set({ key: TOUR_PRODUCT_END_DATE, value : TourProductEndDate});
  }
}
export const setTourBookingNumberOfAdultData = async (TourBookingNumberOfAdult?: number) => {
  if (!TourBookingNumberOfAdult) {
    await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_ADULT });
  } else {
    await Storage.set({ key: TOUR_BOOKING_NUMBER_OF_ADULT, value : String(TourBookingNumberOfAdult) });
  }
}
export const setTourBookingNumberOfChildData = async (TourBookingNumberOfChild?: number) => {
  if (!TourBookingNumberOfChild) {
    await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_CHILD });
  } else {
    await Storage.set({ key: TOUR_BOOKING_NUMBER_OF_CHILD, value : String(TourBookingNumberOfChild) });
  }
}
export const setTourBookingNumberOfInfantData = async (TourBookingNumberOfInfant?: number) => {
  if (!TourBookingNumberOfInfant) {
    await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_INFANT });
  } else {
    await Storage.set({ key: TOUR_BOOKING_NUMBER_OF_INFANT, value : String(TourBookingNumberOfInfant) });
  }
}
export const setTourBookingNumberOfPaxTotalData = async (TourBookingNumberOfPaxTotal?: number) => {
  if (!TourBookingNumberOfPaxTotal) {
    await Storage.remove({ key: TOUR_BOOKING_NUMBER_OF_PAX_TOTAL });
  } else {
    await Storage.set({ key: TOUR_BOOKING_NUMBER_OF_PAX_TOTAL, value : String(TourBookingNumberOfPaxTotal) });
  }
}
export const setTourBookingPriceTotalData = async (TourBookingPriceTotal?: number) => {
  if (!TourBookingPriceTotal) {
    await Storage.remove({ key: TOUR_BOOKING_PRICE_TOTAL });
  } else {
    await Storage.set({ key: TOUR_BOOKING_PRICE_TOTAL, value : String(TourBookingPriceTotal) });
  }
}
export const setTourPaymentAllowStatusData = async (TourPaymentAllowStatus: boolean) => {
  if (!TourPaymentAllowStatus) {
    await Storage.remove({ key: TOUR_PAYMENT_ALLOW_STATUS });
  } else {
    await Storage.set({ key: TOUR_PAYMENT_ALLOW_STATUS, value : String(TourPaymentAllowStatus) });
  }
}
