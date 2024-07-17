import {z} from 'zod';
import {Card} from "@prisma/client"
import {ActionState} from "@/lib/createSafeAction";

import {CreateCard} from "@/actions/create-card/schema";

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputType, Card>;