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
            const pretendardSemiboldFont = fs.readFile(
                path.join(path.resolve(process.cwd(), "public"), "Pretendard-SemiBold.otf")
            );
            const pretendardMediumFont = fs.readFile(
                path.join(path.resolve(process.cwd(), "public"), "Pretendard-Medium.otf")
            );
            const pretendardBoldFont = fs.readFile(
                path.join(path.resolve(process.cwd(), "public"), "Pretendard-Bold.otf")
            );
            const pretendardExtraboldFont = fs.readFile(
                path.join(path.resolve(process.cwd(), "public"), "Pretendard-ExtraBold.otf")
            );


            const [Medium, Semibold, Bold, Extrabold] = await Promise.all([
                pretendardMediumFont,
                pretendardSemiboldFont,
                pretendardBoldFont,
                pretendardExtraboldFont,
            ]);

            return {
                imageOptions: {
                    fonts: [
                        {
                            name: "Pretendard-Medium",
                            data: Medium,
                        },
                        {
                            name: "Pretendard-SemiBold",
                            data: Semibold,
                        },
                        {
                            name: "Pretendard-Bold",
                            data: Bold,
                        },
                        {
                            name: "Pretendard-ExtraBold",
                            data: Extrabold,
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
