"use server"

import {InputType, ReturnType} from "@/actions/update-card-order/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/createSafeAction";
import {UpdateCardOrder} from "@/actions/update-card-order/schema";



const handler = async(data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthorized",
        }
    }

    const { items, boardId} = data
    let UpdatedCards

    try {
        const transaction = items.map((card) => db.card.update({
            where: {
                id: card.id,
                list: {
                    board: {
                        orgId
                    }
                }
            },
            data: {
                order: card.order,
                listId: card.listId
            }
        }))

        UpdatedCards = await db.$transaction(transaction)

    }catch(error) {
        return {
            error: "Failed to Reorder"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: UpdatedCards}
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)