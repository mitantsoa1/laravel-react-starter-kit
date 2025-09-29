import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { router, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Définition du schéma de validation Zod
const permissionSchema = z.object({
    name: z.string()
        .min(2, {
            message: "Le nom doit contenir au moins 2 caractères.",
        })
        .max(50, {
            message: "Le nom ne peut pas dépasser 50 caractères.",
        })
        .regex(/^[a-zA-Z_]+$/, {
            message: "Le nom ne peut contenir que des lettres et des underscores.",
        })
        .transform((val) => val.toLowerCase().trim()),
})

type CreatePermissionFormData = z.infer<typeof permissionSchema>

export default function CreatePermission({ permission, isEditing }: { permission?: any, isEditing?: boolean }) {
    const [formError, setFormError] = useState<string | null>(null)

    const { data, setData, post, put, processing, errors, setError, clearErrors } = useForm<CreatePermissionFormData>({
        name: permission?.name || "",
    })

    // Fonction de validation avec Zod
    const validateForm = (): boolean => {
        try {
            permissionSchema.parse(data)
            clearErrors()
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Effacer les erreurs précédentes
                clearErrors()

                // Ajouter les nouvelles erreurs
                error.issues.forEach((err) => {
                    const fieldName = err.path[0] as keyof CreatePermissionFormData
                    setError(fieldName, err.message)
                })
            }
            return false
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setFormError(null)

        // Valider le formulaire avec Zod
        if (!validateForm()) {
            return
        }

        try {
            if (isEditing && permission) {
                router.put(`/permissions/${permission.id}`)
            } else {
                router.post('/permissions')
            }
        } catch (error) {
            setFormError("Une erreur est survenue lors de l'envoi du formulaire.")
        }
    }

    // Gestionnaire de changement avec validation en temps réel (optionnel)
    const handleInputChange = (field: keyof CreatePermissionFormData, value: string) => {
        setData(field, value)

        // Validation en temps réel (optionnel)
        if (errors[field]) {
            try {
                permissionSchema.pick({ [field]: true }).parse({ [field]: value })
                clearErrors(field)
            } catch (error) {
                // L'erreur reste affichée
            }
        }
    }

    return (
        <AppLayout>
            <div className="container mx-auto py-10">
                <Card className="max-w-md mx-auto">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <CardTitle className="text-2xl font-bold">
                            {isEditing ? "Update permission" : "Create new permission"}
                        </CardTitle>
                        <Button
                            onClick={() => router.visit('/permissions')}
                            className="inline-flex items-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Permission Name *
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                    required
                                    className={`w-full transition-colors ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="ex: create_user, edit_post, delete_product"
                                />

                                {/* Affichage des erreurs Zod */}
                                {errors.name && (
                                    <div className="text-red-500 text-sm mt-1 flex items-start gap-1">
                                        <span>•</span>
                                        <span>{errors.name}</span>
                                    </div>
                                )}

                                {/* Conseils pour l'utilisateur */}
                                <div className="text-xs text-gray-500 mt-1">
                                    <p>Conseils :</p>
                                    <ul className="list-disc list-inside space-y-1 mt-1">
                                        <li>Utilisez des underscores entre les mots</li>
                                        <li>Exemples : "create_user", "edit_posts", "view_reports"</li>
                                        <li>2 à 50 caractères maximum</li>
                                    </ul>
                                </div>
                            </div>

                            {formError && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="text-red-700 text-sm font-medium">{formError}</div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={processing}
                            >
                                {processing ? "Traitement..." : (isEditing ? "Update Permission" : "Create Permission")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}