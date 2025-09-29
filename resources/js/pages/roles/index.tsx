import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { router } from '@inertiajs/react'
import Swal from 'sweetalert2'
import AppLayout from '@/layouts/app-layout'
import { Role, Permission } from '@/types'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/hooks/use-admin'
import { DataTable } from './data-table'
import { useAlert } from '@/hooks/use-alert'

interface RolesListProps {
    roles: Role[]
}

const RolesList: React.FC<RolesListProps> = ({ roles }) => {
    const { isAdmin } = useAdmin();

    useAlert()

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Do you want to delete this role?",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#111",
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.delete(`/roles/${id}`);
            }
        });
    }

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: (value: Permission[]) => {
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {value?.map((permission: Permission) => {
                            // Couleurs simplifiées basées sur le premier mot
                            const getColorClass = (name: string) => {
                                const firstWord = name.split('_')[0].toLowerCase();
                                const colors = {
                                    create: "bg-green-50 text-green-700 border-green-200",
                                    read: "bg-blue-50 text-blue-700 border-blue-200",
                                    view: "bg-cyan-50 text-cyan-700 border-cyan-200",
                                    update: "bg-yellow-50 text-yellow-700 border-yellow-200",
                                    edit: "bg-orange-50 text-orange-700 border-orange-200",
                                    delete: "bg-red-50 text-red-700 border-red-200",
                                    manage: "bg-purple-50 text-purple-700 border-purple-200",
                                    admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
                                    default: "bg-gray-50 text-gray-700 border-gray-200"
                                };

                                return colors[firstWord as keyof typeof colors] || colors.default;
                            };

                            const colorClass = getColorClass(permission.name);

                            return (
                                <div
                                    key={permission.id}
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${colorClass} hover:scale-105 transition-transform duration-150`}
                                >
                                    <span className="capitalize">
                                        {permission.name.replace(/_/g, ' ').toLowerCase()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: (value: number) => (
                <div className="flex justify-center gap-2">
                    {isAdmin && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white cursor-pointer"
                                onClick={() => router.get(`/roles/${value}/edit`)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
                                onClick={() => handleDelete(value)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <CardTitle className="text-2xl font-bold">Roles Management</CardTitle>
                        {isAdmin && (
                            <Button
                                onClick={() => router.visit('/roles/create')}
                                className="inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Add Role
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={roles} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

export default RolesList