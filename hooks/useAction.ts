import {useState, useCallback} from "react";
import {ActionState, FieldError} from "@/lib/createSafeAction";

type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput,TOutput>>;

interface UseActionOptions<TOutput> {
    onSuccess?: (data: TOutput) => void;
    onError?: (error: string) => void;
    onComplete?: () => void
}

export const useAction = <TInput, TOutput>(
    action: Action<TInput, TOutput>,
    options: UseActionOptions<TOutput> = {}
) => {
    const [fieldError, setFieldError] = useState<FieldError<TInput> | undefined>(undefined)
    const [data, setData] = useState<TOutput | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const execute = useCallback(async (input: TInput) => {
        setIsLoading(true)

        try{
            const result = await action(input);

            if(!result) {
                return
            }


            setFieldError(result.fieldErrors)


            if(result.error){
                setError(result.error)
                options.onError?.(result.error)
            }

            if(result.data){
                setData(result.data)
                options.onSuccess?.(result.data)
            }
        }finally {
            setIsLoading(false)
            options.onComplete?.()
        }
    },[action, options])

    return {
        execute, fieldError, error, data, isLoading
    }
}