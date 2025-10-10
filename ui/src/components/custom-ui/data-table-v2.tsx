"use client";

// import { useDebouncedCallback } from "use-debounce";
import { type ColumnDef, flexRender, type Table as TableType } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { PaginationSkeleton, TableSkeleton } from "./data-table-skeleton";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

export type DataTableDeleteSelectedRowsProps = {
  rowSelection: object;
  totalRows: number;
  onDeleteIds: (ids: number[]) => void;
  canDelete: boolean;
};

export const DataTableDeleteSelectedRows = ({
  rowSelection,
  totalRows,
  onDeleteIds,
  canDelete,
}: DataTableDeleteSelectedRowsProps) => {
  return (
    <>
      {Boolean(Object.keys(rowSelection || {}).length) && (
        <div className="text-muted-foreground flex-1 text-sm">
          {Object.keys(rowSelection || {}).length} of {totalRows} row(s)
        </div>
      )}
      {Boolean(Object.keys(rowSelection || {}).length) && (
        <Button
          variant="destructive"
          onClick={() => {
            const selectedIds = Object.keys(rowSelection || {}).map((id) => Number(id));
            onDeleteIds(selectedIds);
          }}
          disabled={canDelete}
        >
          Delete
        </Button>
      )}
    </>
  );
};

type DataTableColumnFilterProps<TData> = {
  table: TableType<TData>;
};

export const DataTableColumnFilter = <TData,>({ table }: DataTableColumnFilterProps<TData>) => {
  return (
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
  );
};

interface DataTableProps<TData, TValue> {
  table: TableType<TData>;
  isLoading?: boolean;
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  currentPage: number;
  onChangeFilter: (key: string, value: string | number) => void;
  pageKey?: string;
}

export function DataTableV2<TData, TValue>({
  table,
  isLoading = false,
  columns,
  pageCount,
  currentPage,
  onChangeFilter,
  pageKey = "page",
}: DataTableProps<TData, TValue>) {
  return (
    <>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table className="rounded-lg bg-slate-100/20">
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
                      className=""
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
                      className="whitespace-normal break-words"
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
              onClick={() => onChangeFilter(pageKey, currentPage - 1)}
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
                  onClick={() => onChangeFilter(pageKey, page as number)}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onChangeFilter(pageKey, currentPage + 1)}
              disabled={currentPage >= pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

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
