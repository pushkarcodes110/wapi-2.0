import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { pagesOptions } from "./app/api/auth/[...nextauth]/pagesOptions";
import { ROUTES } from "./constants";

export default withAuth(
  function proxy(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = Boolean(req.nextauth.token);
    
    if (pathname === "/") {
      const destination = isAuthenticated ? ROUTES.Dashboard : ROUTES.Landing;
      return NextResponse.redirect(new URL(destination, req.url));
    }
    if (pathname.startsWith("/auth") && pathname !== "/auth/impersonate" && isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.Dashboard, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const isGuestAllowed = pathname.startsWith(ROUTES.Landing) || pathname.startsWith("/auth");
        return Boolean(token) || isGuestAllowed;
      },
    },
    pages: {
      ...pagesOptions,
    },
  }
);

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js)).*)"],
};
