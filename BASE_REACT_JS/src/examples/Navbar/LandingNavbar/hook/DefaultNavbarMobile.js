import { useState } from "react";

const DefaultNavbarMobileHook = () => {
  const [collapse, setCollapse] = useState("");

  const handleSetCollapse = (name) => (collapse === name ? setCollapse(false) : setCollapse(name));

  return { collapse, setCollapse, handleSetCollapse };
};

export default DefaultNavbarMobileHook;
