"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
        header: "Actions",
        cell: ({ row }) => {
            const notification = row.original;
            
            const handleDelete = async () => {
                toast.loading("Deleting...");
                try {
                    const response:any = await apiPost(`/api/notification/delete?notificationId=${notification._id}`, {});
                    if (response.success) {
                        toast.success("Notification is Deleted");
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Error deleting notification:", error);
                    toast.error("Failed to delete notification");
                }
            };

            return (
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    Delete
                </Button>
            );
        },
    },
];

export function NotificationTable() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response:any = await apiGet("/api/notification/getAll");
                if (response.success) {
                    setNotifications(response.data);
                } else {
                    toast.error("Failed to fetch notifications");
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                toast.error("Error loading notifications");
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="w-full space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
            <DataTable columns={columns} data={notifications} />
        </div>
    );
}
