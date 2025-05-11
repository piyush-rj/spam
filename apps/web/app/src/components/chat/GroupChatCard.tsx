import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../chat/ui/card";
import GroupChatCardMenu from "./GroupCardMenu";
import { ChatGroupType, CustomUser } from "../../../../types/ChatTypes";

export default function GroupChatCard({
  group,
  user,
}: {
  group: ChatGroupType;
  user: CustomUser;
}) {
  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center ">
        <CardTitle className="text-2xl">{group.title}</CardTitle>
        <GroupChatCardMenu user={user} group={group} />
      </CardHeader>
      <CardContent>
        <p>
          Passcode :-<strong>{group.passcode}</strong>
        </p>
        <p>Created At :-{new Date(group.createdAt).toDateString()}</p>
      </CardContent>
    </Card>
  );
}