import {z} from "zod";
import {Board} from "@prisma/client";
import {ActionState} from "@/lib/createSafeAction";
import {CreateBoard} from "@/actions/create-board/schema";

export type InputType = z.infer<typeof CreateBoard>
export type ReturnType = ActionState<InputType,Board>