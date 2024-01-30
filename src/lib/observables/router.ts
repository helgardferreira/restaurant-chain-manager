import { filter, map } from "rxjs";
import { routerSubject } from "@/router";
import { type IndexSearch } from "@/routes/index.lazy";

const fromRouter = () => routerSubject.asObservable();

const fromRouterBeforeLoad = () =>
  fromRouter().pipe(filter((event) => event.type === "onBeforeLoad"));

const fromRouterOnLoad = () =>
  fromRouter().pipe(filter((event) => event.type === "onLoad"));

const fromRouterOnResolved = () =>
  fromRouter().pipe(filter((event) => event.type === "onResolved"));

const fromIndexSearch = () =>
  fromRouterOnResolved().pipe(
    filter(({ toLocation }) => toLocation.pathname === "/"),
    map((event) => event.toLocation.search as IndexSearch)
  );

export {
  fromRouter,
  fromRouterBeforeLoad,
  fromRouterOnLoad,
  fromRouterOnResolved,
  fromIndexSearch,
};
