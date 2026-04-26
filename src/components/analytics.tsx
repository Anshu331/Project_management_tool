import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

type AnalyticsData = {
  taskCount: number;
  taskDifference: number;
  assignedTaskCount: number;
  assignedTaskDifference: number;
  incompleteTaskCount: number;
  incompleteTaskDifference: number;
  completeTaskCount: number;
  completeTaskDifference: number;
  overdueTaskCount: number;
  overdueTaskDifference: number;
};

interface AnalyticsProps {
  data?: AnalyticsData;
}

export const Analytics = ({ data }: AnalyticsProps) => {
  if (!data) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-x-2">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete tasks"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
            increseValue={data.incompleteTaskDifference}
          />
          <DottedSeparator direction="vertical" className="pl-2" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            increseValue={data.overdueTaskDifference}
          />
          <DottedSeparator direction="vertical" className="pl-2" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed tasks"
            value={data.completeTaskCount}
            variant={data.completeTaskDifference > 0 ? "up" : "down"}
            increseValue={data.completeTaskDifference}
          />
          <DottedSeparator direction="vertical" className="pl-2" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increseValue={data.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" className="pl-2" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increseValue={data.taskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
