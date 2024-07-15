import { useState, useEffect } from "react";
import breakpoints from "assets/theme/base/breakpoints";

const DefaultNavbarHook = () => {
  const [dropdown, setDropdown] = useState("");
  const [dropdownEl, setDropdownEl] = useState("");
  const [dropdownName, setDropdownName] = useState("");
  const [nestedDropdown, setNestedDropdown] = useState("");
  const [nestedDropdownEl, setNestedDropdownEl] = useState("");
  const [nestedDropdownName, setNestedDropdownName] = useState("");
  const [arrowRef, setArrowRef] = useState(null);
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const openMobileNavbar = () => setMobileNavbar(!mobileNavbar);

  useEffect(() => {
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }
    window.addEventListener("resize", displayMobileNavbar);
    displayMobileNavbar();
    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  return {
    dropdown,
    setDropdown,
    dropdownEl,
    setDropdownEl,
    dropdownName,
    setDropdownName,
    nestedDropdown,
    setNestedDropdown,
    nestedDropdownEl,
    setNestedDropdownEl,
    nestedDropdownName,
    setNestedDropdownName,
    arrowRef,
    setArrowRef,
    mobileNavbar,
    setMobileNavbar,
    mobileView,
    setMobileView,
    openMobileNavbar,
  };
};

export default DefaultNavbarHook;
