import {z} from 'zod';
import {List} from "@prisma/client"
import {ActionState} from "@/lib/createSafeAction";
import {DeleteList} from "@/actions/delete-list/schema";

export type InputType = z.infer<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;