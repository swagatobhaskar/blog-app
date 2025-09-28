// Server component Helper Function

import { cookies } from "next/headers";

export async function ProxyFetchHandler<T = any>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const cookieHeader = (await cookies()).toString();
    
    console.log("PATH in ProxyFetchHandler(): ", path);

    const encodedPath = encodeURIComponent(path)
    console.log("Encoded PATH in ProxyFetchHandler(): ", encodedPath);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // or VERCEL_URL logic if deployed
    const proxyUrl = `${baseUrl}/api/proxy/${encodedPath}`;

    const res = await fetch(proxyUrl, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            Cookie: cookieHeader
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Proxy fetch failed: "); 
    }

    return res.json();
}

// (${res.status}: ${await res.text()})`);