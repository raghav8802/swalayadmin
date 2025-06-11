"use client";

import * as React from "react";
import Style from '../../../styles/MusicListItem.module.css'

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

import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export type Album = {
    _id: string;
    artist: string;
    cline: string;
    comment: string | null;
    date: string;
    genre: string;
    labelId: string;
    language: string;
    platformLinks: string | null;
    pline: string;
    releasedate: string;
    status: number;
    thumbnail: string | null;
    title: string;
    totalTracks: number;
    upc: string | null;
};

export const albumColumns: ColumnDef<Album>[] = [
    {
        accessorKey: "srno",
        header: "Sr No",
        cell: (info) => info.row.index + 1,
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const album = row.original;
            return <Link className="ms-2 text-blue-600" href={`/albums/viewalbum/${btoa(album._id)}`}>{album.title}</Link>;
        },
    },
    {
        accessorKey: "artist",
        header: "Artist",
        cell: ({ row }) => <div><i className="bi bi-person mr-2"></i> {row.getValue("artist")}</div>,
    },
    {
        accessorKey: "totalTracks",
        header: "Total Tracks",
        cell: ({ row }) => <div><i className="bi bi-music-note-beamed mr-2"></i> {row.getValue("totalTracks")}</div>,
    },
    {
        accessorKey: "genre",
        header: "Genre",
        cell: ({ row }) => <div>{row.getValue("genre")}</div>,
    },

    {
        accessorKey: "language",
        header: "Language",
        cell: ({ row }) => <div>{row.getValue("language")}</div>,
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            let label, color;

            switch (status) {
                case 0:
                    label = "Draft";
                    color = "purple";
                    break;
                case 1:
                    label = "Processing";
                    color = "blue";
                    break;
                case 2:
                    label = "Approved";
                    color = "purple";
                    break;
                case 3:
                    label = "Rejected";
                    color = "red";
                    break;
                case 4:
                    label = "Live";
                    color = "green";
                    break;
                default:
                    label = "Unknown";
                    color = "yellow";
            }

            return (
                <div
                    className={`inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-700 ring-1 ring-inset ring-${color}-600/10`}
                >
                    {label}
                </div>
            );
        },
    },
    {
        accessorKey: "releasedate",
        header: "Release Date",
        cell: ({ row }) => {
            const releaseDate = row.getValue("releasedate");
    
            // Ensure releaseDate is a valid string or number
            const isValidDate = releaseDate && (typeof releaseDate === 'string' || typeof releaseDate === 'number');
            const date = isValidDate ? new Date(releaseDate) : null;
    
            return (
                <div>
                    {date ? date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A"}
                </div>
            );
        },
    },
    
    {
        accessorKey: "submissiondate", // Ensure this matches the data field name
        header: "Submission Date",
        cell: ({ row }) => {
            const album = row.original;
            const date = album.date ? new Date(album.date) : null; // Convert the string to a Date object
            return (
                <div className="ps-3">
                    {date ? date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A"}
                </div>
            ); // 'en-GB' formats as day/month/year
        },
    },
    


];

export function AlbumDataTable({ data }: { data: Album[] }) {
    
    
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
        data,
        columns: albumColumns,
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
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            const title = row.getValue("title")?.toString().toLowerCase() || "";
            const artist = row.getValue("artist")?.toString().toLowerCase() || "";
            
            return title.includes(searchValue) || artist.includes(searchValue);
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by title or artist..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
            </div>
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
                                <TableCell colSpan={albumColumns.length} className="h-24 text-center">
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
                    >Next</Button></div></div></div>
    );
}
