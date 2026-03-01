import { NextRequest } from "next/server";

export async function logToSentinel(request: Request | NextRequest, payload?: any) {
  const isProduction = process.env.NODE_ENV === "production";
  const ES_URL = process.env.ELASTICSEARCH_URL || (isProduction ? "http://localhost:9200" : "http://172.18.16.1:9200");

  if (!isProduction) {
    console.log(`[Sentinel] Modo Desarrollo - Registrando acción: ${payload?.action || "request"} en ${ES_URL}`);
  }

  try {
    // Construimos la URL de forma segura para obtener el pathname
    const url = new URL(request.url);
    
    await fetch(`${ES_URL}/marquetplace_kibana/_doc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        method: request.method,
        path: url.pathname,
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "127.0.0.1",
        userAgent: request.headers.get("user-agent"),
        message: payload ? JSON.stringify(payload) : null,
      }),
    });
  } catch (error) {
    console.error("Error enviando a Elasticsearch", error);
  }
}