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
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export type Copyright = {
  _id: string;
  labelId: string;
  trackId: string;
  label: string;
  link: string;
  status: boolean;
};

export const copyrightsColumns: ColumnDef<Copyright>[] = [
  {
    accessorKey: "srno",
    header: "Sr No",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "labelName",
    header: "Label",
    cell: ({ row }) => {
      const copyrightsData = row.original;
      return <div>{copyrightsData.label}</div>;
    },
  },
  {
    accessorKey: "link",
    header: "Youtube Url",
    cell: ({ row }) => {
      const copyrightsData = row.original;
      return (
        copyrightsData &&
        copyrightsData.link && (
          <Link className="ms-2 text-blue-600" href={copyrightsData.link}>
            {copyrightsData.link.length > 30
              ? `${copyrightsData.link.substring(0, 45)}...`
              : copyrightsData.link}
          </Link>
        )
      );
    },
  },
  {
    accessorKey: "staus",
    header: "Staus",

    cell: ({ row }) => {
      const copyrightsData = row.original;
      return (
        <div className="ms-2 ">
          {copyrightsData.status && (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Success
            </span>
          )}

          {!copyrightsData.status && (
            <span className="me-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              Processing
            </span>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "actionColumn",
    header: "Action",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const copyrightsData = row.original;
      return (
        <div
          className="flex align-center cursor-pointer"
          onClick={() => navigator.clipboard.writeText(copyrightsData.link)}
        >
          <i className="bi bi-clipboard me-2"></i> Copy url
        </div>
      );
    },
  },
];

export function CopyRightsDataTable({ data }: { data: Copyright[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: copyrightsColumns,
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
        {/* <Input
          placeholder="Filter label..."
          value={(table.getColumn("labelName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("labelName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
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
                  colSpan={copyrightsColumns.length}
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
