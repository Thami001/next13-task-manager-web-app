import {z} from 'zod';
import {List} from "@prisma/client"
import {ActionState} from "@/lib/createSafeAction";
import {DeleteList} from "@/actions/delete-list/schema";
import {CopyList} from "@/actions/copy-list/schema";

export type InputType = z.infer<typeof CopyList>;
export type ReturnType = ActionState<InputType, List>;