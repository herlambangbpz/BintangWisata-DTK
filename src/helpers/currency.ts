export const rupiah = (val: number) => {
  val = Math.ceil(val);
  if (val) {
    var rupiah = "";
    var valrev = val.toString().split("").reverse().join("");
    for (var i = 0; i < valrev.length; i++)
      if (i % 3 === 0) rupiah += valrev.substr(i, 3) + ".";
    return (
      "Rp " +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
  } else {
    if (val === 0) {
      return "Rp 0";
    } else {
      return val;
    }
  }
};
