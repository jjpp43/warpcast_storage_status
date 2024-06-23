/* eslint-disable react/jsx-key */

import { frames } from "../frames";
import { Button } from "frames.js/next";
import axios, { HttpStatusCode } from "axios";
import { config } from "dotenv";
import { init } from "@airstack/node";

config();
init(`${process.env.AIRSTACK_API_KEY}`);

const server = "https://hubs.airstack.xyz";

//Query to fetch user information from airstack
const fetchUserData = async (id: number) => {
    try {
        const response = await axios.get(`${server}/v1/storageLimitsByFid?fid=${id}`, {
            headers: {
                "Content-Type": "application/json",
                "x-airstack-hubs": process.env.AIRSTACK_API_KEY,
            },
        });

        if (!response.data) {
            console.error("Response data is undefined.");
            return null;
        }

        const tmp = response.data.limits;
        const userData = {
            userCastStorage: 0,
            userLinkStorage: 0,
            userReactionStorage: 0,
            userDataStorage: 0,
            userFid: id,
        };

        tmp.forEach((i: any) => {
            if (i["storeType"] === 'STORE_TYPE_CASTS') {
                const t = i['used'] / i['limit'];
                userData.userCastStorage = (parseFloat(t.toFixed(3)) * 100);
            }
            if (i["storeType"] === 'STORE_TYPE_LINKS') {
                const t = i['used'] / i['limit'];
                userData.userLinkStorage = (parseFloat(t.toFixed(3)) * 100);
            }
            if (i["storeType"] === 'STORE_TYPE_REACTIONS') {
                const t = i['used'] / i['limit'];
                userData.userReactionStorage = (parseFloat(t.toFixed(3)) * 100);
            }
            if (i["storeType"] === 'STORE_TYPE_USER_DATA') {
                userData.userDataStorage = i['used'] - 1;
            }
        });
        console.log("Fetch Complete!!")
        console.log(userData.userCastStorage);

        console.log(userData.userLinkStorage);

        console.log(userData.userReactionStorage);

        console.log(userData.userDataStorage);
        return userData;
    } catch (e) {
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
        return null;
    }
}



export const POST = frames(async (ctx) => {
    const context = ctx.message;
    const fid = ctx.message?.requesterFid;
    //Fetch User Info and update from the inital values so that other frames can access this information
    let updatedState = {
        userCastStorage: 0,
        userLinkStorage: 0,
        userReactionStorage: 0,
        userDataStorage: 0,
        userFid: fid,
    };

    if (typeof fid === 'number') {
        let data = await fetchUserData(fid);
        if (data) {
            updatedState = data;
            console.log("--- State Updated! ---");
            console.log("FID: ", fid);
            console.log(context);
            console.log("----------------------");
        } else {
            console.error("Error fetching user data.");
        }
    } else {
        console.error("FID is undefined or not a number.");
    }

    var castTextSignal, reactionTextSignal, linkTextSignal;

    var determineCapacityFunction = (val: number) => {
        console.log('Determine Signal Function Executed!')
        if (val > 100) {
            return <span>&#x1F7E6;</span>;
        }
        else if (val > 75 && val <= 100) {
            return <span>&#x1F7E7;</span>;
        } else if (val <= 75 && val > 25) {
            return <span>&#x1F7E8;</span>;
        }
        return <span>&#x1F7E9;</span>;
    }

    castTextSignal = determineCapacityFunction(updatedState.userCastStorage);
    reactionTextSignal = determineCapacityFunction(updatedState.userReactionStorage);
    linkTextSignal = determineCapacityFunction(updatedState.userLinkStorage);


    return {
        image:
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundColor: "#453ECA",
                    flexDirection: "column",
                    fontFamily: "'Pretendard', 'monospace'",
                }}>
                <span tw="flex flex-col justify-between py-9 px-12 h-full">
                    <span tw="flex flex-col">
                        <span tw="flex-row justify-around">
                            <textarea tw="font-bold text-white text-5xl tracking-wider">STORAGE STATUS</textarea>
                        </span>
                        <span tw="flex-row justify-between pb-6">
                            <span tw="text-white text-4xl">FID: {updatedState.userFid}</span>
                            {/*<span tw="text-white text-3xl">Frame created by &#13;&#10;@flutter</span> */}
                        </span>
                        <span tw="flex=row">
                            <span tw="text-5xl pr-2">{castTextSignal}</span>
                            <span tw="text-white text-5xl pb-4">Cast storage: {updatedState.userCastStorage}%</span>
                        </span>
                        <span tw="flex-row">
                            <span tw="text-5xl pr-2">{linkTextSignal}</span>
                            <span tw="text-white text-5xl pb-4">Follows storage: {updatedState.userLinkStorage.toFixed(1)}%</span>
                        </span>
                        <span tw="flex-row">
                            <span tw="text-5xl pr-2">{reactionTextSignal}</span>
                            <span tw="text-white text-5xl pb-4">Reaction storage&nbsp;: {updatedState.userReactionStorage.toFixed(1)}%</span>
                        </span>
                        <span tw="text-white text-5xl pb-4"># of units purchased: {updatedState.userDataStorage}</span>
                    </span>
                    <span tw="text-white text-3xl">Storage Capacity Indicator : [ &#x1F7E9; &#x1F7E9; &#x1F7E8; &#x1F7E7; ]</span>
                </span>
            </div>
        ,
        buttons: [
            <Button action="post" target="/">
                Return
            </Button>,
        ],
    };
});
