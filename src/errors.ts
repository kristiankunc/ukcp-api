/**
 * Error thrown when any UKCP API request fails.
 */
export class UkcpApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly url: string,
    ) {
        super(message);
        this.name = "UkcpApiError";
    }
}

/**
 * Error thrown specifically when a resource returns 404.
 */
export class UkcpNotFoundError extends UkcpApiError {
    constructor(url: string) {
        super("Resource not found", 404, "Not Found", url);
        this.name = "UkcpNotFoundError";
    }
}
