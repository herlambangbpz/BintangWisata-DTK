export const AppCategory: number = 0; //0 Tour || 1 E-Commerce
export const AppName: string = "Bintang Wisata";
export const DefaultAva = "/assets/img/defaultava.jpg";
export const AppLogo = "/assets/img/identity/bintangwisata-logo-white.png";
export const AppUrl = `https://m.bintangwisata.co.id/`;
export const MainUrl = "https://m.bintangwisata.co.id/api/";
export const AppId = `EkefyeKCLz7t47fYWiRQYw183oTgmAX6lIBcS0352Kf5LqRrkGRBBpeaiApiF7WFGTVaFEDymLLoyb6qSkS5QGa5GjoOUr7EjXMmtt8lmusPxvmaGqJcWKHYpBxhSOyo`;
export const ImageBasePath = "https://bintangwisata.co.id";
export const ContactUsLink =
  "https://api.whatsapp.com/send?phone=628111111752&text=Jika%20Anda%20memiliki%20pertanyaan%20atau%20permintaan%20apa%20pun%20yang%20berkaitan%20dengan%20pesanan%2C%20bisa%20menghubungi%20kami.";
export const CustomRedirect = (customUrl?: string) => {
  const mainRedirect = "/main/index";
  window.location.replace(customUrl ? customUrl : mainRedirect);
};
