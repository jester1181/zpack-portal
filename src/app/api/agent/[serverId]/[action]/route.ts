import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const allowedActions = new Set(["status", "start", "stop", "restart"]);

const resolveInstanceIp = async (token: string | null, serverId: string) => {
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}/api/instances`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Failed to load instances (${response.status}).`);
  }

  const payload = (await response.json()) as { rows?: Array<{ vmid?: number | string; ip?: string }> };
  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  const match = rows.find((row) => String(row.vmid) === String(serverId));

  if (!match?.ip) {
    return null;
  }

  return match.ip;
};

const proxyToAgent = async (
  agentIp: string,
  action: string,
  method: "GET" | "POST"
) => {
  const response = await fetch(`http://${agentIp}:18888/${action}`, {
    method,
  });

  return response;
};

const handleRequest = async (
  request: NextRequest,
  params: { serverId: string; action: string }
) => {
  const { serverId, action } = params;
  if (!allowedActions.has(action)) {
    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let agentIp: string | null = null;
  try {
    agentIp = await resolveInstanceIp(token, serverId);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resolve IP." },
      { status: 502 }
    );
  }

  if (!agentIp) {
    return NextResponse.json({ error: "Server IP not available." }, { status: 404 });
  }

  const method = action === "status" ? "GET" : "POST";
  if (request.method !== method) {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
  }

  const agentResponse = await proxyToAgent(agentIp, action, method);
  const contentType = agentResponse.headers.get("content-type") || "text/plain";
  const body = await agentResponse.text();

  return new NextResponse(body, {
    status: agentResponse.status,
    headers: { "content-type": contentType },
  });
};

export const GET = async (
  request: NextRequest,
  context: { params: { serverId: string; action: string } }
) => handleRequest(request, context.params);

export const POST = async (
  request: NextRequest,
  context: { params: { serverId: string; action: string } }
) => handleRequest(request, context.params);
