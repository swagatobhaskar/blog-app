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

    try {
        return await res.json();
    } catch {
        throw new Error('Failed to parse JSON response');
    }
}

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

// export async function apiHandler<TResponse>(
//     endpoint: string,
//     options: RequestInit = {},
//     retry = true
// ): Promise<TResponse> {
//     // <TResponse> is a generic type, letting you define what type of data to expect in each call.
//     const csrfToken = getCookie('csrf_token');

//     const config: RequestInit = {
//         ...options,
//         credentials: 'include',
//         headers: {
//             ...options.headers,
//             'Content-Type': 'application/json',
//             ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
//         },
//     };

//     const res = await fetch(endpoint, config);

//     if (res.status === 401 && retry) {
//         console.log("RETRY AFTER 401.")
//         const refreshRes: Response = await apiHandler(`${AUTH_REFRESH_TOKEN_API_URL}`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })

//         if (refreshRes.ok) {
//             return await apiHandler<TResponse>(endpoint, options, false)
//         } else {
//             throw new Error('Session expired. Please login again!')
//             // router.push('/login')
//         }
//     }

//     let errorData;
//     if (!res.ok) {
//         // const errorData = await res.json();
//         try {
//             errorData = await res.json();
//         } catch {
//             errorData = { message: res.statusText };
//         }
//         throw new Error(errorData.message || 'API request failed');
//     }

//     try {
//         return await res.json(); // as Promise<TResponse>; (without using await in front)
//     } catch {
//         throw new Error('Failed to parse JSON response');
//     }
// }
