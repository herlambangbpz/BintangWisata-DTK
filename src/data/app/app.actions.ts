import {  getNewTourProductList,getNews, getNewEcommerceProductList } from '../dataApi';
import { ActionType } from '../../util/types';
import { AppState } from './app.state';
export const loadNewsData = () => async (dispatch: React.Dispatch<object>) => {
  const data = await getNews();
  dispatch(setData(data));
}
export const loadNewTourProdctListData = () => async (dispatch: React.Dispatch<object>) => {
  const data = await getNewTourProductList();
  dispatch(setData(data));
}
export const loadNewEcommerceProdctListData = () => async (dispatch: React.Dispatch<object>) => {
  const data = await getNewEcommerceProductList();
  // console.log(data);
  // console.log('asdasdasdasdasdasd');

  dispatch(setData(data));
}
export const setData = (data: Partial<AppState>) => ({
  type: 'set-conf-data',
  data
} as const);
export type AppActions =
  | ActionType<typeof setData>
