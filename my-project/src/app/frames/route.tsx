/* eslint-disable react/jsx-key */
import { Button, createFrames } from 'frames.js/next';


const frames = createFrames({
    basePath: '/frames',
});

const handleRequest = frames(async (ctx) => {
    return {
        //
        image: `http://localhost:3000/background.png`,
        buttons: [
            <Button action="post" target="/status">
                Check status
            </Button>,
        ],
    };
});

export const GET = handleRequest;
export const POST = handleRequest;