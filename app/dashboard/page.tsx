"use client";

import StreamView from "../components/StreamView";

const creatorId = "9d65426b-b5cc-432a-927b-a037e7bef35c"
const Dashboard = () => {
  return <StreamView creatorId={creatorId} playVideo={true} />
};

export default Dashboard;
