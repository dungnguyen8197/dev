import { useState } from "react";

export default function useSearch() {
  const [phone, setPhone] = useState("");

  const handleChangePhone = (e) => setPhone(e.target.value);

  return { phone, handleChangePhone };
}
