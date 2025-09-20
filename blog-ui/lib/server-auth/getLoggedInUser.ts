// server component utility function

import { cookies } from "next/headers";
import User from "../types/user";
import { AUTH_REFRESH_TOKEN_API_URL, USER_API_URL } from "../constants/constants";

export async function GetLoggedInUser(): Promise<{ user: User | null; accessToken?: string }> {
    const cookieStore = await cookies();

    let accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!accessToken && !refreshToken) return { user: null };

    async function fetchCurrentUser(accessToken: string) {
        // console.log("Running in utils/server-auth/GetLoggedInUser.ts")
        return await fetch(`${USER_API_URL}`, {
            method: 'GET',
            headers: {
                Cookie: `access_token=${accessToken}`,
                'Content-Type': 'application/json',
            }
        });
    }

    let resp = accessToken ? await fetchCurrentUser(accessToken) : null;

    if (resp?.status === 401 && refreshToken) {
        // console.log("Fetching for access by refresh @ getLoggedInUser().")
        const refreshResp = await fetch(`${AUTH_REFRESH_TOKEN_API_URL}`, {
            method: 'POST',
            headers: {
                Cookie: `refresh_token=${refreshToken}`
            }
        });

        if (refreshResp.ok) {
            // if you want to use the new access token right away
            // (e.g., to retry the request), you have to manually extract it from the Set-Cookie header
            const setCookieHeader = refreshResp.headers.get("set-cookie");
            const newAccessToken = setCookieHeader?.match(/access_token=([^;]+)/)?.[1];
            if (newAccessToken) {
                accessToken = newAccessToken;
                resp = await fetchCurrentUser(accessToken);
            }
        }
    }

    if (resp?.ok) {         // DO NOT EXPORT accessToken
        const user: User = await resp.json()
        // console.log("RETURN ACCess-token: ", accessToken)
        return { user, accessToken };
    }

    return { user: null };
}
