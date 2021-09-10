import { TourAction } from './tour.actions';
import { TourState } from './tour.state';

export const tourReducer = (state: TourState, action: TourAction): TourState => {
  switch (action.type) {
    case 'set-tour-data': {
      return { ...state, ...action.data };
    }
    case 'set-TourProductDetail': {
      return { ...state, TourProductDetail: action.TourProductDetail };
    }
    case 'set-TourProductPricingIndex': {
      return { ...state, TourProductPricingIndex: action.TourProductPricingIndex };
    }
    case 'set-TourProductPricingId': {
      return { ...state, TourProductPricingId: action.TourProductPricingId };
    }
    case 'set-TourProductStartDate': {
      return { ...state, TourProductStartDate: action.TourProductStartDate };
    }
    case 'set-TourProductEndDate': {
      return { ...state, TourProductEndDate: action.TourProductEndDate };
    }
    case 'set-TourBookingNumberOfAdult': {
      return { ...state, TourBookingNumberOfAdult: action.TourBookingNumberOfAdult };
    }
    case 'set-TourBookingNumberOfChild': {
      return { ...state, TourBookingNumberOfChild: action.TourBookingNumberOfChild };
    }
    case 'set-TourBookingNumberOfInfant': {
      return { ...state, TourBookingNumberOfInfant: action.TourBookingNumberOfInfant };
    }
    case 'set-TourBookingNumberOfPaxTotal': {
      return { ...state, TourBookingNumberOfPaxTotal: action.TourBookingNumberOfPaxTotal };
    }
    case 'set-TourBookingPriceTotal': {
      return { ...state, TourBookingPriceTotal: action.TourBookingPriceTotal };
    }
  }
}
