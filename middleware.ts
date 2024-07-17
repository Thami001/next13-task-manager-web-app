import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";



export default clerkMiddleware((auth,req ) => {
    const isPublicRoute = createRouteMatcher(["/"])
    if(isPublicRoute(req) && auth().userId){
        let path = "/select-org"

        if(auth().orgId){
            path = `/organization/${auth().orgId}`
        }

        const orgSelection = new URL(path, req.url)
        return NextResponse.redirect(orgSelection)
    }

   /* if(!auth().userId && !isPublicRoute(req)) {
        return auth().redirectToSignIn({returnBackUrl: req.url})
    } */


    if(auth().userId && !auth().orgId && req.nextUrl.pathname !== "/select-org" ){
        const orgSelection = new URL("/select-org", req.url)
        return NextResponse.redirect(orgSelection)
    }

});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

