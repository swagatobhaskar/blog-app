import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_REFRESH_TOKEN_API_URL } from "@/lib/constants/constants";

async function refreshAccessToken(refreshToken: string): Promise<string> {
    const resp = await fetch(`${AUTH_REFRESH_TOKEN_API_URL}`, {     // or just AUTH_REFRESH_TOKEN_API_URL ?
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
    return handleProxy(req, params);
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

async function handleProxy(req: NextRequest, params: {path: string[]}) {
    const cookieStore = await cookies()
    console.log("cookieStore: ", cookieStore);
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!accessToken || !refreshToken) {
        return NextResponse.json({error: "Not Authorized!"}, {status: 401});
    }

    // const path = params.path.join('/') // e.g., ["auth", "login"] → "auth/login"
    const targetPath = params.path.join("/");
    // const backendUrl = `http://localhost:5000/${targetPath}`;
    const method = req.method
    const body = method === 'GET' || method === 'HEAD' ? undefined : await req.text();

    const makeBackendRequest = async (cookieHeader: string) => {
        return await fetch(targetPath, {
            method,
            headers: {
                ...Object.fromEntries(req.headers.entries()),
                'Cookie': cookieHeader,
            },
            body,
        });
    };
    // Make initial request with existing cookie
    let response = await makeBackendRequest(`access_token=${accessToken}; refresh_token=${refreshToken}`);


    // Handle 401 -> try refresh
    if ( response.status === 401 && refreshToken ) {
        try {
            const setCookie = await refreshAccessToken(refreshToken);
            response = await makeBackendRequest(setCookie);

            // clone and return response with new Set-Cookie header
            const respBody = await response.text();
            const respHeaders = new Headers(response.headers);
            respHeaders.set('set-cookie', setCookie);
          
            return new NextResponse(respBody, {
                status: response.status,
                headers: response.headers
            });
        }
        catch (err) {
            return NextResponse.json({ error: "Token refresh failed!" }, { status: 401 });
        }
    }

    // Normal return, no refresh needed
    const resBody = await response.text();
    return new NextResponse(resBody, {
        status: response.status,
        headers: response.headers
    })
}
