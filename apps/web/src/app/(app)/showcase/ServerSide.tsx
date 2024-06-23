import directus from "@/lib/directus";
import { readUsers } from "@directus/sdk";
import React from "react";
import ListItemShowcase from "./ListItem";
import { components } from "@/types/api-collection";

const ServerSideShowcase: React.FC = async () => {
  const users = (await directus.request(
    readUsers(),
  )) as components["schemas"]["Users"][];

  return <ListItemShowcase users={users} />;
};

export default ServerSideShowcase;
