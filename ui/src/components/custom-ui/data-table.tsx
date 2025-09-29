"use client";

import { useDebouncedCallback } from "use-debounce";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationSkeleton, TableSkeleton } from "./data-table-skeleton";

interface DataTableProps<TData, TValue> {
  withFilter?: boolean;
  isLoading?: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage: number;
  openFilter: (open: boolean) => void;
  handleFilterChange: (key: string, value: string | number) => void;
  search: string;
}

export function DataTable<TData, TValue>({
  withFilter = false,
  isLoading = false,
  columns,
  data,
  pageCount,
  currentPage,
  openFilter,
  handleFilterChange,
  search,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {},
    // defaultColumn: {
    //   size: 200, //starting column size
    //   minSize: 50, //enforced during column resizing
    //   maxSize: 500, //enforced during column resizing
    // },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    manualPagination: true, // important: server-side
    manualFiltering: true, // important: server-side
    pageCount, // total pages from API
  });

  const debounced = useDebouncedCallback((value) => {
    handleFilterChange("search", value);
  }, 500);

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4">
        <Input
          defaultValue={search}
          placeholder="Search something..."
          onChange={(e) => debounced(e.target.value)}
          className="w-full lg:max-w-sm bg-white"
        />
        <div className="flex gap-4">
          {withFilter && (
            <Button variant="outline" onClick={() => openFilter(true)}>
              Filters
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-hidden rounded-md bg-white">
          <Table className="border border-collaps">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                        }}
                        className="border"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell
                        key={cell.id}
                        style={{
                          minWidth: cell.column.columnDef.size,
                          maxWidth: cell.column.columnDef.size,
                        }}
                        className="border whitespace-normal break-words"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      )}
      {isLoading ? (
        <PaginationSkeleton />
      ) : (
        <div className="flex items-center justify-between py-4">
          <span className="text-sm font-medium">
            Page {currentPage} of {pageCount}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("page", currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>

            {getPageNumbers(currentPage, pageCount).map((page, i) =>
              page === "..." ? (
                <span key={i} className="px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={i}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("page", page as number)}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("page", currentPage + 1)}
              disabled={currentPage >= pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// function getPageNumbers(current: number, total: number, delta = 2) {
//   const range: (number | string)[] = [];
//   const rangeWithDots: (number | string)[] = [];
//   let last: number | undefined;

//   for (let i = 1; i <= total; i++) {
//     if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
//       range.push(i);
//     }
//   }

//   for (const i of range) {
//     if (last) {
//       if ((i as number) - last === 2) {
//         rangeWithDots.push(last + 1);
//       } else if ((i as number) - last > 2) {
//         rangeWithDots.push("...");
//       }
//     }
//     rangeWithDots.push(i);
//     last = i as number;
//   }

//   return rangeWithDots;
// }

function getPageNumbers(current: number, total: number, delta = 2) {
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let last: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (last) {
      if ((i as number) - last === 2) {
        rangeWithDots.push(last + 1);
      } else if ((i as number) - last > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    last = i as number;
  }

  return rangeWithDots;
}
