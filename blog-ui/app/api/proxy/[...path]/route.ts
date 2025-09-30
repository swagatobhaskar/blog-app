import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_REFRESH_TOKEN_API_URL, USER_API_URL } from "@/lib/constants/constants";

async function refreshAccessToken(refreshToken: string): Promise<string> {
    console.log("Inside proxy API refresh handler.")

    const resp = await fetch(AUTH_REFRESH_TOKEN_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `refresh_token=${refreshToken}`
        },
    });

    if (!resp.ok) throw new Error("Failed to refresh access token!");

    const setCookie = resp.headers.get('set-cookie');
    if (!setCookie) throw new Error("No Set-Cookie in response");
    return setCookie;
}

export async function GET(req: NextRequest, {params}: {params: {path: string[]}}) {
    // console.log("Path in proxy API GET: ", params.path[0])
    const encodedUrl = params.path[0];
    const targetUrl = decodeURIComponent(encodedUrl);
    return handleProxy(req, targetUrl);
}

// export async function POST(req: NextRequest, {params}: {params: {path: string[]}}) {
//     return handleProxy(req, params);
// }

// export async function PATCH(req: NextRequest, {params}: {params: {path: string[]}}) {
//     return handleProxy(req, params);
// }

// export async function DELETE(req: NextRequest, {params}: {params: {path: string[]}}) {
//     return handleProxy(req, params);
// }

async function handleProxy(req: NextRequest, targetUrl: string) {
    const cookieStore = await cookies()
    // console.log("cookieStore: ", cookieStore);
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;
 
    // If no cookies, handle it gracefully, especially for /api/me requests
    if (!accessToken && targetUrl.includes(USER_API_URL)) {
        // No cookies, return a null user response
        return NextResponse.json(null); //({ user: null });
    }

    if (!accessToken || !refreshToken) {
        return NextResponse.json({error: "Not Authorized!"}, {status: 401});
    }

    const method = req.method
    // const body = method === 'GET' || method === 'HEAD' ? undefined : await req.text();

    const makeBackendRequest = async (cookieHeader: string) => {
        // console.log("Making backend request from proxy to-- ", targetUrl);
        return await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': req.headers.get('Content-Type') || 'application/json',
                'Cookie': cookieHeader,
            },
            // body,
        });
    };
    // Make initial request with existing cookie
    let response = await makeBackendRequest(`access_token=${accessToken}; refresh_token=${refreshToken}`);

    if ( response.status === 401 && refreshToken ) {
        try {
            const setCookie = await refreshAccessToken(refreshToken);
            response = await makeBackendRequest(setCookie);

            // clone and return response with new Set-Cookie header
            const respBody = await response.text();
            const headers = new Headers(response.headers);
            headers.set('set-cookie', setCookie);

            return new NextResponse(respBody, {
                status: response.status,
                headers,
            });
        }
        catch (err) {
            return NextResponse.json({ error: "Token refresh failed!" }, { status: 401 });
        }
    }

    // Normal return, no refresh needed
    const resBody = await response.text();
    // console.log("resBody: ", resBody);
    return new NextResponse(resBody, {
        status: response.status,
        headers: response.headers
    })
}
