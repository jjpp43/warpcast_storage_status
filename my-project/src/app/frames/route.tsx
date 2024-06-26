/* eslint-disable react/jsx-key */
import { Button, fetchMetadata } from 'frames.js/next';
import { frames } from "./frames";
import Image from 'next/image';



const frameHandler = frames(async (ctx) => {

    return {
        //
        image: <Image src={'/background.png'} alt={''} />,
        buttons: [
            <Button action="post" target="/tatus">
                Check status
            </Button>,
        ],
    };
});


export const GET = frameHandler;
export const POST = frameHandler;