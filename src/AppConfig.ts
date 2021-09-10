export const AppCategory: number = 0; //0 Tour || 1 E-Commerce
export const AppName: string = "Bintang Wisata";
export const DefaultAva = "/assets/img/defaultava.jpg";
export const AppLogo =
  "/assets/img/identity/LOGO-WEB-BINTANG-WISATA-BARU-2021.png";
export const AppUrl = `https://m.bintangwisata.co.id/`;
export const MainUrl = "https://m.bintangwisata.co.id/api/";
export const AppId = `EkefyeKCLz7t47fYWiRQYw183oTgmAX6lIBcS0352Kf5LqRrkGRBBpeaiApiF7WFGTVaFEDymLLoyb6qSkS5QGa5GjoOUr7EjXMmtt8lmusPxvmaGqJcWKHYpBxhSOyo`;
export const ImageBasePath = "https://bintangwisata.co.id";
export const CustomRedirect = (customUrl?: string) => {
  const mainRedirect = "/main/index";
  window.location.replace(customUrl ? customUrl : mainRedirect);
};
