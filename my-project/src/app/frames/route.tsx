/* eslint-disable react/jsx-key */
import { Button, fetchMetadata } from 'frames.js/next';
import { frames } from "./frames";
import Image from 'next/image';

const frameHandler = frames(async (ctx) => {

    return {
        //
        image: (
            <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
                This is rendered as an image
            </div>
        ),
        buttons: [
            <Button action="post" target="/tatus">
                Check status
            </Button>,
        ],
    };
});

export const GET = frameHandler;
export const POST = frameHandler;