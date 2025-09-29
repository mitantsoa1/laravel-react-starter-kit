import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Permission, Role } from "@/types"
import { router } from "@inertiajs/react"

interface Column {
    accessorKey: keyof Role | "actions"
    header: string
    cell?: (value: any) => React.ReactNode
}

interface DataTableProps {
    columns: Column[]
    data: Role[]
}

export function DataTable({ columns, data }: DataTableProps) {
    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.accessorKey} className="text-center">
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length ? (
                        data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={`${rowIndex}-${column.accessorKey}`}
                                        className="text-center"
                                    >
                                        {column.cell
                                            ? column.cell(row[column.accessorKey])
                                            : column.accessorKey === 'permissions'
                                                ? (
                                                    <div className="flex flex-wrap justify-center gap-1">
                                                        {(row.permissions as Permission[])?.map((permission: Permission) => (
                                                            <Badge
                                                                key={permission.id}
                                                                variant="outline"
                                                                className="capitalize border-blue-500 rounded-lg p-1"
                                                            >
                                                                {permission.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )
                                                : String(row[column.accessorKey])
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}