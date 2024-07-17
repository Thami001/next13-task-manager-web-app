"use client"

import {forwardRef, KeyboardEventHandler} from "react";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {FormErrors} from "@/components/form/formErrors";
import {useFormStatus} from "react-dom";

interface FormTextAreaProps {
    id: string
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    errors?: Record<string, string[] | undefined>
    className?: string
    onBlur?: () => void
    onClick?: () => void
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined
    defaultValue?: string
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(({id, label,placeholder,required,errors,onBlur, onKeyDown, defaultValue, disabled, className, onClick},ref) => {
    const {pending} = useFormStatus()

    return (
        <div className={"space-y-2 w-full"}>
            <div className={"space-y-1 w-full"}>
                {label ? (
                    <Label className={"text-xs font-semibold text-neutral-700"} htmlFor={id}>
                        {label}
                    </Label>
                ) : null}
                <Textarea className={cn("resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm", className)} onKeyDown={onKeyDown} onClick={onClick} onBlur={onBlur} ref={ref} required={required} name={id} id={id} disabled={pending || disabled} aria-describedby={`${id} - error`} defaultValue={defaultValue} placeholder={placeholder}/>
                <FormErrors id={id} errors={errors}/>
            </div>
        </div>
    )
})

FormTextArea.displayName="FormTextArea"