import React from "react";

import { Separator } from "@repo/ui/components/shadcn/separator";
import ServerSideShowcase from "./ServerSide";
import ClientSideShowcase from "./ClientSide";

const ShowcasePage: React.FC = async () => {
  // console.log(await directus.getToken());
  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full">
        <h1>server side</h1>
        <ServerSideShowcase />
      </div>
      <Separator orientation="vertical" />
      <div className="w-full h-full">
        <h1>client side</h1>
        <ClientSideShowcase />
      </div>
    </div>
  );
};

export default ShowcasePage;
