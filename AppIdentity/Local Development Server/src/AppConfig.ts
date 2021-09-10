export const AppCategory: number = 0; //0 Tour || 1 E-Commerce
export const AppName: string = "Duta Travel";
export const DefaultAva = "/assets/img/defaultava.jpg";
export const AppLogo = "/assets/img/logo-white.png";
export const AppUrl = `http://localhost:8100/`;
export const MainUrl = `http://192.168.3.202:7543/api`;
export const AppId = `vQsmUSm4asGwMKlzyGy7rIX3sJ1Uk1jpHRg4NJEFThve0ocQkcGKEFkOdCCg1R3ca5R39GKNpd2JGZWrrwVQfB0PELEtAf9M8XV6b1R8XCkEMiGyPPuUXFaWDItvj2kW`;
export const ImageBasePath = "http://182.168.3.202:7543";
export const CustomRedirect = (customUrl?: string) => {
  const mainRedirect = "/main/index";
  window.location.replace(customUrl ? customUrl : mainRedirect);
};
