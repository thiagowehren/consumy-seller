import { Auth } from '@/auth';
import { HTTPError } from '@/helpers/HTTPError'

interface RequestConfig {
    method?: string;
    body?: any;
    params?: { [key: string]: any };
    headers?: { [key: string]: string };
}

export async function request<T>(path: string, config: RequestConfig = {}): Promise<T | undefined> {
    const { method = 'GET', body, params, headers = {} } = config;

    let auth = new Auth();
    const token = auth.getFallback('token');
    
    const defaultHeaders: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": `${import.meta.env.VITE_X_API_KEY}`,
        ...(token && { "Authorization": `Bearer ${token}` }),
    };

    const combinedHeaders: HeadersInit = { ...defaultHeaders, ...headers };

    const url = new URL(`${import.meta.env.VITE_DELIVERY_API_URL}${path}`);
    
    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const defaultBody = { locale: "pt-BR" };
    const combinedBody = method === "GET" ? { ...defaultBody, ...body } : undefined;

    // ----------ç
    console.log('method:', method)
    console.log('URL:', url.toString());
    // console.log('Headers:', combinedHeaders);
    // console.log('Body:', combinedBody);

    const response = await fetch(url.toString(), {
        method,
        headers: combinedHeaders,
        body: body ? JSON.stringify(body) : undefined,
    });

    const errorHandlers: { [status: number]: () => void } = {
        401: () => { throw new HTTPError("Unauthorized", 401); },
        404: () => { throw new HTTPError("Not Found", 404); },
        204: () => { return undefined; }, // No Content: (response for deleted records)
        422: () => { throw new HTTPError("Unprocessable Content", 422)}
    };
      
    const errorHandler = errorHandlers[response.status];

    if (errorHandler) {
        errorHandler();
    } else if (!response.ok) {
        throw new HTTPError("HTTP Error!", response.status);
    }

    const data = await response.json();
    return data;
}
