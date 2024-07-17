"use client"

import {Popover, PopoverClose, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useAction} from "@/hooks/useAction";
import {createBoard} from "@/actions/create-board";
import {FormInput} from "@/components/form/formInput";
import {FormSubmit} from "@/components/form/formSubmit";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {toast} from "sonner";
import {FormPicker} from "@/components/form/formPicker";
import {ElementRef, useRef} from "react";
import {useRouter} from "next/navigation";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right"| "top"| "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover = ({children, side = "bottom", sideOffset = 0, align} : FormPopoverProps) => {
    const closeRef = useRef<ElementRef<"button">>(null)
    const router= useRouter()

    const {execute, fieldError} = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Successfully created board");
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({title, image})
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent align={align} side={side} sideOffset={sideOffset} className={"w-80 pt-3"}>
                <div className={"text-sm font-medium text-center text-neutral-600 pb-4"}>
                    Create Board
                </div>
                <PopoverClose asChild ref={closeRef}>
                    <Button variant={"ghost"} className={"h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"}>
                        <X className={"h-4 w-4"}/>
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className={"space-y-4"}>
                    <div className={"space-y-4"}>
                        <FormPicker id={"image"} errors={fieldError}/>
                        <FormInput id={"title"} label={"Board Title"} type={"text"} error={fieldError}/>
                    </div>
                    <FormSubmit className={"w-full"}>
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}