import {
  RestaurantBranch,
  restaurantBranches,
} from "@/data/restaurantBranches";
import { fromTransition } from "xstate";

type RestaurantBranchEvent = {
  type: "SELECT_BRANCH";
  branch: RestaurantBranch;
};

const branchLogic = fromTransition(
  (_, event: RestaurantBranchEvent) => event.branch,
  restaurantBranches[0]
);

export { branchLogic };
