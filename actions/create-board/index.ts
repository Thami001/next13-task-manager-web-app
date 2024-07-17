"use server"

import {InputType, ReturnType} from "@/actions/create-board/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/createSafeAction";
import {CreateBoard} from "@/actions/create-board/schema";
import {createAuditLog} from "@/lib/createAuditLog";
import {ACTION, ENTITY_TYPE} from "@prisma/client";

const handler = async(data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if(!userId || !orgId){
        return {
            error: "Unauthorized",
        }
    }

    const {title, image} = data

    const [
        imageId,
        imageThumbURL,
        imageFullURL,
        imageLinkHTML,
        imageUserName
    ] = image.split("|")

    if(!imageId || !imageThumbURL || !imageFullURL || !imageLinkHTML || !imageUserName){
        return {
            error: "Missing fields. Failed to create board.",
        }
    }

    let board

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbURL,
                imageFullURL,
                imageUserName,
                imageLinkHTML,

            }
        })

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
        })
    } catch (error){
        return {
            error: "Failed to create"
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data:board}

}

export const createBoard = createSafeAction(CreateBoard, handler)