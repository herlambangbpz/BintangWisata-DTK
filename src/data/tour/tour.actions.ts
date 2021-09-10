import { ActionType } from '../../util/types';
import { getTourProductData,getTourBookingData, setTourBookingPriceTotalData, setTourBookingNumberOfPaxTotalData, setTourBookingNumberOfInfantData, setTourBookingNumberOfChildData, setTourBookingNumberOfAdultData, setTourProductEndDateData, setTourProductStartDateData, setTourProductPricingIdData, setTourProductPricingIndexData, setTourProductDetailData, getTourPaymentData, setTourPaymentAllowStatusData } from '../tourApi';
import { TourState } from './tour.state';
export const loadTourProductData = () => async (dispatch: React.Dispatch<any>) => {
  const data = await getTourProductData();
  dispatch(setData(data));
}
export const loadTourBookingData = () => async (dispatch: React.Dispatch<any>) => {
  const data = await getTourBookingData();
  dispatch(setData(data));
}
export const loadTourPaymentData = () => async (dispatch: React.Dispatch<any>) => {
  const data = await getTourPaymentData();
  dispatch(setData(data));
}
export const setData = (data: Partial<TourState>) => ({
  type: 'set-tour-data',
  data
} as const);
export const TourBookingLastSubmit = (
  TourBookingNumberOfAdult?: number,
  TourBookingNumberOfChild?:number,
  TourBookingNumberOfInfant?:number,
  TourBookingNumberOfPaxTotal?:number,
  TourBookingPriceTotal?:number,
  ) => async (dispatch: React.Dispatch<any>) => {
    setTourBookingNumberOfAdultData(TourBookingNumberOfAdult);
    setTourBookingNumberOfChildData(TourBookingNumberOfChild);
    setTourBookingNumberOfInfantData(TourBookingNumberOfInfant);
    setTourBookingNumberOfPaxTotalData(TourBookingNumberOfPaxTotal);
    setTourBookingPriceTotalData(TourBookingPriceTotal);
};
export const setTourProductDetail = (TourProductDetail?: any) => async (dispatch: React.Dispatch<any>) => {
  await setTourProductDetailData(TourProductDetail);
  setTourPaymentAllowStatusData(true)
  const data = await getTourPaymentData();
  dispatch(setData(data));
  return ({
    type: 'set-TourProductDetail',
    TourProductDetail
  } as const);
};
export const setTourProductPricingIndex = (TourProductPricingIndex?: number) => async (dispatch: React.Dispatch<any>) => {
  await setTourProductPricingIndexData(TourProductPricingIndex);
  return ({
    type: 'set-TourProductPricingIndex',
    TourProductPricingIndex
  } as const);
};
export const setTourProductPricingId = (TourProductPricingId?: number) => async (dispatch: React.Dispatch<any>) => {
  await setTourProductPricingIdData(TourProductPricingId);
  return ({
    type: 'set-TourProductPricingId',
    TourProductPricingId
  } as const);
};
export const setTourProductStartDate = (TourProductStartDate?: string) => async (dispatch: React.Dispatch<any>) => {
  await setTourProductStartDateData(TourProductStartDate);
  return ({
    type: 'set-TourProductStartDate',
    TourProductStartDate
  } as const);
};
export const setTourProductEndDate = (TourProductEndDate?: string) => async (dispatch: React.Dispatch<any>) => {
  await setTourProductEndDateData(TourProductEndDate);
  return ({
    type: 'set-TourProductEndDate',
    TourProductEndDate
  } as const);
};
export const setTourBookingNumberOfAdult = (TourBookingNumberOfAdult?: number) => async (dispatch: React.Dispatch<any>) => {
  await setTourBookingNumberOfAdultData(TourBookingNumberOfAdult);
  return ({
    type: 'set-TourBookingNumberOfAdult',
    TourBookingNumberOfAdult
  } as const);
};
export const setTourBookingNumberOfChild = (TourBookingNumberOfChild?: number) => async (dispatch: React.Dispatch<any>) => {
  await setTourBookingNumberOfChildData(TourBookingNumberOfChild);
  return ({
    type: 'set-TourBookingNumberOfChild',
    TourBookingNumberOfChild
  } as const);
};
export const setTourBookingNumberOfInfant = (TourBookingNumberOfInfant?: number) => async (dispatch: React.Dispatch<any>) => {
  await setTourBookingNumberOfInfantData(TourBookingNumberOfInfant);
  return ({
    type: 'set-TourBookingNumberOfInfant',
    TourBookingNumberOfInfant
  } as const);
};
export const setTourBookingNumberOfPaxTotal = (TourBookingNumberOfPaxTotal?: number) => async (dispatch: React.Dispatch<any>) => {
  await setTourBookingNumberOfPaxTotalData(TourBookingNumberOfPaxTotal);
  return ({
    type: 'set-TourBookingNumberOfPaxTotal',
    TourBookingNumberOfPaxTotal
  } as const);
};
export const setTourBookingPriceTotal = (TourBookingPriceTotal?: number) => async (dispatch: React.Dispatch<any>) => {
  await setTourBookingPriceTotalData(TourBookingPriceTotal);
  return ({
    type: 'set-TourBookingPriceTotal',
    TourBookingPriceTotal
  } as const);
};
export const setTourPaymentAllowStatus = (TourPaymentAllowStatus: boolean) => async (dispatch: React.Dispatch<any>) => {
  setTourPaymentAllowStatusData(TourPaymentAllowStatus);
  const data = await getTourPaymentData();
  dispatch(setData(data));
  return ({
    type: 'set-TourPaymentAllowStatus',
    TourPaymentAllowStatus
  } as const);
};
export type TourAction =
  | ActionType<typeof setData>
  | ActionType<typeof setTourProductDetail>
  | ActionType<typeof setTourProductPricingIndex>
  | ActionType<typeof setTourProductPricingId>
  | ActionType<typeof setTourProductStartDate>
  | ActionType<typeof setTourProductEndDate>
  | ActionType<typeof setTourBookingNumberOfAdult>
  | ActionType<typeof setTourBookingNumberOfChild>
  | ActionType<typeof setTourBookingNumberOfInfant>
  | ActionType<typeof setTourBookingNumberOfPaxTotal>
  | ActionType<typeof setTourBookingPriceTotal>
  | ActionType<typeof setTourPaymentAllowStatus>
