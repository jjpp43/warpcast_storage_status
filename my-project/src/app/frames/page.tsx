import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "My Page",
        // provide a full URL to your /frames endpoint
        other: await fetchMetadata(
            new URL(
                "/frames",
                process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}`
                    : "http://localhost:3000"
            )

        ),
    };
}

export default function Page() {
    return <span>My existing page</span>;
}