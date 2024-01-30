import { cn } from "@/lib/utils";
import { TooltipProps } from "recharts";

type ChartTooltipProps = TooltipProps<number, string> & {
  className?: string;
};

export function ChartTooltip(props: ChartTooltipProps) {
  const { className, payload, label } = props;

  return (
    <div
      className={cn(
        "z-50",
        "overflow-hidden",
        "rounded-md",
        "border",
        "bg-popover",
        "px-3",
        "py-1.5",
        "text-sm",
        "text-popover-foreground",
        "shadow-md",
        "animate-in",
        "fade-in-0",
        "zoom-in-95",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
    >
      {label && <p className="font-medium">{label}</p>}
      {payload && (
        <div className="flex flex-col">
          {payload.map(({ dataKey, value }) => (
            <p
              key={dataKey}
              className="text-sm capitalize text-zinc-600 dark:text-zinc-400"
            >
              {dataKey}: {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
