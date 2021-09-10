import React, { useState } from 'react';

import { IonCard, IonGrid, IonRow, IonCol, IonCardContent, IonText,IonModal, IonContent, IonRippleEffect, IonIcon, IonButton, IonFooter } from '@ionic/react';
import DefaultToolbar from './shared/DefaultToolbar';
import { add } from 'ionicons/icons';
import { rupiah } from '../helpers/currency';

export default function TourOrderAddOn({TourProductAddOnList,TourBookingPriceTotal,SetAddOnPrice}: {TourProductAddOnList:any;TourBookingPriceTotal?:number,SetAddOnPrice:any}) {
  const [Modal, setModal] = useState(false);
  const [AddOnNumber, setAddOnNumber] = useState<any>(null);
  const [AddOnPayNumber, setAddOnPayNumber] = useState<number>(0);
  const [PayTotal, setPayTotal] = useState<number>(TourBookingPriceTotal||0);
  React.useEffect(()=>{

    if(TourProductAddOnList.length>0){
      let DataArray = new Array();
      TourProductAddOnList.map((item,index)=>{
        DataArray.push({
          id:item.TourProductAddOnId,
          number:0,
          price:item.TourProductAddOnHarga,
          name:item.TourProductAddOnDeskripsi+' '+item.TourProductAddOnFasilitas
        })
      })
      if(localStorage.TourOrderAddOnNumber){
        const TempTourOrderAddOnNumber = JSON.parse(localStorage.TourOrderAddOnNumber);
        // Cek Produk yang sama atau berbeda dengan produk sebelumnya
        // maka diambilkan dari localhost
        if(TempTourOrderAddOnNumber[0].id===DataArray[0].id){
          DataArray = new Array();
          DataArray = TempTourOrderAddOnNumber;
        }
      }
      setAddOnNumber(DataArray)
    }else{
      setModal(false)
    }
  }, [])
  React.useEffect(()=>{
    if(AddOnNumber!==null){
      let TempNumber = 0
      const TourPayTotal = TourBookingPriceTotal||0;
      AddOnNumber.map((item,index)=>{
        TempNumber=(TempNumber+(item.price*item.number))
      })
      setAddOnPayNumber(TempNumber);
      setPayTotal(TourPayTotal+TempNumber);
    }
  }, [AddOnNumber])
  const Plus = (index:number) =>{
    let TempArray = [...AddOnNumber];
    TempArray[index].number = TempArray[index].number+1;
    setAddOnNumber(TempArray);
  }
  const Minus = (index:number) =>{
    let TempArray = [...AddOnNumber];
    TempArray[index].number = TempArray[index].number>0?TempArray[index].number-1:0;
    setAddOnNumber(TempArray)
  }
  const submitAddOn = () =>{
    localStorage.setItem("TourOrderAddOnNumber",JSON.stringify(AddOnNumber));
    localStorage.setItem("TourOrderAddOnPayNumber",String(AddOnPayNumber));
    SetAddOnPrice(AddOnPayNumber);
    setModal(false);
  }
  const closeModal = () =>{
    const TOAON = localStorage.TourOrderAddOnNumber?JSON.parse(localStorage.TourOrderAddOnNumber):undefined;

    if(TOAON){
      setAddOnNumber(TOAON)
    }
    setModal(false);
  }
  return (
    <div className="ion-no-padding">
      <IonText class="ion-padding" color="dark">
          <small>Layanan Tambahan</small>
        </IonText>
        <IonCard className="ion-activatable ripple-parent ion-margin-bottom" onClick={()=>setModal(true)}>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="10">
                  <IonText color="dark">
                    <h6>Pilih layanan tambahan</h6>
                  </IonText>
                  <IonText><small>Opsional</small></IonText>
                </IonCol>
                <IonCol className="ion-text-right">
                  <IonIcon icon={add} color="primary" size="large"></IonIcon>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonRippleEffect></IonRippleEffect>
          </IonCardContent>
        </IonCard>
        {/* Modal Order Additional Facilities */}
        <IonModal isOpen={Modal}>
          <IonContent className="gray-bg">
            <DefaultToolbar
              title="Layanan Tambahan" color="primary" backButtonRoute={() => {closeModal()}}
            />
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  {
                    AddOnNumber?AddOnNumber.map((item,index)=>(
                      <IonCard className="ion-margin-top touchSpin" key={index}>
                        <IonCardContent>
                          <IonGrid>
                            <IonRow>
                              <IonCol size="6">
                                <div>
                                <IonText color="medium"><small>{item.name}</small></IonText>
                                <IonText color="dark"><h6>{rupiah(item.price)}</h6></IonText>
                                </div>
                              </IonCol>
                              <IonCol className="ion-text-right">
                                <IonButton onClick={()=>Minus(index)} size="small" color="light" className="btn">-</IonButton>
                                <IonButton  size="small" className="btn btn-outline-primary " disabled={true}>{item.number}</IonButton>
                                <IonButton onClick={()=>Plus(index)} size="small" className="btn btn-outline-primary ">+</IonButton>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonCardContent>
                      </IonCard>
                      // <TourOrderAddOnItem AddOnItem={item} IndexItem={index}></TourOrderAddOnItem>
                    )):(<IonText>Tidak ada add on yang bisa ditambahkan</IonText>)
                  }
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonFooter>
            <IonCard className="ion-no-margin ion-no-padding footerPrice">
              <IonGrid>
                <IonRow>
                  <IonCol size="7">
                    <IonText color="medium"><small>{rupiah(TourBookingPriceTotal||0)} + {rupiah(AddOnPayNumber)} =</small></IonText>
                    <IonText><h4 className="ion-no-margin">{rupiah(PayTotal)}</h4></IonText>
                  </IonCol>
                  <IonCol size="5">
                    <IonButton expand="block" className="text-transform-none" onClick={() => submitAddOn()}>Lanjut</IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          </IonFooter>
        </IonModal>
    </div>
  );
}
