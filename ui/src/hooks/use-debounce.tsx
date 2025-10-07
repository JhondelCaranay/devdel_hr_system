import { useDebouncedCallback } from "use-debounce";

export function useDebouncedFilter(onChangeFilter: (key: string, value: string) => void, delay = 500) {
  const handleDebouncedChange = useDebouncedCallback((key: string, value: string) => {
    onChangeFilter(key, value);
  }, delay);

  return handleDebouncedChange;
}
