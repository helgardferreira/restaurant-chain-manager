import { Meal } from "@/data/meals";
import { ActorLogicFrom, setup } from "xstate";

type FrontOfHouseMachineContext = {
  menu: Meal[];
};

type InitEvent = { type: "INIT" };
type FrontOfHouseMachineEvent = InitEvent;

const frontOfHouseMachine = setup({
  types: {} as {
    context: FrontOfHouseMachineContext;
    events: FrontOfHouseMachineEvent;
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgDMAnLDAFwHkCAJLAV1jHxAActYBLMj05gD0QBaAGzoAnkOEA6AAxz5ChQHZkaEMVKUa9RlI4QANkySt2XHhn6IALACZxiABwBGKdYCcnx7eGPr1mXdnVVUgA */
  id: "frontOfHouse",

  context: {
    menu: [],
  },

  initial: "idle",

  states: {
    idle: {},
  },
});

type FrontOfHouseLogic = ActorLogicFrom<typeof frontOfHouseMachine>;

export type { FrontOfHouseLogic };

export { frontOfHouseMachine };
