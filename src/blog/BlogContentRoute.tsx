import React from "react";
import BlogContent from "./BlogContent";
import { match } from "react-router";

const BlogContentRoute = (params: { match: match }) => (
  <BlogContent url={params.match.url} />
);

export default BlogContentRoute;
