import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";
import * as fs from "node:fs/promises";
import * as path from "node:path";

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

    imageRenderingOptions: async () => {
        try {
            //Problem is is doesn't seem to support variable fonts. Use static fonts in prevention of error
            const pretendardFont = fs.readFile(
                path.join(path.resolve(process.cwd(), "public"), "Pretendard-SemiBold.otf")
            );


            const [pretendardFontData] = await Promise.all([pretendardFont]);

            return {
                imageOptions: {
                    fonts: [
                        {
                            name: "Pretendard",
                            data: pretendardFontData,
                        },
                    ]
                }
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
});
