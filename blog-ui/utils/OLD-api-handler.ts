import { getCookie } from "./cookies";

export async function apiFetch<T = unknown>(  // still not clear whether it runs on the server or client? why async?
    input: RequestInfo,
    init: RequestInit = {},
    retry = true
): Promise<T> {

    const csrfToken = getCookie('csrf_token');

    const config: RequestInit = {
        ...init,
        credentials: 'include',
        headers: {
            ...(init.headers || {}),
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
    }

    // console.log("CLIENT CSRF: ", csrfToken);

    const res = await fetch(input, config)

    if (res.status === 401 && retry) {
        // console.log("RETRY AFTER 401.")
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (refreshRes.ok) {
            return await apiFetch<T>(input, init, false)
        } else {
            throw new Error('Session expired. Please login again!')
            // router.push('/login')
        }
    }

    if (!res.ok) {
        // const error = await res.json().catch(() => ({}))
        const error: { detail?: string } = await res.json().catch(() => ({}))
        throw new Error(error.detail || 'Request Failed')
    }

    return res.json() as Promise<T>
}
