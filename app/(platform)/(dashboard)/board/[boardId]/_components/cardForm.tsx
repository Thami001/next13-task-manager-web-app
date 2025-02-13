"use client"

import {ElementRef, forwardRef, KeyboardEventHandler, useRef} from "react";
import {Button} from "@/components/ui/button";
import {Plus, X} from "lucide-react";
import {FormTextArea} from "@/components/form/formTextArea";
import {FormSubmit} from "@/components/form/formSubmit";
import {useParams} from "next/navigation";
import {createCard} from "@/actions/create-card";
import {useAction} from "@/hooks/useAction";
import {useEventListener, useOnClickOutside} from "usehooks-ts";
import {toast} from "sonner";

interface CardFormProps {
    listId: string
    enableEditing: () => void
    disableEditing: () => void
    isEditing: Boolean
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({listId, enableEditing, isEditing, disableEditing}, ref) => {
    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null)
    const {execute, fieldError} = useAction(createCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" Created`)
            formRef.current?.reset()
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onKeyDown = (e:KeyboardEvent) => {
        if(e.key === "Escape"){
            disableEditing()
        }
    }

    useOnClickOutside(formRef, disableEditing)
    useEventListener("keydown", onKeyDown)

    const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            formRef.current?.requestSubmit()
        }
    };

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const listId = formData.get("listId") as string
        const boardId = params.boardId as string

        execute({title, listId, boardId})
    }

    if(isEditing){
        return (
            <form className={"m-1 py-0.5 px-1 space-y-4"} action={onSubmit} ref={formRef}>
                <FormTextArea id={"title"} onKeyDown={onTextAreaKeyDown} ref={ref} placeholder={"Enter a title for this card"} errors={fieldError}/>
                <input hidden id={"listId"} name={"listId"} value={listId}/>
                <div className={"flex items-center gap-x-1"}>
                    <FormSubmit>
                        Add Card
                    </FormSubmit>
                    <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
                        <X className={"h-5 w-5"}/>
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <div className={"pt2 px-2"}>
            <Button onClick={enableEditing} className={"h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"} size={"sm"} variant={"ghost"}>
                <Plus className={"h-4 w-4 mr-2"}/>
                Add a card
            </Button>
        </div>
    );
});

CardForm.displayName = "CardForm"

