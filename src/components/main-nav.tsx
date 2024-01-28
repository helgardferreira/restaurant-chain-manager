import { cn } from "@/lib/utils";
import BranchSwitcher from "./branch-switcher";
import { UserNav } from "./user-nav";
import { Link } from "@tanstack/react-router";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="border-b">
      <div className="flex items-center h-16 px-8">
        <BranchSwitcher />

        <nav
          className={cn("flex items-center space-x-4 lg:space-x-6", className)}
          {...props}
        >
          <Link
            to="/"
            activeProps={{ className: "underline" }}
            className={cn(
              "text-sm",
              "font-medium",
              "transition-colors",
              "hover:text-primary",
              "underline-offset-4",
              "hover:underline"
            )}
          >
            Manage
          </Link>
          <Link
            to="/settings"
            activeProps={{ className: "underline" }}
            className={cn(
              "text-sm",
              "font-medium",
              "transition-colors",
              "hover:text-primary",
              "underline-offset-4",
              "hover:underline"
            )}
          >
            Settings
          </Link>
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
