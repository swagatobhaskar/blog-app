// server component
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_REFRESH_TOKEN_API_URL } from "../constants/constants";

type ServerFetchHandlerParams = {
    url: string;
    method?: 'GET' | 'PATCH' | 'POST' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    revalidate?: number | false;
    cache?: RequestCache;
}

export default async function ServerFetchHandler({
    url,
    method = 'GET',
    headers: customHeaders = {},
    body,
    revalidate,
    cache = 'no-store',
}: ServerFetchHandlerParams): Promise<Response> {
    // console.log("Inside ServerFetchHandler()..")
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const refreshToken = cookieStore.get('refresh_token')?.value
    const cookieHeader = cookieStore.toString()

    // console.log("cookieHeader- ", cookieHeader)
    // console.log("accessToken: ", accessToken)
    // console.log("refreshToken", refreshToken)

    // if (!accessToken && !refreshToken) {     //return { user: null }; 
    //     console.error("Access & Refresh Token not found!")
    // } else {
    //     console.log("Tokens present >_<")
    // }

    // Step 1: Initial fetch with current access token
    let response = await fetch(url, {
        method,
        headers: {
            ...customHeaders,
            Cookie: cookieHeader,
            'Content-Type': 'application/json',
        },
        body: body? JSON.stringify(body) : undefined,
        cache,
        next: revalidate !== undefined ? { revalidate } : undefined,
    })

    console.log("Response from ServerFetchHandler()- ", response)

    // Step 2: If access token is invalid, try refresh
    if (response.status === 401 && refreshToken) {
        console.log("Inside Access Token Rotation Block.")

        const refreshResponse = await fetch(`${AUTH_REFRESH_TOKEN_API_URL}`, {
            method: 'POST',
            headers: {
                Cookie: `refresh_token=${refreshToken}`,
                'Content-Type': 'application/json',
            },
        })

        console.log("refreshResponse: ", refreshResponse)

        if (refreshResponse.ok) {
            const path = (await headers()).get('x-invoke-path') || (await headers()).get('referer') || '/'
            redirect(path)
        } else {
            // Refresh failed — maybe token expired
            console.warn('[fetchWithAuth] Token refresh failed, redirecting to login...')
            redirect('/login')
        }
    }

    return response
}
