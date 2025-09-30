import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { router, usePage } from '@inertiajs/react'
import Swal from 'sweetalert2'
import AppLayout from '@/layouts/app-layout'
import { Permission } from '@/types'
import { useAdmin } from '@/hooks/use-admin'
// import { DataTable } from './data-table'
import { useAlert } from '@/hooks/use-alert'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { getColorClass } from '@/constants/badge-color'


interface PermissionsListProps {
    permissions: Permission[]
}

const PermissionsList: React.FC<PermissionsListProps> = ({ permissions }) => {
    const { isAdmin } = useAdmin();

    useAlert()

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Do you want to delete this permission?",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#111",
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.delete(`/permissions/${id}`);
            }
        });
    }


    const columns: ColumnDef<Permission>[] = [

        {
            accessorKey: 'name',
            header: 'Name',
            cell: (props) => {
                const name = props.row.original.name
                const colorClass = getColorClass(name);

                return (
                    <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${colorClass}`}
                    >
                        <span className="capitalize">
                            {name.replace(/_/g, ' ').toLowerCase()}
                        </span>
                    </div>
                );

            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: (props) => {
                const permission = props.row.original; // Accès à l'objet complet Permission
                return (
                    <div className="flex justify-center gap-2">
                        {isAdmin && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white cursor-pointer"
                                    onClick={() => router.get(`/permissions/${permission.id}/edit`)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
                                    onClick={() => handleDelete(permission.id)}
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
                        <CardTitle className="text-2xl font-bold">Permissions Management</CardTitle>
                        {isAdmin && (
                            <Button
                                onClick={() => router.visit('/permissions/create')}
                                className="inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Add Permission
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={permissions} perPage={5} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

export default PermissionsList