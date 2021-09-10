// Payment Finishing Allow Status
export const PaymentFinishingAllowStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'processed' || sts === 'waitingpayment'){
    return true
  }else{
    return false
  }
}
// Repayment Finishing Allow Status
export const RePaymentFinishingAllowStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'dpreceived'){
    return true
  }else{
    return false
  }
}
// View Invoice 1 Allow Status
export const ViewInvoice1AllowStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'dpreceived' || sts === 'paid' || sts === 'issued' || sts === 'completed'){
    return true
  }else{
    return false
  }
}
// View Invoice 2 Allow Status
export const ViewInvoice2AllowStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'paid' || sts === 'issued' || sts === 'completed'){
    return true
  }else{
    return false
  }
}
// View E-Voucher Allow Status
export const ViewEvoucherAllowStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'paid' || sts === 'issued' || sts === 'completed'){
    return true
  }else{
    return false
  }
}
// Cancel Transaction Allow Status
export const CancelTransactionAllowStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'booked' || sts === 'processed' || sts === 'waitingpayment' || sts === 'dpreceived'){
    return true
  }else{
    return false
  }
}
// Tour Manage Allow Status
export const TourManageAllowStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'partnercancelled' || sts === 'consumercancelled' || sts === 'timelimitcanceled' || sts === 'allotmentcanceled'){
    return true
  }else{
    return false
  }
}

// Payment Finishing Button Allow
export const PaymentFinishingButtonStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'processed' || sts === 'waitingpayment'){
    return true
  }else{
    return false
  }
}
// RePayment Button Allow
export const RePaymentButtonStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'dpreceived'){
    return true
  }else{
    return false
  }
}
// E-Voucher Button Allow
export const EvoucherButtonStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'paid' || sts === 'issued'){
    return true
  }else{
    return false
  }
}
// Payment Proof Button Allow
export const PaymentProofButtonStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'completed'){
    return true
  }else{
    return false
  }
}
// Start Transaction Button Allow
export const StartTransactionButtonStatus = (status:string)=>{
  const sts = status.toLowerCase()
  if(sts === 'partnercancelled' || sts === 'consumercancelled' || sts === 'timelimitcanceled' || sts === 'allotmentcanceled'){
    return true
  }else{
    return false
  }
}
