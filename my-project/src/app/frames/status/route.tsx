/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";
import axios, { HttpStatusCode } from "axios";
import { config } from "dotenv";
import { init } from "@airstack/node";

const userData = {
    userCastStorage: "",
    userLinkStorage: "",
    userReactionStorage: "",
    userDataStorage: 0,
}

const main = async (id: number) => {
    const server = "https://hubs.airstack.xyz";
    try {
        config();
        init(`${process.env.AIRSTACK_API_KEY}`);
        const response = await axios.get(`${server}/v1/storageLimitsByFid?fid=${id}`, {

            headers: {
                "Content-Type": "application/json",
                "x-airstack-hubs": process.env.AIRSTACK_API_KEY as string,
            },
        });

        // Check if response.data is defined
        if (!response.data) {
            console.error("Response data is undefined.");
            return;
        }

        const tmp = response.data.limits;

        tmp.forEach((i: any) => {
            if (i["storeType"] === 'STORE_TYPE_CASTS') {
                var t = i['used'] / i['limit'];
                userData.userCastStorage = (parseFloat(t.toFixed(3)) * 100).toFixed(1);
            }
            if (i["storeType"] === 'STORE_TYPE_LINKS') {
                var t = i['used'] / i['limit'];
                userData.userLinkStorage = (parseFloat(t.toFixed(3)) * 100).toFixed(1);
            }
            if (i["storeType"] === 'STORE_TYPE_REACTIONS') {
                var t = i['used'] / i['limit'];
                userData.userReactionStorage = (parseFloat(t.toFixed(3)) * 100).toFixed(1);
            }
            if (i["storeType"] === 'STORE_TYPE_USER_DATA') {
                userData.userDataStorage = i['used'] - 1;
            }
        })

        console.log('Fetch Complete!')
        console.log(userData.userCastStorage);
        console.log(userData.userLinkStorage);
        console.log(userData.userReactionStorage);
        console.log(userData.userDataStorage);
        //To check what's going on with POST 302
        if (HttpStatusCode.Found) {
            // console.log(response);
        }
    } catch (e) {
        // Enhanced error logging
        if (axios.isAxiosError(e)) {
            console.error("Axios error:", e.message);
            if (e.response) {
                console.error("Response data:", e.response.data);
                console.error("Response status:", e.response.status);
                console.error("Response headers:", e.response.headers);
            }
        } else {
            console.error("Unexpected error:", e);
        }
    }
}


export const POST = frames(async (ctx) => {
    const foo = ctx.message?.castId?.fid;
    main(406278);

    console.log("foo: ", foo);
    return {
        image: <div tw="flex">Status page: {userData.userCastStorage}</div>, // foo: bar
        buttons: [
            <Button action="post" target="/">
                Return
            </Button>,
        ],
    };
});