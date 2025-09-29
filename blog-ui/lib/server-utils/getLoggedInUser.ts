// server component utility function

import User from "../types/user";
import { USER_API_URL } from "../constants/constants";
import { ProxyFetchHandler } from "./proxyFetchHandler";

export async function GetLoggedInUser(): Promise<{ user: User | null }> {   //, error?: string
    // console.log("Inside GetLoggedInUser()..")

    try {
        // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        // const targetUrl = USER_API_URL
        // const proxyUrl = `${baseUrl}/api/proxy/${encodeURIComponent(targetUrl)}`;
        
        const user = await ProxyFetchHandler<User>(USER_API_URL, {method: 'GET'});
        console.log("GetLoggedInUser Result: ", user);
        return { user };

    } catch (error) {
        console.error("Error fetching GetLoggedInUser: ", error);
        // return { user: null, error: error instanceof Error ? error.message : "Unknown error" };
        return { user: null };
    }
}
