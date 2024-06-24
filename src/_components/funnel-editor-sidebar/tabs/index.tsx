import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";

type Props = {};

const TabList = (props: Props) => {
  return (
    <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-[#3f67ad] data-[state=active]:text-[white]"
      >
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="data-[state=active]:bg-[#3f67ad] data-[state=active]:text-[white] w-10 h-10 p-0"
      >
        <Plus />
      </TabsTrigger>

      <TabsTrigger
        value="Layers"
        className="w-10 h-10 p-0 data-[state=active]:bg-[#3f67ad] data-[state=active]:text-[white]"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="w-10 h-10 p-0 data-[state=active]:bg-[#3f67ad] data-[state=active]:text-[white]"
      >
        <Database />
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
