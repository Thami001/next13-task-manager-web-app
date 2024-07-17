import {z} from 'zod';
import { Card} from "@prisma/client"
import {ActionState} from "@/lib/createSafeAction";
import {UpdateCard} from "@/actions/update-card/schema";


export type InputType = z.infer<typeof UpdateCard>;
export type ReturnType = ActionState<InputType, Card>;