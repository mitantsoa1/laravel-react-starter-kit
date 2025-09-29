import { useState, useEffect } from "react"
import * as z from "zod"
import { router, useForm } from "@inertiajs/react"
import { ArrowLeft, X, Check } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type CreateRoleFormValues = {
    name: string;
    permissions?: string[];
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Role name must be at least 2 characters.",
    }),
    permissions: z.array(z.string()).optional(),
});

export default function CreateRole({ role, isEditing, permissions, allPermissions }: {
    role?: any,
    isEditing?: boolean,
    permissions?: any[],
    allPermissions?: any[]
}) {
    const [errors, setErrors] = useState<any>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, setData, post, put, processing, errors: formErrors } = useForm<CreateRoleFormValues>({
        name: role?.name || "",
        permissions: role?.permissions || [],
    });

    // Initialiser les permissions sélectionnées à partir du rôle
    useEffect(() => {
        if (role?.permissions) {
            setSelectedPermissions(role.permissions.map((p: any) => p.id || p));
        }
    }, [role]);

    // Mettre à jour les données du formulaire quand les permissions changent
    useEffect(() => {
        setData('permissions', selectedPermissions);
    }, [selectedPermissions, setData]);

    // Fusionner les permissions du rôle avec toutes les permissions disponibles
    const availablePermissions = allPermissions || permissions || [];

    // Filtrer les permissions basé sur la recherche
    const filteredPermissions = availablePermissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePermissionToggle = (permissionId: string) => {
        const newSelectedPermissions = selectedPermissions.includes(permissionId)
            ? selectedPermissions.filter(id => id !== permissionId)
            : [...selectedPermissions, permissionId];

        setSelectedPermissions(newSelectedPermissions);
    };

    const removePermission = (permissionId: string) => {
        const newSelectedPermissions = selectedPermissions.filter(id => id !== permissionId);
        setSelectedPermissions(newSelectedPermissions);
    };

    const selectAllPermissions = () => {
        const allPermissionIds = availablePermissions.map(p => p.id);
        setSelectedPermissions(allPermissionIds);
    };

    const clearAllPermissions = () => {
        setSelectedPermissions([]);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing && role) {
            put(`/roles/${role.id}`);
        } else {
            post('/roles');
        }
    }

    // Obtenir le nom d'une permission par son ID
    const getPermissionName = (permissionId: string) => {
        const permission = availablePermissions.find(p => p.id === permissionId);
        return permission?.name || permissionId;
    };

    // Obtenir la description d'une permission par son ID
    const getPermissionDescription = (permissionId: string) => {
        const permission = availablePermissions.find(p => p.id === permissionId);
        return permission?.description || "";
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-10">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <CardTitle className="text-2xl font-bold">
                            {isEditing ? `Edit Role: ${role?.name}` : "Create new role"}
                        </CardTitle>
                        <Button
                            onClick={() => router.visit('/roles')}
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
                                    Role Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                    className="w-full"
                                />
                                {errors?.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            {/* Section des permissions */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Label htmlFor="permissions" className="block text-sm font-medium text-gray-700">
                                            Permissions
                                        </Label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {selectedPermissions.length} of {availablePermissions.length} permissions selected
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={selectAllPermissions}
                                            disabled={selectedPermissions.length === availablePermissions.length}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={clearAllPermissions}
                                            disabled={selectedPermissions.length === 0}
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                </div>

                                {/* Permissions sélectionnées */}
                                {selectedPermissions.length > 0 && (
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <Label className="text-sm font-medium text-gray-700 mb-3 block">
                                            Selected Permissions ({selectedPermissions.length})
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPermissions.map(permissionId => (
                                                <div
                                                    key={permissionId}
                                                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm"
                                                >
                                                    <span>{getPermissionName(permissionId)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePermission(permissionId)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Barre de recherche */}
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search permissions by name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pr-10"
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Liste des permissions */}
                                <div className="border rounded-lg max-h-96 overflow-y-auto">
                                    {filteredPermissions.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No permissions found matching your search
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {filteredPermissions.map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-center h-5 mt-0.5">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPermissions.includes(permission.id)}
                                                            onChange={() => handlePermissionToggle(permission.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {permission.name}
                                                            </span>
                                                            {selectedPermissions.includes(permission.id) && (
                                                                <Check className="h-3 w-3 text-green-500" />
                                                            )}
                                                        </div>
                                                        {permission.description && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {permission.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {errors?.permissions && (
                                    <div className="text-red-500 text-sm">{errors.permissions}</div>
                                )}
                            </div>

                            {formError && <div className="text-red-500 text-sm">{formError}</div>}

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    className="flex-1 cursor-pointer"
                                    disabled={processing}
                                >
                                    {processing ? "Processing..." : (isEditing ? "Update Role" : "Create Role")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}