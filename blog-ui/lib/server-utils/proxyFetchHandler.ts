// Server component Helper Function

import { cookies } from "next/headers";

export async function ProxyFetchHandler<T = any>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const cookieHeader = (await cookies()).toString();
    
    const encodedPath = encodeURIComponent(path)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const proxyUrl = `${baseUrl}/api/proxy/${encodedPath}`;

    const res = await fetch(proxyUrl, {
        ...init,
        headers: {
            ...(init?.headers || {
                'Content-Type': 'application/json',
            }),
            Cookie: cookieHeader || '',  // Empty cookie header if no cookies are found
        },
        cache: "no-store",
    });
    // console.log("ProxyFetchHandler fetch res-- ", res);

    if (!res.ok) {
        throw new Error("Proxy fetch failed: "); 
    }

    const jsonResponse = await res.json();
    console.log("Proxy Response: ", jsonResponse);
    return jsonResponse;
}
