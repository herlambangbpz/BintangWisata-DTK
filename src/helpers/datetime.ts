export const cSharpDateCovert = (dateString: string) => {
  if (dateString) {
    const d = new Date(parseInt(dateString.replace(/[^0-9 +]/g, "")));
    var dName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    var mName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${dName[d.getDay()]}, ${d.getDate()} ${
      mName[d.getMonth()]
    } ${d.getFullYear()}`;
    //return => Sen, 13 Jan 2021
  } else {
    return "Date not found";
  }
};
export const cSharpDateHourCovert = (dateString: string) => {
  if (dateString) {
    const d = new Date(parseInt(dateString.replace(/[^0-9 +]/g, "")));
    var dName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    var mName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${dName[d.getDay()]}, ${d.getDate()} ${
      mName[d.getMonth()]
    } ${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()} WIB`;
    //return => Sen, 31 Jan 2021 | 23:59 WIB
  } else {
    return "Date not found";
  }
};
export const stringDateConvert = (dateString: string) => {
  if (dateString !== "") {
    const d = new Date(dateString);
    var dName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    var mName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${dName[d.getDay()]}, ${d.getDate()} ${
      mName[d.getMonth()]
    } ${d.getFullYear()}`;
    //return => Sen, 31 Jan 2021
  } else {
    return "";
  }
};
export const stringDateHoursConvert = (dateString: string) => {
  if (dateString !== "") {
    const d = new Date(dateString);
    var dName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    var mName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${dName[d.getDay()]}, ${d.getDate()} ${
      mName[d.getMonth()]
    } ${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()} WIB`;
    //return => Sen, 31 Jan 2021 | 23:59 WIB
  } else {
    return "";
  }
};
export const cSharpDateCovertISOString = (dateString: string) => {
  if (dateString) {
    const d = new Date(parseInt(dateString.replace(/[^0-9 +]/g, "")));
    return d.toISOString();
    //return => "2021-01-31T08:49:07.168Z"
  } else {
    return "Date not found";
  }
};
export const monthNameIndonesia = (m: number) => {
  var mName = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return mName[m];
  //return => Januari
};
export const stringDateConvertforApi = (dateString: string) => {
  if (dateString !== "") {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    //return => 01/31/2021
  } else {
    return "";
  }
};
export const stringDateConvertDashSeparate = (dateString: string) => {
  if (dateString !== "") {
    const d = new Date(dateString);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    //return => 22021/01/31
  } else {
    return "";
  }
};
