import { cn } from "@/lib/utils";
import TeamSwitcher from "./team-switcher";
import { Search } from "./search";
import { UserNav } from "./user-nav";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="border-b">
      <div className="flex items-center h-16 px-4">
        <TeamSwitcher />

        <nav
          className={cn("flex items-center space-x-4 lg:space-x-6", className)}
          {...props}
        >
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Overview
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
          >
            Customers
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
          >
            Products
          </a>
          <a
            href="#"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
          >
            Settings
          </a>
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          <Search />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
