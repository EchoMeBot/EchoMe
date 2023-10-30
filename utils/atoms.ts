import { atom } from "recoil";

export const loginState = atom({
  key: "isLogined",
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

export const darkState = atom({
  key: "isDark",
  default: false,
});
