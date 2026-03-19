import { Composition } from "remotion";
import {
  Post02BeforeAfter,
  compositionConfig,
} from "../posts/post02-before-after/video";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Post02BeforeAfter"
        component={Post02BeforeAfter}
        durationInFrames={compositionConfig.durationInFrames}
        fps={compositionConfig.fps}
        width={compositionConfig.width}
        height={compositionConfig.height}
      />
    </>
  );
};
