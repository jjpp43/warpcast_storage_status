/* eslint-disable react/jsx-key */
import { Button, fetchMetadata } from 'frames.js/next';
import { frames } from "./frames";



const frameHandler = frames(async (ctx) => {

    return {
        image: `https://${process.env.VERCEL_URL}/background.png`,
        buttons: [
            <Button action="post" target="/status">
                Check status
            </Button>,
        ],
    };
});


export const GET = frameHandler;
export const POST = frameHandler;