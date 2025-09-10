
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
