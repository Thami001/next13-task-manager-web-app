import {z} from 'zod';
import {Card} from "@prisma/client"
import {ActionState} from "@/lib/createSafeAction";


import {DeleteCard} from "@/actions/delete-card/schema";

export type InputType = z.infer<typeof DeleteCard>;
export type ReturnType = ActionState<InputType, Card>;