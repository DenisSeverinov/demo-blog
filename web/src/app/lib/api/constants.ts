const isServer = process.env.NEXT_RUNTIME === "nodejs";

const API_PREFIX = process.env.API_PREFIX ?? "/api/v1";
export const API_ROOT = isServer
	? `${process.env.API_BASE_URL}:${process.env.API_PORT}${API_PREFIX}`
	: API_PREFIX;
