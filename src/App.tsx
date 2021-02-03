import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./core/Auth";

import { BlogProvider } from "./blog/BlogContext";
import { CssBaseline } from "@material-ui/core";
import Main from "./Main";
import { AppThemeContextProvider } from "./theme/AppThemeContext";

function App() {
  return (
    <AppThemeContextProvider>
      <Router basename="/me">
        <CssBaseline />
        <AuthProvider>
          <BlogProvider>
            <Main></Main>
          </BlogProvider>
        </AuthProvider>
      </Router>
    </AppThemeContextProvider>
  );
}

export default App;
