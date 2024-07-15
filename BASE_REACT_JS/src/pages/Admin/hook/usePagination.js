import { useState } from "react";

export default function usePagination() {
  const [page, setPage] = useState(0);
  const [number, setNumber] = useState(10);

  return { page, setPage, number, setNumber };
}
