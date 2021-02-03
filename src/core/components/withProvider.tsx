import React from "react";

export default function withProvider(WrappedComponent: any, Provider: any) {
  return (props: any) => (
    <Provider>
      <WrappedComponent {...props} />
    </Provider>
  );
}
