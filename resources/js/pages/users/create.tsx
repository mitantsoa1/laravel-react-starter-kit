import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import axios from "axios"
import { useState } from "react"
import { router } from "@inertiajs/react"
import { ArrowLeft, Plus } from "lucide-react"

// En haut du fichier, après les imports
type CreateUserFormValues = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

type EditUserFormValues = {
    name: string;
    email: string;
}

type FormValues = CreateUserFormValues | EditUserFormValues;

const getFormSchema = (isEditing: boolean) => {
    const baseSchema = {
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        email: z.email({
            message: "Please enter a valid email address.",
        }),
    };

    if (!isEditing) {
        return z.object({
            ...baseSchema,
            password: z.string().min(8, {
                message: "Password must be at least 8 characters.",
            }),
            password_confirmation: z.string()
        }).refine((data) => data.password === data.password_confirmation, {
            message: "Passwords don't match",
            path: ["password_confirmation"],
        });
    }

    return z.object(baseSchema);
};

export default function CreateUser({ user, isEditing }: { user?: any, isEditing?: boolean }) {

    const [errors, setErrors] = useState<any>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const formSchema = getFormSchema(!!isEditing);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            ...((!isEditing) && {
                password: "",
                password_confirmation: "",
            }),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            let response = null;
            if (isEditing && user) {
                // Update existing user
                response = await axios.put(`/users/${user.id}`, values);
            } else {
                response = await axios.post("/users", values);
            }
            if (response.data && response.data.status === 'success') {
                toast.success("User created successfully!");
                router.visit('/users');
            } else {
                toast.error("An error occurred while creating the user.");
                setFormError("An unexpected error occurred. Please try again.");
            }
            // Redirection après succès
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error("An error occurred while creating the user.");
                setFormError("An unexpected error occurred. Please try again.");
            }
        }
    }

    return (
        <div className="container mx-auto py-10">

            <Card className="max-w-md mx-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                    <CardTitle className="text-2xl font-bold">{isEditing ? "Update user" : "Create new user"}</CardTitle>
                    <Button
                        onClick={() => router.visit('/users')}
                        className="inline-flex items-center gap-2  cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage>
                                            {errors?.name && errors?.name[0]}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage>
                                            {errors?.email && errors?.email[0]}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                            {!isEditing && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name={"password" as keyof FormValues}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} placeholder="********" />
                                                </FormControl>
                                                <FormMessage>
                                                    {errors?.password && errors?.password[0]}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={"password_confirmation" as keyof FormValues}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} placeholder="********" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            {formError && <div className="text-red-500 text-sm">{formError}</div>}
                            <Button type="submit" className="w-full cursor-pointer">{isEditing ? "Update User" : "Create User"}</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}