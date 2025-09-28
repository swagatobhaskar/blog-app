// Server component Helper Function

import { cookies } from "next/headers";

export async function ProxyFetchHandler<T = any>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const cookieHeader = (await cookies()).toString();

    const encodedPath = encodeURIComponent(path)
    const res = await fetch(`/api/proxy/${encodedPath}`, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            Cookie: cookieHeader
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Proxy fetch failed (${res.status}: ${await res.text()})`);
    }

    return res.json(); // as Promise<T>;
}
