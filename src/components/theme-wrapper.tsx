import React, { useEffect } from "react";
import { RouterUtils } from "../utils/router-utils";

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper = (props: ThemeWrapperProps) => {
  const { theme } = RouterUtils.useSearch();
  const colors = RouterUtils.useMapFromSearch("colors");

  useEffect(() => {
    window.document.body.className = theme || "";
    Object.keys(colors).forEach(name => {
      window.document.body.style.setProperty(name, colors[name]);
    });
  }, [theme, colors]);

  return <React.Fragment>{props.children}</React.Fragment>
}

export { ThemeWrapper }
