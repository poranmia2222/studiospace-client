import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * One shared client for the whole app. The Next app itself hosts
 * better-auth (src/lib/auth.ts, exposed at /api/auth/[...all]), so the
 * browser talks to the same origin — no baseURL needed (and BETTER_AUTH_URL
 * is a server-only env var; referencing it here would just be undefined).
 *
 * jwtClient() registers the jwt plugin for typed client access to /token
 * if the UI ever needs the JWT directly; server components get theirs via
 * auth.api.getToken (see studios/edit/[id]/page.tsx).
 */
export const authClient = createAuthClient({
    plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
