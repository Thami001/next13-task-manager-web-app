"use server"

import {InputType, ReturnType} from "@/actions/create-card/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/createSafeAction";
import {CreateCard} from "@/actions/create-card/schema";
import {createAuditLog} from "@/lib/createAuditLog";
import {ACTION, ENTITY_TYPE} from "@prisma/client";



const handler = async(data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthorized",
        }
    }

    const {title, boardId, listId} = data
    let card

    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId
                }
            }
        })

        if(!list) {
            return {
                error: "List not found",
            }
        }

        const lastCard = await db.card.findFirst({
            where: {
                listId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1

        card = await db.card.create({
            data: {
                title,
                listId,
                order:newOrder
            }
        })

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        })
    }catch(error) {
        return {
            error: "Failed to Create"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: card}
}

export const createCard = createSafeAction(CreateCard, handler)