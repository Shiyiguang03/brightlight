import { NextResponse } from 'next/server';

const DB_CONNECTION_ERROR_CODES = new Set([
  'P1001', // Can't reach database server
  'P1002', // Database server timed out
  'P1008', // Operations timed out
  'P1009', // Database already exists (init edge case, treat as transient)
  'P1010', // Access denied
  'P1011', // TLS connection error
  'P1017', // Server closed the connection
]);

// Checked by error name/code rather than `instanceof`, since routes
// import either `@prisma/client` or `@prisma/client/edge` — separate
// modules whose error classes don't share a prototype chain.
function isDbConnectionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as { name?: string; code?: string };
  if (err.name === 'PrismaClientInitializationError') return true;
  if (err.name === 'PrismaClientKnownRequestError' && err.code && DB_CONNECTION_ERROR_CODES.has(err.code)) {
    return true;
  }
  return false;
}

// Logs the real error server-side and returns a safe, user-friendly response.
export function handleApiError(error: unknown, context: string) {
  console.error(`${context}:`, error);

  if (isDbConnectionError(error)) {
    return NextResponse.json(
      { message: "We're having trouble connecting to our database right now. Please try again in a few minutes." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { message: 'Something went wrong on our end. Please try again.' },
    { status: 500 }
  );
}
