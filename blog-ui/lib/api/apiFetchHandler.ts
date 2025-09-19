import { getCookie } from '@/utils/cookies'
import { AUTH_REFRESH_TOKEN_API_URL } from '../constants/constants';

async function apiFetch(endpoint: string, options: RequestInit): Promise<Response> {
    const csrfToken = getCookie('csrf_token');

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
    };

    return fetch(endpoint, config);
}

async function refreshAuthToken(): Promise<boolean> {
    const response = await fetch(AUTH_REFRESH_TOKEN_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });

    return response.ok;
}

async function parseResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let errorMessage = res.statusText;
        try {
            const errorData = await res.json();
            errorMessage = errorData?.message || errorMessage;
        } catch {
            // use default message
        }
        throw new Error(errorMessage);
    }

    // If some of the endpoints return no body (204_NO_CONTENT):
    const contentLength = res.headers.get('Content-Length');
    if (res.status === 204 || contentLength === '0') {
        return null as unknown as T;
    }

    try {
        return await res.json();
    } catch {
        throw new Error('Failed to parse JSON response');
    }
}

// apiHandler<T>() does NOT return Response
// It returns the parsed JSON data of type T.

export async function apiHandler<TResponse>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
): Promise<TResponse> {
    const isAuthRequired = options.credentials === 'include';
    // console.log("PATH: ", endpoint, "isAuthRequired: ", isAuthRequired)
    let response = await apiFetch(endpoint, options)

    if (isAuthRequired && response.status === 401 && retry) {
        const refreshed = await refreshAuthToken();

        if (refreshed) {
            return await apiHandler<TResponse>(endpoint, options, false);
        } else {
            throw new Error('Session expired. Please login again!');
        }
    }

    return parseResponse<TResponse>(response);
}
