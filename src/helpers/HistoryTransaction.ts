export const getHistoryTransactionStatusName = (
  status: string,
  type: string
) => {
  if (type.toLowerCase() === "tour") {
    return tourStatusName(status.toLowerCase());
  } else if (type.toLowerCase() === "flightticket") {
    return tourStatusName(status.toLowerCase());
  } else {
    return "Tidak Diketahui";
  }
};
export const getHistoryTransactionStatusColor = (
  status: string,
  type: string
) => {
  if (type.toLowerCase() === "tour") {
    return tourStatusColor(status.toLowerCase());
  } else if (type.toLowerCase() === "flightticket") {
    return tourStatusColor(status.toLowerCase());
  } else {
    return "danger";
  }
};
export const getHistoryTransactionCtaLabel = (status: string, type: string) => {
  if (type.toLowerCase() === "tour") {
    return tourCtaLabel(status.toLowerCase());
  } else if (type.toLowerCase() === "flightticket") {
    return tourCtaLabel(status.toLowerCase());
  } else {
    return "";
  }
};
export const getHistoryTransactionCtaTarget = (
  status: string,
  type: string
) => {
  if (type.toLowerCase() === "tour") {
    return tourCtaTarget(status.toLowerCase());
  } else if (type.toLowerCase() === "flightticket") {
    return tourCtaTarget(status.toLowerCase());
  } else {
    return "";
  }
};
export const getHistoryTransactionIcon = (type: string) => {
  if (type.toLowerCase() === "flightticket") {
    return "assets/img/Services/Airplane.svg";
  } else if (type.toLowerCase() === "bus") {
    return "assets/img/Services/Bus.svg";
  } else if (type.toLowerCase() === "hotel") {
    return "assets/img/Services/Hotel.svg";
  } else if (
    type.toLowerCase() === "ordertopup" ||
    type.toLowerCase() === "ppobvoucher"
  ) {
    return "assets/img/Services/Phone.svg";
  } else if (type.toLowerCase() === "ship") {
    return "assets/img/Services/Ship.svg";
  } else if (type.toLowerCase() === "tour") {
    return "assets/img/Services/Tour.svg";
  } else {
    return "assets/icon/OthersIcon.svg";
  }
};

export const createTransactionDetailUrl = (PC: string, TID: string) => {
  if (PC.toLowerCase() === "flightticket") {
    return "/transactionHistoryDetailFlightticket/" + TID;
  } else if (PC.toLowerCase() === "bus") {
    return "/transactionHistoryDetailBus/" + TID;
  } else if (PC.toLowerCase() === "hotel") {
    return "/transactionHistoryDetailHotel/" + TID;
  } else if (
    PC.toLowerCase() === "ordertopup" ||
    PC.toLowerCase() === "ppobvoucher"
  ) {
    return "/transactionHistoryDetailTopup/" + TID;
  } else if (PC.toLowerCase() === "ship") {
    return "/transactionHistoryDetailShip/" + TID;
  } else if (PC.toLowerCase() === "tour") {
    return "/transactionHistoryDetail/" + TID;
  } else {
    return null;
  }
};

// Tour Status Name
export const tourStatusName = (status: string) => {
  if (status === "booked") {
    return "Pesanan Baru";
  } else if (status === "processed") {
    return "Pesanan Diterima";
  } else if (status === "waitingpayment") {
    return "Menunggu Pembayaran";
  } else if (status === "dpreceived") {
    return "DP Diterima";
  } else if (status === "paid") {
    return "Lunas";
  } else if (status === "issued") {
    return "Issued ";
  } else if (status === "completed") {
    return "Pesanan Selesai";
  } else if (status === "partnercancelled") {
    return "Dibatalkan Mitra";
  } else if (status === "consumercancelled") {
    return "Dibatalkan Konsumen";
  } else if (status === "timelimitcanceled") {
    return "Pesanan Kadaluarsa";
  } else if (status === "allotmentcanceled") {
    return "Dibatalkan Allotment";
  } else {
    return "Tidak Diketahui";
  }
};

// Tour Status Color
export const tourStatusColor = (status: string) => {
  if (status === "booked") {
    return "warning";
  } else if (status === "processed") {
    return "warning";
  } else if (status === "waitingpayment") {
    return "warning";
  } else if (status === "dpreceived") {
    return "success";
  } else if (status === "paid") {
    return "success";
  } else if (status === "issued") {
    return "success";
  } else if (status === "completed") {
    return "success";
  } else if (status === "partnercancelled") {
    return "danger";
  } else if (status === "consumercancelled") {
    return "danger";
  } else if (status === "timelimitcanceled") {
    return "danger";
  } else if (status === "allotmentcanceled") {
    return "danger";
  } else {
    return "danger";
  }
};

// Tour CTA Label
export const tourCtaLabel = (status: string) => {
  if (status === "booked") {
    return "Menunggu Konfirmasi";
  } else if (status === "processed") {
    return "Lanjutkan Pembayaran";
  } else if (status === "waitingpayment") {
    return "Lanjutkan Pembayaran";
  } else if (status === "dpreceived") {
    return "Lanjutkan Pelunasan";
  } else if (status === "paid") {
    return "Lihat E-Voucher ";
  } else if (status === "issued") {
    return "Lihat E-Voucher ";
  } else if (status === "completed") {
    return "Kirim Bukti Pembayaran";
  } else if (status === "partnercancelled") {
    return "Transaksi Kembali";
  } else if (status === "consumercancelled") {
    return "Transaksi Kembali";
  } else if (status === "timelimitcanceled") {
    return "Transaksi Kembali";
  } else if (status === "allotmentcanceled") {
    return "Transaksi Kembali";
  } else {
    return "";
  }
};
// Tour CTA Target
export const tourCtaTarget = (status: string) => {
  if (status === "booked") {
    return "";
  } else if (status === "processed") {
    return "/tourPayment/regular";
  } else if (status === "waitingpayment") {
    return "/tourPayment/";
  } else if (status === "dpreceived") {
    return "/tourPayment";
  } else if (status === "paid") {
    return "/evoucher";
  } else if (status === "issued") {
    return "/evoucher";
  } else if (status === "completed") {
    return "/evoucher";
  } else if (status === "partnercancelled") {
    return "/main/index";
  } else if (status === "consumercancelled") {
    return "/main/index";
  } else if (status === "timelimitcanceled") {
    return "/main/index";
  } else if (status === "allotmentcanceled") {
    return "/main/index";
  } else {
    return "";
  }
};
