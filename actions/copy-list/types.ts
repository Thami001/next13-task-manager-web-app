import {z} from 'zod';
import {List} from "@prisma/client"
import {ActionState} from "@/lib/createSafeAction";

import {CopyList} from "@/actions/copy-list/schema";

export type InputType = z.infer<typeof CopyList>;
export type ReturnType = ActionState<InputType, List>;