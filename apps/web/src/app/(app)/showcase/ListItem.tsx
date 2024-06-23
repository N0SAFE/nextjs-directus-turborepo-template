import { components } from "@/types/api-collection";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/shadcn/card";
import React from "react";

type ListItemShowcaseProps = {
  users?: components["schemas"]["Users"][];
};

const ListItemShowcase: React.FC<ListItemShowcaseProps> = ({ users }) => {
  return (
    <div className="flex flex-col gap-4">
      {users?.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>ID: {user.id}</CardTitle>
          </CardHeader>
          <CardContent>status {user.status}</CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListItemShowcase;
