import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";

export type State = {
    userCastStorage: string | number | undefined,
    userLinkStorage: string | number | undefined,
    userReactionStorage: string | number | undefined,
    userDataStorage: string | number | undefined,
    userFid: string | number | undefined;
};

export const frames = createFrames({
    initialState: {
        userCastStorage: 0,
        userLinkStorage: 0,
        userReactionStorage: 0,
        userDataStorage: 0,
        userFid: 406278,
    },
    middleware: [farcasterHubContext({ hubHttpUrl: "http://localhost:3010/hub", })],
    basePath: "/frames",
});
