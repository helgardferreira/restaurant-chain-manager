import { Ingredient } from "@/data/meals";

export type IngredientStock = Ingredient & {
  excess: number;
  current: number;
  inMenu: number;
};

export type OsString =
  | "Mac OS"
  | "iOS"
  | "Windows"
  | "Android"
  | "Linux"
  | null;
