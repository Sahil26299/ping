import { lottieAnimProviderProptypes } from "@/src/utilities";
import Lottie from "lottie-react";

function LottieAnimationProvider({
  animationFile,
  height = 250,
  width = 250,
  autoplay = true,
  loop = true,
  lottieStyle,
}: lottieAnimProviderProptypes) {
  return (
    <>
      <Lottie
        animationData={animationFile}
        loop={loop}
        style={{ height: height, width: width, ...lottieStyle }}
        autoplay={autoplay}
      />
    </>
  );
}

export default LottieAnimationProvider;