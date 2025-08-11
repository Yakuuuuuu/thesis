import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";

type RoomTabsProps = {
  rooms: string[];
  value: string;
  onValueChange: (value: string) => void;
};

const RoomTabs = ({ rooms, value, onValueChange }: RoomTabsProps) => {
  return (
    <div className="max-w-full overflow-x-auto">
      <Tabs value={value} onValueChange={onValueChange}>
        <TabsList className="bg-transparent p-0 gap-1">
          {rooms.map((r) => (
            <TabsTrigger key={r} value={r} className="px-2 py-1 text-sm">
              Room {r}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default memo(RoomTabs);
