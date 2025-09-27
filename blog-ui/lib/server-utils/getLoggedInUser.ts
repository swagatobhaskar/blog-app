// server component utility function

import User from "../types/user";
import { ProxyFetchHandler } from "./proxyFetchHandler";
import { USER_API_URL } from "../constants/constants";

export async function GetLoggedInUser(): Promise<{ user: User | null }> {
    console.log("Inside GetLoggedInUser()..")

    const resp = await ProxyFetchHandler(`${USER_API_URL}`)
    console.log("GetLoggedInUser Result: ", resp)

    if (!resp.ok) return { user: null }

    const user: User = await resp.json()
    return { user }
}
