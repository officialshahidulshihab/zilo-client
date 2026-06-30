// src/app/api/admin/[...path]/route.js
//
// Catch-all proxy for all /api/admin/* routes.
//
// WHY THIS EXISTS:
// The admin session cookie is set by the Express backend
// (zilo-server.vercel.app) with sameSite:"none"; secure:true so it can
// travel cross-site. But Chrome and Safari have been tightening third-party
// cookie rules, and Vercel's free-tier serverless functions share a
// *.vercel.app domain — meaning the cookie sometimes gets blocked or
// dropped before it even reaches the backend.
//
// The fix: the browser only ever talks to /api/admin/* on its OWN origin
// (zilo-client.vercel.app). This Next.js route runs server-side, reads
// the cookie from the incoming request (same-origin → always works), and
// forwards it to the Express backend in a normal server-to-server fetch.
// No cross-site cookie issues, ever.
//
// The ADMIN_KEY and SESSION_SECRET env vars stay on the server — they are
// NOT prefixed NEXT_PUBLIC_ and never appear in any browser bundle.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND = process.env.SERVER_URL || "http://localhost:5000";
const SESSION_COOKIE = "zilo_admin_session";

// Forward any HTTP method to the backend
async function handler(req, { params }) {
  const path = params.path.join("/");           // e.g. ["orders"] → "orders"
  const url = new URL(req.url);
  const backendUrl = `${BACKEND}/api/admin/${path}${url.search}`;

  // Read the session cookie from the browser's request (same-origin — always present)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  // Build forwarded headers
  const forwardHeaders = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  };
  if (sessionToken) {
    // Forward cookie to backend so verifyAdmin middleware can read it
    forwardHeaders["Cookie"] = `${SESSION_COOKIE}=${sessionToken}`;
  }

  // Forward the request body for POST/PATCH
  let body = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text();
  }

  const backendRes = await fetch(backendUrl, {
    method: req.method,
    headers: forwardHeaders,
    body,
  });

  const data = await backendRes.text();

  // If backend is setting a cookie (login), forward it to the browser
  const setCookie = backendRes.headers.get("set-cookie");
  const res = new NextResponse(data, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });

  if (setCookie) {
    // Rewrite the cookie: strip sameSite/secure attributes since this is
    // now same-origin (client ↔ Next.js), so those aren't needed.
    // Parse the cookie name=value and set it simply.
    const cookieValue = setCookie.split(";")[0].split("=").slice(1).join("=");
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    res.cookies.set(SESSION_COOKIE, cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",   // same-origin now, lax is fine and more compatible
      maxAge,
      path: "/",
    });
  }

  // Forward logout cookie-clear too
  if (backendRes.status === 200 && req.method === "POST" && path === "logout") {
    res.cookies.delete(SESSION_COOKIE);
  }

  return res;
}

export const GET    = handler;
export const POST   = handler;
export const PATCH  = handler;
export const DELETE = handler;