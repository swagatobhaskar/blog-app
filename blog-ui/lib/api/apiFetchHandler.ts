import { getCookie } from '@/utils/cookies'
import { AUTH_REFRESH_TOKEN_API_URL } from '../constants/constants';

export async function apiHandler<TResponse>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
): Promise<TResponse> {
    // <TResponse> is a generic type, letting you define what type of data to expect in each call.
    const csrfToken = getCookie('csrf_token');

    const config: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
    };

    const res = await fetch(endpoint, config);

    if (res.status === 401 && retry) {
        console.log("RETRY AFTER 401.")
        const refreshRes: Response = await apiHandler(`${AUTH_REFRESH_TOKEN_API_URL}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (refreshRes.ok) {
            return await apiHandler<TResponse>(endpoint, options, false)
        } else {
            throw new Error('Session expired. Please login again!')
            // router.push('/login')
        }
    }

    let errorData;
    if (!res.ok) {
        // const errorData = await res.json();
        try {
            errorData = await res.json();
        } catch {
            errorData = { message: res.statusText };
        }
        throw new Error(errorData.message || 'API request failed');
    }

    try {
        return await res.json(); // as Promise<TResponse>; (without using await in front)
    } catch {
        throw new Error('Failed to parse JSON response');
    }
}
