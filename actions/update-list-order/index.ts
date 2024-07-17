"use server"

import {InputType, ReturnType} from "@/actions/update-list-order/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/createSafeAction";
import {UpdateListOrder} from "@/actions/update-list-order/schema";


const handler = async(data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthorized",
        }
    }

    const { items,boardId} = data
    let lists

    try {
        const transaction = items.map((list) => db.list.update({
            where: {
                id: list.id,
                board: {
                    orgId
                }
            },
            data : {
                order: list.order
            }
        }))

        lists = await db.$transaction(transaction)
    }catch(error) {
        return {
            error: "Failed to Reorder"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: lists}
}

export const updateListOrder = createSafeAction(UpdateListOrder, handler)