"use server"

import {InputType, ReturnType} from "@/actions/update-board/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/createSafeAction";
import {UpdateBoard} from "@/actions/update-board/schema";
import {createAuditLog} from "@/lib/createAuditLog";
import {ACTION, ENTITY_TYPE} from "@prisma/client";

const handler = async(data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthorized",
        }
    }

    const {title, id} = data
    let board

    try {
        board = await db.board.update({
            where: {
                id,
                orgId
            },
            data: {
                title,
            }
        })

    }catch(error) {
        return {
            error: "Failed to update"
        }
    }
    await createAuditLog({
        entityTitle: board.title,
        entityId: board.id,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTION.UPDATE,
    })

    revalidatePath(`/board/${id}`)
    return {data:board}
}

export const updateBoard = createSafeAction(UpdateBoard, handler)