"use server"

import {InputType, ReturnType} from "@/actions/delete-card/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/createSafeAction";
import {DeleteCard} from "@/actions/delete-card/schema";
import {createAuditLog} from "@/lib/createAuditLog";
import {ACTION, ENTITY_TYPE} from "@prisma/client";


const handler = async(data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthorized",
        }
    }

    const { id,boardId} = data
    let card

    try {
     card = await db.card.delete({
         where: {
             id,
             list: {
                 board: {
                     orgId
                 }
             }
         }
     })

        await createAuditLog({
            entityTitle: card.title,
            entityId: card.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE,
        })
    }catch(error) {
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: card}
}

export const deleteCard = createSafeAction(DeleteCard, handler)