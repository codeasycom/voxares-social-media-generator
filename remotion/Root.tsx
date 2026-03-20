import { Composition } from "remotion";
import {
  Post02MorningRoutine,
  compositionConfig as post02Config,
} from "../posts/post02-morning-routine/video";
import {
  Post03PlatformOverview,
  compositionConfig as post03Config,
} from "../posts/post03-platform-overview/video";
import {
  Post04WorkflowTemplates,
  compositionConfig as post04Config,
} from "../posts/post04-workflow-templates/video";
import {
  Post05BeforeAfter,
  compositionConfig as post05Config,
} from "../posts/post05-before-after/video";

import {
  Post02MorningRoutineStory,
  compositionConfig as post02StoryConfig,
} from "../posts/post02-morning-routine/story";

export const Root: React.FC = () => {
  return (
    <>
      {/* Feed compositions */}
      <Composition
        id="Post02MorningRoutine"
        component={Post02MorningRoutine}
        durationInFrames={post02Config.durationInFrames}
        fps={post02Config.fps}
        width={post02Config.width}
        height={post02Config.height}
      />
      <Composition
        id="Post03PlatformOverview"
        component={Post03PlatformOverview}
        durationInFrames={post03Config.durationInFrames}
        fps={post03Config.fps}
        width={post03Config.width}
        height={post03Config.height}
      />
      <Composition
        id="Post04WorkflowTemplates"
        component={Post04WorkflowTemplates}
        durationInFrames={post04Config.durationInFrames}
        fps={post04Config.fps}
        width={post04Config.width}
        height={post04Config.height}
      />
      <Composition
        id="Post05BeforeAfter"
        component={Post05BeforeAfter}
        durationInFrames={post05Config.durationInFrames}
        fps={post05Config.fps}
        width={post05Config.width}
        height={post05Config.height}
      />

      {/* Story compositions */}
      <Composition
        id="Post02MorningRoutineStory"
        component={Post02MorningRoutineStory}
        durationInFrames={post02StoryConfig.durationInFrames}
        fps={post02StoryConfig.fps}
        width={post02StoryConfig.width}
        height={post02StoryConfig.height}
      />
    </>
  );
};
