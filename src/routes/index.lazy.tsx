import { useSelector } from "@xstate/react";
import { createFileRoute } from "@tanstack/react-router";
import { RemoveSubscribe, Subscribe } from "@react-rxjs/core";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "@/components";
import { BurgerMeals } from "@/components/burger-meals";
import { StockOverview } from "@/components/stock-overview";
import MealView from "@/components/meal-view";

import { cn } from "@/lib/utils";
import { useGlobalActors } from "@/globalState";
import { useCurrentRestaurantActor } from "@/lib/actors/restaurant.machine";

const indexSearchSchema = z.object({
  branchId: z.string().optional(),
});

export type IndexSearch = z.infer<typeof indexSearchSchema>;

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: indexSearchSchema,
});

function Index() {
  const { branchDirectorActor } = useGlobalActors();
  const restaurantActor = useCurrentRestaurantActor();

  const currentBranch = useSelector(
    branchDirectorActor,
    ({ context }) => context.currentBranch
  );
  const mealIsSelected = useSelector(
    restaurantActor,
    ({ context }) => context.selectedMeals.length > 0
  );
  const revenue = useSelector(
    restaurantActor,
    ({ context }) => context.revenue
  );

  return (
    <ScrollArea blockDisplay>
      <RemoveSubscribe>
        <div className="flex-1 h-full p-8 pt-6 space-y-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Grill Giggle Joint{currentBranch && " - " + currentBranch.alias}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenue}</div>
                {/* TODO: PERHAPS TRACK REVENUE CHANGE OVER TIME */}
                {/* <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 overflow-hidden">
              <CardHeader>
                <CardTitle>Stock Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[22rem]">
                <Subscribe fallback={null}>
                  <StockOverview />
                </Subscribe>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Meals</CardTitle>
              </CardHeader>
              <CardContent
                className={cn(
                  "grid",
                  mealIsSelected ? "grid-rows-[1fr,14rem]" : "grid-rows-[1fr]",
                  "gap-3",
                  "px-4",
                  "h-[22rem]"
                )}
              >
                <Subscribe fallback={null}>
                  <BurgerMeals />
                  <MealView />
                </Subscribe>
              </CardContent>
            </Card>
          </div>
        </div>
      </RemoveSubscribe>
    </ScrollArea>
  );
}
