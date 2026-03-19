import React, { useState, useEffect } from "react";
import { Gallery } from "./pages/Gallery";
import { PostView } from "./pages/PostView";

function getRoute(): { page: "gallery" } | { page: "view"; slug: string } {
  const hash = window.location.hash;
  const viewMatch = hash.match(/^#\/view\/(.+)$/);
  if (viewMatch) return { page: "view", slug: decodeURIComponent(viewMatch[1]) };
  return { page: "gallery" };
}

export const App: React.FC = () => {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route.page === "view") {
    return <PostView slug={route.slug} />;
  }
  return <Gallery />;
};
