"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
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

export type Track = {
  _id: string;
  songName: string;
  genre: string;
  language: string;
  status: number;
  releasedate: string;
  totalTracks: number;
  primarySinger?: { _id: string; artistName: string } | null;
  singers?: { _id: string; artistName: string }[];
  composers?: { _id: string; artistName: string }[];
  lyricists?: { _id: string; artistName: string }[];
  producers?: { _id: string; artistName: string }[];
};

export const albumColumns: ColumnDef<Track>[] = [
    {
        accessorKey: "srno",
        header: "Sr No",
        cell: (info) => info.row.index + 1,
    },
  {
    accessorKey: "songName",
    header: "Song Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "isrc",
    header: "isrc",
    cell: (info) => info.getValue(),
  },

];

export function TrackDataTable({ data }: { data: Track[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
  
    const table = useReactTable({
      data,
      columns: albumColumns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      initialState: { pagination: { pageSize: 13 } }, // Set initial page size to 20 or any desired number
    });
  
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by song name..."
            value={(table.getColumn("songName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("songName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={albumColumns.length} className="text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </div>
      </div>
    );
  }
  