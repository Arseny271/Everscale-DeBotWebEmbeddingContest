import { useLocation } from "react-router-dom";

function parseUrlString(url: string) {
  if (!url) return {}
  return url.replace('?','').split('&').reduce(
    (p: any, e: any) => {
      const a = e.split('=');
      p[decodeURIComponent(a[0])] = a[1]?decodeURIComponent(a[1]):undefined;
      return p;
    }, {})
}

function useSearch(): {[id: string]: string} {
  const location = useLocation();
  return parseUrlString(location.search);
}

function getSearch(): {[id: string]: string} {
  const location = window.location;
  return parseUrlString(location.search);
}

function useMapFromSearch(fileld: string): {[key: string]: string } {
  const map = useSearch()[fileld];

  try {
    const result: {[key: string]: string } = {};
    map.slice(1, -1).split(",").forEach((property: string) => {
      const [name, value] = property.split(":");
      result[name] = value;
    });

    return result;
  } catch (error) {
    return {}
  }
}

const RouterHooks = {
  useSearch, getSearch
}

const RouterUtils = {
  useSearch, getSearch, useMapFromSearch
}

export { RouterUtils, RouterHooks }
