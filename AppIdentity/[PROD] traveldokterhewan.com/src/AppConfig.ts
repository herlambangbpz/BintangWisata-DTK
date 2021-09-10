export const AppCategory: number = 0; //0 Tour || 1 E-Commerce
export const AppName: string = "Travel Dokter Hewan";
export const DefaultAva = "/assets/img/defaultava.jpg";
export const AppLogo = "/assets/img/identity/Webp.net-resizeimage (3).png";
export const AppUrl = `https://m.traveldokterhewan.com/`;
export const MainUrl = "https://m.traveldokterhewan.com/api/";
export const AppId = `9lyuwOYYgz75I5G1oQzXSGzqwYLoYTB8OmSVAHnbGknmMUpX4qesdOZwYzw2Rg6gZNDbQPGiydrSRMzbflC4XhROxsGvrElmN8L71vCEgp4ZgJOJB8v4ttLAVK9xGeB9`;
export const ImageBasePath = "https://traveldokterhewan.com";
export const CustomRedirect = (customUrl?: string) => {
  const mainRedirect = "/main/index";
  window.location.replace(customUrl ? customUrl : mainRedirect);
};
