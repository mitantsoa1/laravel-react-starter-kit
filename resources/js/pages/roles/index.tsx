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
import { useAdmin } from '@/hooks/use-admin'
import { useAlert } from '@/hooks/use-alert'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { getColorClass } from '@/constants/badge-color'

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

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: (props) => {
                // Typage explicite avec vérification
                const permissions = props.getValue();
                const typedPermissions = permissions as Permission[];

                return (
                    <div className="flex flex-wrap gap-1.5">
                        {typedPermissions?.map((permission) => {

                            const colorClass = getColorClass(permission.name);

                            return (
                                <div
                                    key={permission.id}
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${colorClass}`}
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
            cell: (props) => {
                const roleId = props.getValue() as number;
                const role = props.row.original; // Accès à l'objet Role complet

                return (
                    <div className="flex justify-center gap-2">
                        {isAdmin && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white"
                                    onClick={() => router.get(`/roles/${roleId}/edit`)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white"
                                    onClick={() => handleDelete(roleId)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <div className="container mx-auto py-8 px-2">
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