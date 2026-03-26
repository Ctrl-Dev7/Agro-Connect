import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const MAX_REQUESTS = 100; // limit per IP per minute
const WINDOW_MS = 60 * 1000;

export async function middleware(request: NextRequest) {
  // 1. Basic Rate Limiting
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip);
  
  if (userRecord) {
    if (now > userRecord.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else {
      userRecord.count++;
      if (userRecord.count > MAX_REQUESTS) {
        return new Response('Too Many Requests - Rate Limit Exceeded', { status: 429 });
      }
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  }

  // 2. Supabase Auth Session Update
  const response = await updateSession(request);

  // 3. Apply Global Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
