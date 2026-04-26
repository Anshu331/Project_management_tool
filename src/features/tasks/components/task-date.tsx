import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { TaskStatus } from "../types";

interface TaskDateProps {
  value: string;
  className?: string;
  status: TaskStatus;
}

export const TaskDate = ({ value, className, status }: TaskDateProps) => {
  if (!value) {
    return (
      <div className="text-muted-foreground">
        <span className={cn("truncate", className)}>No due date</span>
      </div>
    );
  }

  const today = new Date();
  const endDate = new Date(value);
  if (Number.isNaN(endDate.getTime())) {
    return (
      <div className="text-muted-foreground">
        <span className={cn("truncate", className)}>No due date</span>
      </div>
    );
  }
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  if (status === "DONE") {
    textColor = "text-black";
  } else if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }
  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>{format(endDate, "PPP")}</span>
    </div>
  );
};
