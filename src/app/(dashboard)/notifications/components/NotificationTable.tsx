"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import {
    ColumnDef,
    SortingState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";

interface Notification {
    _id: string;
    labels: string[] | null;
    category: string | null;
    message: string;
    time: Date;
}

const columns: ColumnDef<Notification>[] = [
    {
        id: "serialNumber",
        header: "S.No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        accessorKey: "labels",
        header: "Labels",
        cell: ({ row }) => {
            const labels = row.getValue<string[] | null>("labels");
            return (
                <div>{labels?.length ? labels.join(", ") : "All"}</div>
            );
        },
    },    
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <div>{row.getValue("category") || "N/A"}</div>,
    },
    {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => {
            const message = row.getValue<string>("message");
            return (
                <div dangerouslySetInnerHTML={{ __html: message }} />
            );
        },
    },    
    {
        accessorKey: "time",
        header: "Time",
        cell: ({ row }) => <div>{new Date(row.getValue("time")).toLocaleString()}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const notification = row.original;
            
            const handleDelete = async () => {
                toast.loading("Deleting...")
                try {
                    const response:any = await apiPost(`/api/notification/delete?notificationId=${notification._id}`, {});
                    if (response.success) {
                        toast.success("Notification is Deleted")
                        window.location.reload()
                    }
                    // Refresh data or remove item from table state
                    console.log("notification delete");
                } catch (error) {
                    console.error("Error deleting notification:", error);
                }
            };

            return (
                <Button variant="ghost" className="bg-red-500 text-white" onClick={handleDelete}>
                    Delete
                </Button>
            );
        },
    },
];

export function NotificationTable() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response:any = await apiGet("/api/notification/getAll");
                console.log("get api notification :");
                console.log(response);
                
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const table = useReactTable({
        data: notifications,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { sorting },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                {/* Add any filtering or sorting controls here */}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No notifications available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
