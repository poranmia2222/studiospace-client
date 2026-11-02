import { headers } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.redirect(
      new URL("/signin", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/add-new-studio',
    '/add-new-studio', '/my-bookings', '/my-studio-listing', '/studios/edit/:path*'
  ],
}