import { Ingredient } from "@/data/meals";

export type IngredientStock = Ingredient & {
  excess: number;
  current: number;
  inMenu: number;
};
