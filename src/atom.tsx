import { atom } from "recoil";

export const indexState = atom({
  key: "index",
  default: 0,
});

export const leavingState = atom({
  key: "leaving",
  default: false,
});
