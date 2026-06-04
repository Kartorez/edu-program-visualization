"use client"

import {
    useForm,
    FormProvider,
    FieldValues,
    DefaultValues,
    SubmitHandler,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

type FormProps<T extends FieldValues> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any
    defaultValues?: DefaultValues<T>
    onSubmit: SubmitHandler<T>
    children: React.ReactNode
    className?: string
}

export function Form<T extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    children,
    className,
}: FormProps<T>) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className={className}
                noValidate
            >
                {children}
            </form>
        </FormProvider>
    )
}