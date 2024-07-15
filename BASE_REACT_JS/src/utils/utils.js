import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const stringToHTML = (embed) => {
  const parentEmbed = document.createElement("span");
  parentEmbed.innerHTML = embed;

  let oldIframe = parentEmbed.querySelectorAll("oembed");
  oldIframe = Array.from(oldIframe);

  oldIframe.forEach((i) => {
    let url = oldIframe[i].getAttribute("url");
    url = url.replace("watch?v=", "embed/");

    const newIframe = document.createElement("iframe");
    newIframe.setAttribute("width", "auto");
    newIframe.setAttribute("height", "auto");
    newIframe.setAttribute("allowFullScreen", "");
    newIframe.setAttribute("frameBorder", 0);
    if (url) {
      newIframe.setAttribute("src", url);
    }
    oldIframe[i].parentNode.replaceChild(newIframe, oldIframe[i]);
  });

  return parentEmbed.outerHTML;
};

const emptyFunction = () => {};

const cmsColumnCalculator = (length) => {
  if (length > 4) return 12 / (4 + 1);
  return 12 / (length + 1);
};

export { emptyFunction, ScrollToTop, stringToHTML, cmsColumnCalculator };
