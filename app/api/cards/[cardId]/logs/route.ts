import {NextResponse} from "next/server";
import {auth, currentUser} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {ENTITY_TYPE} from "@prisma/client";

export async function GET(request: Request, {params} : {params: {cardId: string}}) {
    try {
        const {orgId} = auth();
        const user = await currentUser();

        if(!user || !orgId){
            return new NextResponse("unauthorized", {status: 401})
        }

        const auditLogs = await db.auditLog.findMany({
            where: {
                orgId,
                entityId: params.cardId,
                entityType: ENTITY_TYPE.CARD,
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 3,
        })

        return NextResponse.json(auditLogs)
    }
    catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
}