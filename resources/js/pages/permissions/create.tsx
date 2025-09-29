import { useState } from "react"
import { router, useForm } from "@inertiajs/react"
import { ArrowLeft } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface CreatePermissionFormData {
    name: string;
}

export default function CreatePermission({ permission, isEditing }: { permission?: any, isEditing?: boolean }) {
    const [formError, setFormError] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors } = useForm<CreatePermissionFormData>({
        name: permission?.name || "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            put(`/permissions/${permission.id}`);
        } else {
            post('/permissions');
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
                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {/* <InputError message={errors.name} className="mt-2" /> */}
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            {formError && (
                                <div className="text-red-500 text-sm">{formError}</div>
                            )}

                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={processing}
                            >
                                {isEditing ? "Update Permission" : "Create Permission"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}