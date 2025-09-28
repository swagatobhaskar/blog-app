// server component utility function

import User from "../types/user";
import { ProxyFetchHandler } from "./proxyFetchHandler";
import { USER_API_URL } from "../constants/constants";

export async function GetLoggedInUser(): Promise<{ user: User | null }> {
    console.log("Inside GetLoggedInUser()..")

    try {
        const user: User = await ProxyFetchHandler<User>(`${USER_API_URL}`);
        console.log("GetLoggedInUser Result: ", user);

        return { user };
    } catch (error) {
        console.error("Error fetching user: ", error);
        return { user: null };
    }
}
