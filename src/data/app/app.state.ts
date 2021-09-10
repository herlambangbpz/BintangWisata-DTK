import { NewsModel } from '../../models/News';
import { TourProductListModel } from '../../models/TourProdctList';
import { EcommerceProductListModel } from '../../models/EcommerceProdctList';

export interface AppState {
  news: NewsModel[];
  newTourProductList: TourProductListModel[];
  newEcommerceProductList: EcommerceProductListModel[];
}
