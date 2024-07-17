import {z} from 'zod';
import {List} from "@prisma/client"
import {ActionState} from "@/lib/createSafeAction";
import {UpdateList} from "@/actions/update-list/schema";

export type InputType = z.infer<typeof UpdateList>;
export type ReturnType = ActionState<InputType, List>;