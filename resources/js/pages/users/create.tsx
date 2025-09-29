import { useState } from "react"
import * as z from "zod"
import { router, useForm } from "@inertiajs/react"
import { ArrowLeft, Plus, ChevronDown } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// En haut du fichier, après les imports
type CreateUserFormValues = {
    name: string;
    email: string;
    role_id?: string;
    password?: string;
    password_confirmation?: string;
}

type EditUserFormValues = {
    name: string;
    email: string;
    role_id?: string;
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
        role_id: z.number().min(1, {
            message: "Please select a role.",
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

export default function CreateUser({ user, isEditing, roles }: { user?: any, isEditing?: boolean, roles?: any[] }) {
    const [errors, setErrors] = useState<any>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});
    const formSchema = getFormSchema(!!isEditing);

    const { data, setData, post, put, processing, errors: formErrors } = useForm<CreateUserFormValues>({
        name: user?.name || "",
        email: user?.email || "",
        role_id: user?.role_id || user?.roles?.[0]?.id || "",

        ...((!isEditing) && {
            password: "",
            password_confirmation: "",
        }),
    });

    // Fonction de validation Zod
    const validateForm = (): boolean => {
        const result = formSchema.safeParse(data);

        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as string;
                errors[fieldName] = issue.message;
            });
            setZodErrors(errors);
            return false;
        }

        setZodErrors({});
        return true;
    };

    // Effacer les erreurs Zod quand l'utilisateur modifie un champ
    const handleInputChange = (field: keyof CreateUserFormValues, value: string) => {
        setData(field, value);
        if (zodErrors[field]) {
            setZodErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        // Valider avec Zod avant soumission
        if (!validateForm()) {
            return;
        }

        if (isEditing && user) {
            put(`/users/${user.id}`);
        } else {
            post('/users');
        }
    }

    const handleRoleSelect = (roleId: string) => {
        setData('role_id', roleId);
        setIsRoleDropdownOpen(false);
        // Effacer l'erreur du rôle si elle existe
        if (zodErrors.role_id) {
            setZodErrors(prev => ({
                ...prev,
                role_id: ""
            }));
        }
    };

    const getSelectedRoleName = () => {
        if (!data.role_id) return "Select a role";
        const selectedRole = roles?.find(role => role.id === data.role_id);
        return selectedRole?.name || "Select a role";
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-10">
                <Card className="max-w-md mx-auto">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <CardTitle className="text-2xl font-bold">{isEditing ? "Update user" : "Create new user"}</CardTitle>
                        <Button
                            onClick={() => router.visit('/users')}
                            className="inline-flex items-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                    required
                                    className={`w-full ${zodErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {/* Affichage des erreurs Zod */}
                                {zodErrors.name && <div className="text-red-500 text-sm mt-1">{zodErrors.name}</div>}
                                {/* Affichage des erreurs serveur existantes */}
                                {errors?.name && !zodErrors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    required
                                    className={`w-full ${zodErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {/* Affichage des erreurs Zod */}
                                {zodErrors.email && <div className="text-red-500 text-sm mt-1">{zodErrors.email}</div>}
                                {/* Affichage des erreurs serveur existantes */}
                                {errors?.email && !zodErrors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            {/* Sélecteur de rôle */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role *
                                </Label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                        className={`w-full flex items-center justify-between px-3 py-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${zodErrors.role_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <span className={`${!data.role_id ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {getSelectedRoleName()}
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isRoleDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {roles && roles.length > 0 ? (
                                                <div className="py-1">
                                                    {roles.map((role) => (
                                                        <button
                                                            key={role.id}
                                                            type="button"
                                                            onClick={() => handleRoleSelect(role.id)}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${data.role_id === role.id
                                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                                : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {role.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 text-sm text-gray-500">
                                                    No roles available
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Affichage des erreurs Zod */}
                                {zodErrors.role_id && (
                                    <div className="text-red-500 text-sm mt-1">{zodErrors.role_id}</div>
                                )}
                                {/* Affichage des erreurs serveur existantes */}
                                {errors?.role_id && !zodErrors.role_id && (
                                    <div className="text-red-500 text-sm mt-1">{errors.role_id}</div>
                                )}
                            </div>

                            {!isEditing && (
                                <>
                                    <div>
                                        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={data.password}
                                            onChange={e => handleInputChange('password', e.target.value)}
                                            required
                                            className={`w-full ${zodErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {/* Affichage des erreurs Zod */}
                                        {zodErrors.password && <div className="text-red-500 text-sm mt-1">{zodErrors.password}</div>}
                                        {/* Affichage des erreurs serveur existantes */}
                                        {errors?.password && !zodErrors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            type="password"
                                            id="password_confirmation"
                                            name={"password_confirmation" as keyof FormValues}
                                            value={data.password_confirmation}
                                            onChange={e => handleInputChange('password_confirmation', e.target.value)}
                                            required
                                            className={`w-full ${zodErrors.password_confirmation ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {/* Affichage des erreurs Zod */}
                                        {zodErrors.password_confirmation && (
                                            <div className="text-red-500 text-sm mt-1">{zodErrors.password_confirmation}</div>
                                        )}
                                        {/* Affichage des erreurs serveur existantes */}
                                        {errors?.password_confirmation && !zodErrors.password_confirmation && (
                                            <div className="text-red-500 text-sm mt-1">{errors.password_confirmation}</div>
                                        )}
                                    </div>
                                </>
                            )}

                            {formError && <div className="text-red-500 text-sm">{formError}</div>}

                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={processing}
                            >
                                {processing ? "Processing..." : (isEditing ? "Update User" : "Create User")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}