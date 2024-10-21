import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MaybeShowComponent = ({ children }) => {
  const [showComponent, setShowComponent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const showPaths = ["/metrics-based", "/ingredients-based", "/home"];
    setShowComponent(
      showPaths.some((path) => location.pathname.startsWith(path))
    );
  }, [location]);
  return showComponent ? <div>{children}</div> : null;
};

export default MaybeShowComponent;
