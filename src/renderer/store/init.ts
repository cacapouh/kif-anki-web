import { useAppSetting } from "@/renderer/store/setting";

const appSetting = useAppSetting();
const urlParams = new URLSearchParams(window.location.search);

export const initFlip = () => {
  const flip = urlParams.get("flip");
  if (flip) {
    appSetting.setFlipBoard(flip.toLowerCase() === "true");
  }
};
