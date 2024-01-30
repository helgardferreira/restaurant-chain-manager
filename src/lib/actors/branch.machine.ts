import { assign, fromEventObservable, setup } from "xstate";
import { distinctUntilChanged, map } from "rxjs";

import {
  RestaurantBranch,
  restaurantBranches,
} from "@/data/restaurantBranches";

import { fromIndexSearch } from "../observables/router";

type BranchUrlChangeEvent = {
  type: "BRANCH_URL_CHANGE";
  branch: string;
};

type BranchMachineContext = {
  currentBranch?: RestaurantBranch;
};

type BranchMachineEvent = BranchUrlChangeEvent;

const branchMachine = setup({
  types: {
    context: {} as BranchMachineContext,
    events: {} as BranchMachineEvent,
  },
  actors: {
    branchUrlChange: fromEventObservable(() =>
      fromIndexSearch().pipe(
        map((search) => search.branch ?? "the-magic-city-grill"),
        distinctUntilChanged(),
        map(
          (branch): BranchUrlChangeEvent => ({
            type: "BRANCH_URL_CHANGE",
            branch,
          })
        )
      )
    ),
  },
  actions: {
    setCurrentBranch: assign((_, params: { branch: string }) => ({
      currentBranch: restaurantBranches.find(({ id }) => id === params.branch),
    })),
    logActiveEntry: () => console.log("active node entered"),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCMBOBDAdgYwBYGIAhAJQEEA5AYQAkB9AVWIBlaaKBxAUQG0AGAXUSgADgHtYASwAuE0ZiEgAHogAsAJgA0IAJ6I1ARhUA6ABwBOAMxq1Z-QDYHjswF9nWtFjxH02GQDcwIjIqOkYWNnIuPkEkEDFJGTkFZQQ1AHZ9IzUAVi1dBH01EyNs1zcQTFEIOAUPHFwFeOlZeViUgFo7PMRO13cMeu9fCQDG8Waktr00tNN7FV47HO7UmyMzbItC0vK6rwkIABswMYSW5MR9Q1M03J1L7LsjC0trW0cnMucgA */
  id: "branch",

  context: {},
  initial: "idle",

  states: {
    active: {
      entry: "logActiveEntry",

      on: {
        BRANCH_URL_CHANGE: {
          target: "active",
          actions: {
            type: "setCurrentBranch",
            params: ({ event: { branch } }) => ({ branch }),
          },
        },
      },
    },

    idle: {},
  },

  invoke: {
    src: "branchUrlChange",
  },

  on: {
    BRANCH_URL_CHANGE: {
      target: ".active",

      actions: {
        type: "setCurrentBranch",
        params: ({ event: { branch } }) => ({ branch }),
      },
    },
  },
});

export { branchMachine };
