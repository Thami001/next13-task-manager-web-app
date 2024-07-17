"use server"

import {InputType, ReturnType} from "@/actions/delete-list/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/createSafeAction";

import {redirect} from "next/navigation";
import {DeleteList} from "@/actions/delete-list/schema";
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
    let list

    try {
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId
                },
            },
        })

        await createAuditLog({
            entityTitle: list.title,
            entityId: list.id,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE,
        })

    }catch(error) {
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: list}
}

export const deleteList = createSafeAction(DeleteList, handler)