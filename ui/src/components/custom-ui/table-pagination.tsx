import { useMemo } from "react";
import { Button } from "../ui/button";

type PaginationProps = {
  current: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

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

export function Pagination({ current, totalPages, onPageChange }: PaginationProps) {
  const pages = useMemo(() => getPageNumbers(current, totalPages), [current, totalPages]);

  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={() => onPageChange(current - 1)} disabled={current === 1}>
        Previous
      </Button>

      {pages.map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            size="sm"
            variant={page === current ? "default" : "outline"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      )}

      <Button variant="outline" size="sm" onClick={() => onPageChange(current + 1)} disabled={current === totalPages}>
        Next
      </Button>
    </div>
  );
}
