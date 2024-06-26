/* eslint-disable react/jsx-key */
import { Button, createFrames } from 'frames.js/next';


const frames = createFrames({
    basePath: '/frames',
});

const handleRequest = frames(async (ctx) => {
    return {
        //
        image: (
            <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
                This is rendered as an image
            </div>
        ),
        buttons: [
            <Button action="post" target="/status">
                Check status
            </Button>,
        ],
    };
});

export const GET = handleRequest;
export const POST = handleRequest;