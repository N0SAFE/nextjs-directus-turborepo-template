"use client";

import directus from "@/lib/directus";
import { readUsers } from "@directus/sdk";
import React, { Suspense } from "react";
import ListItemShowcase from "./ListItem";
import { useQuery } from "@tanstack/react-query";
import Loader from "@repo/ui/components/atomics/atoms/Loader";
import { components } from "@/types/api-collection";

const ClientSideShowcase: React.FC = () => {
  const { data: users } = useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      return (await directus.request(
        readUsers(),
      )) as components["schemas"]["Users"][];
    },
  });

  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <ListItemShowcase users={users} />
    </Suspense>
  );
};

export default ClientSideShowcase;
