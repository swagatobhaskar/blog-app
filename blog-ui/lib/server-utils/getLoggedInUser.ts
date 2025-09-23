// server component utility function

import User from "../types/user";
import ServerFetchHandler from "./serverFetchHandler";
import { USER_API_URL } from "../constants/constants";

export async function GetLoggedInUser(): Promise<{ user: User | null }> {
    console.log("Inside GetLoggedInUser()..")

    const resp = await ServerFetchHandler({ url: `${USER_API_URL}` })

    if (!resp.ok) return { user: null }

    const user: User = await resp.json()
    return { user }
}

// if (refreshResp.ok) {
//     // if you want to use the new access token right away
//     // (e.g., to retry the request), you have to manually extract it from the Set-Cookie header
//     const setCookieHeader = refreshResp.headers.get("set-cookie");
//     const newAccessToken = setCookieHeader?.match(/access_token=([^;]+)/)?.[1];
//     if (newAccessToken) {
//         accessToken = newAccessToken;
//         cookieStore.set("access_token", newAccessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//             path: "/",
//         });
//         resp = await fetchCurrentUser(accessToken);
//     }
// }
