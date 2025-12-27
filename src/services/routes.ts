// src/services/routes.ts

export const NESTS_ROUTE = "/api/nests"; // For fetching nests
export const EGGS_ROUTE = (nestId: number) => `/api/nests/${nestId}/eggs`; // For fetching eggs in a specific nest
export const LOGIN_ROUTE = "/auth/login"; // For user login
export const REGISTER_ROUTE = "/auth/register"; // For user registration
export const ALLOCATIONS_ROUTE = "api/environment/allocations"; // For fetching allocations
export const CREATE_SERVER_ROUTE = "/servers/create"; // For creating a server
export const SERVERS_ROUTE = "/servers"; // For fetching servers
