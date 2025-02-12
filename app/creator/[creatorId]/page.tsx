import StreamView from "@/app/components/StreamView";
import React from "react";

const CreatorShare = ({
  params: { creatorId },
}: {
  params: { creatorId: string };
}) => {
  return <div>
    <StreamView creatorId={creatorId} playVideo={false} />
  </div>;
};

export default CreatorShare;
