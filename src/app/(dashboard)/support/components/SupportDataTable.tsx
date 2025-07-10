"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type supportData = {
    name: string;
    email: string;
    subject: string;
    message: string;
    labelId?: string; 
    _id: string;
    __v: number;
    status: string;
    priority: 'low' | 'medium' | 'high';
    isClosed: boolean;
    replies?: any[];
    replyCount?: number;
    unreadReplies?: number;
    createdAt: string;
};

export const supportColumns: ColumnDef<supportData>[] = [
    {
        accessorKey: "srno",
        header: "Sr No",
        cell: (info) => info.row.index + 1,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="ms-2">
                    {data.labelId ? (
                        <a 
                            href={`/labels/${btoa(data.labelId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                        >
                            {data.name}
                        </a>
                    ) : (
                        data.name
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const data = row.original;
            return <div className="ms-2">{data.email}</div>;
        },
    },
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => {
            const data = row.original;
            return <div className="ms-2">{data.subject}</div>;
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const data = row.original;
            const priorityColors = {
                low: "bg-green-100 text-green-800",
                medium: "bg-yellow-100 text-yellow-800",
                high: "bg-red-100 text-red-800"
            };
            return (
                <Badge className={priorityColors[data.priority]}>
                    {data.priority}
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const data = row.original;
            const statusColors: Record<string, string> = {
                pending: "bg-yellow-100 text-yellow-800",
                "in-progress": "bg-blue-100 text-blue-800",
                resolved: "bg-green-100 text-green-800"
            };
            return (
                <Badge className={statusColors[data.status] || "bg-gray-100 text-gray-800"}>
                    {data.status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "replyCount",
        header: "Replies",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="ms-2 flex items-center gap-2">
                    <span>{data.replyCount || 0}</span>
                    {data.unreadReplies && data.unreadReplies > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                            {data.unreadReplies > 9 ? '9+' : data.unreadReplies}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "isClosed",
        header: "Status",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <Badge className={data.isClosed ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}>
                    {data.isClosed ? "Closed" : "Open"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const data = row.original;
            return <div className="ms-2">{new Date(data.createdAt).toLocaleDateString()}</div>;
        },
    },
];

export function SupportDataTable({ data }: { data: supportData[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns: supportColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            <div className="ms-1">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={supportColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
