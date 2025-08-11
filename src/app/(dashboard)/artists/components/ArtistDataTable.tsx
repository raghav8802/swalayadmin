"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export type Artist = {
  _id: string;
  labelId: string;
  artistName: string;
  iprs: boolean;
  iprsNumber: string;
  isComposer: boolean;
  isLyricist: boolean;
  isProducer: boolean;
  isSinger: boolean;
};

export const artistColumns: ColumnDef<Artist>[] = [
  {
    id: "serialNumber",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "artistName",
    header: "Artist Name",
    cell: ({ row }) => {
      const artist = row.original;
      return (
        <Link
          className="ms-2 text-blue-600"
          href={`/artists/${btoa(artist._id)}`}
        >
          {artist.artistName}
        </Link>
      );
    },
  },
  {
    accessorKey: "artistTypes",
    header: "Artist Type",
    cell: ({ row }) => {
      const artistType = row.original;
      return (
        <div className="ms-2 ">
          {artistType.isSinger && (
            <span className="me-2 inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Singer
            </span>
          )}

          {artistType.isLyricist && (
            <span className="me-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              Lyricist
            </span>
          )}

          {artistType.isComposer && (
            <span className="me-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Composer
            </span>
          )}

          {artistType.isProducer && (
            <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
              Producer
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "iprs",
    header: "IPRS",
    cell: ({ row }) => (
      <div>
        {row.getValue("iprs") ? (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            No
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "iprsNumber",
    header: "IPRS Number",
    cell: ({ row }) => <div>{row.getValue("iprsNumber")}</div>,
  },
  {
    accessorKey: "viewArtist",
    header: "View",
    cell: ({ row }) => {
      const artist = row.original;
      return (
        <Link href={`/artists/${btoa(artist._id)}`}>
          <Button variant="secondary" size="sm">
            View
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "editArtist",
    header: "Edit",
    cell: ({ row }) => {
      const artist = row.original;
      return (
        <Link href={`/artists/edit/${btoa(artist._id)}`}>
          <Button variant="default" size="sm">
            Edit
          </Button>
        </Link>
      );
    },
  },
];

export function ArtistDataTable({ data }: { data: Artist[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: artistColumns,
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
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter artist names..."
          value={
            (table.getColumn("artistName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("artistName")?.setFilterValue(event.target.value)
          }
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
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                <TableCell
                  colSpan={artistColumns.length}
                  className="h-24 text-center"
                >
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
