"use client"

import {List} from "@prisma/client";
import {ElementRef, useRef, useState} from "react";
import {useEventListener} from "usehooks-ts";
import {FormInput} from "@/components/form/formInput";
import {useAction} from "@/hooks/useAction";
import {updateList} from "@/actions/update-list";
import {toast} from "sonner";
import {ListOptions} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/listOptions";

interface ListHeaderProps {
    data: List
    onAddCard: () => void
}

export const ListHeader = ({data, onAddCard} : ListHeaderProps) => {
    const [title, setTitle] = useState(data.title)
    const [isEditing, setIsEditing] = useState(false)

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select();
        })
    }

    const disableEditing = () => {
        setIsEditing(false)
    }

    const {execute} = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to "${data.title}"`)
            setTitle(data.title)
            disableEditing()
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const handleSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const id = formData.get("id") as string
        const boardId = formData.get("boardId") as string

        if(title === data.title) {
            return disableEditing()
        }

        execute({
            title,
            id,
            boardId
        })
    }


    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit()
        }
    }

    const onBlur = () => {
        formRef.current?.requestSubmit()
    }

    useEventListener("keydown", onKeyDown)

    return (
        <div className={"pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2"}>
            {isEditing ?
                (
                    <form className={"flex-1 px-[2px]"} ref={formRef} action={handleSubmit}>
                        <input hidden id={"id"} name={"id"} value={data.id}/>
                        <input hidden id={"boardId"} name={"boardId"} value={data.boardId}/>
                        <FormInput id={"title"} placeholder={"Enter List title"} ref={inputRef} defaultValue={title} className={"text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"} onBlur={onBlur}/>
                        <button hidden type={"submit"}/>
                    </form>
                )
                : (
                <div className={"w-full text-sm px-2.5 py- h-7 font-medium border-transparent"} onClick={enableEditing}>
                    {title}
                </div>
                )}
            <ListOptions data={data} onAddCard={onAddCard}/>
        </div>
    );
};

