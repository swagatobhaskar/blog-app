// server component utility function

import User from "../types/user";
import { ProxyFetchHandler } from "./proxyFetchHandler";
import { USER_API_URL } from "../constants/constants";

export async function GetLoggedInUser(): Promise<{ user: User | null }> {
    console.log("Inside GetLoggedInUser()..")

    try {
        // const user: User = await ProxyFetchHandler<User>(USER_API_URL);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // or VERCEL_URL logic if deployed
        const targetUrl = USER_API_URL
        const proxyUrl = `${baseUrl}/api/proxy/${encodeURIComponent(targetUrl)}`;
        
        const resp = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Cookie: 
            },
            cache: 'no-store',
        });

        const user: User = await resp.json();
        
        console.log("GetLoggedInUser Result: ", user);
        
        return { user };
    } catch (error) {
        console.error("Error fetching user: ", error);
        return { user: null };
    }
}
