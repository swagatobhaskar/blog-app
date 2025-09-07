
export async function apiHandler<TResponse>(
    endpoint: string,
    options: RequestInit = {}
): Promise<TResponse> {
    // <TResponse> is a generic type, letting you define what type of data to expect in each call.
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options
    };

    const res = await fetch(endpoint, config);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'API request failed');
    }

    return res.json() as Promise<TResponse>;
}
