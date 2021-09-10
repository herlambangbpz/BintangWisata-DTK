export const limitWithDots = (val?:string,limit?:number) => {
  if(val && limit){
    if (val.length<=limit) {
      return val
    } else {
      return val.substring(0,limit)+'...'
    }
  }else{
    return ''
  }
}
export const encodeHelp = (string:any) =>{
  let stringEncode = string;
  stringEncode = stringEncode.replaceAll("%",'pct');
  stringEncode = stringEncode.replaceAll("_",'usc');
  stringEncode = stringEncode.replaceAll("-",'dsh');
  stringEncode = stringEncode.replaceAll("#",'csh');
  stringEncode = stringEncode.replaceAll("$",'dlr');
  return stringEncode
}
export const decodeHelp = (string:any) =>{
  let stringDecode = string;
  stringDecode = stringDecode.replaceAll("pct",'%');
  stringDecode = stringDecode.replaceAll("usc",'_');
  stringDecode = stringDecode.replaceAll("dsh",'-');
  stringDecode = stringDecode.replaceAll("csh",'#');
  stringDecode = stringDecode.replaceAll("dlr",'$');
  return stringDecode
}
