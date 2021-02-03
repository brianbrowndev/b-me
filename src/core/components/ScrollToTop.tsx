import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

// from: https://reacttraining.com/react-router/web/guides/scroll-restoration
const ScrollToTop = (props: RouteComponentProps) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location.pathname]);

  // cannot find a type with not null location and children prop...
  return (props as any)["children"] || null;
};

export default withRouter(ScrollToTop);
