export const isNarrowDisplay = () => {
  return window.innerWidth < 600;
};

export const forceLandscapeModeIfPossible = () => {
  if ('orientation' in screen) {
    screen.orientation.lock("landscape").then(() => {
      console.log("Landscape lock applied");
    });
  }
};