export const AppCategory: number = 0; //0 Tour || 1 E-Commerce
export const AppName: string = "Duta Travel";
export const DefaultAva = "/assets/img/defaultava.jpg";
export const AppLogo = "/assets/img/logo-white.png";
export const AppUrl = `http://localhost:8100/`;
export const MainUrl = `http://localhost:7882/`;
export const AppId = `AMsK1blyOSJA2w9EYA0vn9wpJZkzUv99yAr2iXq3E5Syp1tyhferFqYeasMxtR9tp3xqH0bCqhSAiMdNbf7Dew7bK3eRjAIYqQby33ab2Wh1eu06Qmp6HWCDITnzMHKX`;
export const ImageBasePath = "localhost:7882";
export const CustomRedirect = (customUrl?: string) => {
  const mainRedirect = "/main/index";
  window.location.replace(customUrl ? customUrl : mainRedirect);
};
