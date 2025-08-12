import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: [
        '/', 
        "/about", 
        "/projects", 
        "/projects/(.*)", 
        "/experience", 
        "/experience/(.*)", 
        "/certification", 
        "/certification/(.*)", 
        "/techstack", 
        "/contact", 
        "/api/email", 
        "/techstack/(.*)"
    ],
});

export const config = {
    // Protects all routes except those specified in publicRoutes
    // and Next.js internal routes like _next and API routes.
    // Do not run the auth middleware on API routes to allow public API endpoints like /api/email
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/"],
};
