export const AppCategory: number = 0; //0 Tour || 1 E-Commerce
export const AppName: string = "Duta Travel";
export const DefaultAva = "/assets/img/defaultava.jpg";
export const AppLogo = "/assets/img/logo-white.png";
export const AppUrl = `https://mstaging.dutatravel.net/`;
export const MainUrl = "https://mstaging.dutatravel.net/api/";
export const AppId = `85nKyM6Y4gihhbQaeI9VPfdR1uux1YvPUSf226KAbaq7MUulFX8h12VjuBoeip56odNZVieoeeKoqhyCdEgXifn3V4yccRfvpQ4nwE84x4nol91ezhEHLk8sQ8FWKCcS`;
export const ImageBasePath = "https://staging.dutatravel.net";
export const CustomRedirect = (customUrl?: string) => {
  const mainRedirect = "/main/index";
  window.location.replace(customUrl ? customUrl : mainRedirect);
};
