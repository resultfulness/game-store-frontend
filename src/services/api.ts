if (!import.meta.env.VITE_API_URL) {
    throw "VITE_API_URL environment variable not found";
}

export class APIError extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export const api = {
    url: import.meta.env.VITE_API_URL,
    async fetch(endpoint: string, options: RequestInit = {}) {
        const url = `${this.url}${endpoint}`;
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        });
        const data = await res.json();
        if (!res.ok) {
            throw new APIError(data.detail, res.status);
        }
        return data;
    },
    get(endpoint: string) {
        return this.fetch(endpoint);
    },
    post(endpoint: string, data: any) {
        return this.fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
    patch(endpoint: string, data: any) {
        return this.fetch(endpoint, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },
    delete(endpoint: string) {
        return this.fetch(endpoint, { method: "DELETE" });
    },
};
