import { atom } from "recoil";

export const loginState = atom({
  key: "isLogin",
  default: false,
});
export const emailState = atom({
  key: "email",
  default: "",
});
  
export const memberIdState = atom({
  key: "memberId",
  default: 0,
});