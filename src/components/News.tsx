import React, {useEffect} from 'react';
import { NewsModel } from '../models/News';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import { loadNewsData } from '../data/app/app.actions';
import { IonSlides, IonSlide,IonGrid, IonRow, IonCol, IonTitle, IonRouterLink,IonIcon} from '@ionic/react';
import {chevronForward} from 'ionicons/icons';
const slideOpts = {
  freeMode: true,
  slidesPerView: 1.2,
  spaceBetween :20
};
interface OwnProps { };
interface StateProps {
  NewsData: NewsModel[];
};
interface DispatchProps {
  loadNewsData: typeof loadNewsData;
}
interface NewsListProps extends OwnProps, StateProps, DispatchProps { };
const News: React.FC<NewsListProps> = ({ NewsData,loadNewsData }) => {
  useEffect(() => {
    loadNewsData();
    // eslint-disable-next-line
  }, []);
  return (
    <IonGrid className="news-wrapper ion-padding-top">
            <IonRow>
              <IonCol size="8">
                <IonTitle className="ion-no-padding">Berita buat kamu</IonTitle>
              </IonCol>
              <IonCol size="4" className="ion-text-right">
                <IonRouterLink>lihat semua <IonIcon icon={chevronForward}></IonIcon></IonRouterLink>
              </IonCol>
              <IonCol size="12">
                {NewsData.length>0?(
                  <IonSlides options={slideOpts} class="customFreeSlides">
                    {NewsData.map((dataItem,index) => (
                      <IonSlide key={index} onClick={()=>{window.open(`${dataItem.url}`)}}>
                      <p className="ion-text-left ion-color-light">
                        <img src={dataItem.urlToImage} width="100%"className="shadow-card ion-margin-bottom ofc newsThumbnail"/>
                        {dataItem.title}
                      </p>
                    </IonSlide>
                    ))}
                </IonSlides>
                )
                :'Tidak ada berita'}
              </IonCol>
            </IonRow>
          </IonGrid>
  );
};
export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    NewsData: selectors.getNews(state),
  }),
  mapDispatchToProps: { loadNewsData },
  component: React.memo(News)
});

