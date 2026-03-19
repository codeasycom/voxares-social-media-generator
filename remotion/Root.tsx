import { Composition } from "remotion";
import {
  Post03PlatformOverview,
  compositionConfig as post03Config,
} from "../posts/post03-platform-overview/video";
import {
  Post05BeforeAfter,
  compositionConfig as post05Config,
} from "../posts/post05-before-after/video";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Post03PlatformOverview"
        component={Post03PlatformOverview}
        durationInFrames={post03Config.durationInFrames}
        fps={post03Config.fps}
        width={post03Config.width}
        height={post03Config.height}
      />
      <Composition
        id="Post05BeforeAfter"
        component={Post05BeforeAfter}
        durationInFrames={post05Config.durationInFrames}
        fps={post05Config.fps}
        width={post05Config.width}
        height={post05Config.height}
      />
    </>
  );
};
