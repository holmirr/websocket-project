"use client";
import { pusherClient } from "@/libs/pusher/client";
import { useEffect, useState } from "react";
export default function Download() {
  const [channelName, setChannelName] = useState<string>("");
  useEffect(() => {
    if (!channelName) return;
    pusherClient.subscribe(channelName);
    pusherClient.bind("evt::test", (data: string) => {
      console.log(data);
    });
    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind("evt::test");
    };
  }, [channelName]);

  const handleDownload = async () => {
    const channelName = crypto.randomUUID();
    setChannelName(channelName);
    const res = await fetch("/api/test", {
      method: "POST",
      body: JSON.stringify({ channelName }),
    });
    const data = await res.json();
    console.log(data);
  };

  const handleCancel = () => {
    setChannelName("");
  };

  return (
    <div>
      <button onClick={handleDownload} className="bg-blue-500 text-white p-2 rounded-md">Download</button>
      <button onClick={handleCancel} className="bg-red-500 text-white p-2 rounded-md">Cancel</button>
    </div>
  );
}
