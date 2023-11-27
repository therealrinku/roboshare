import { useEffect, useState } from "react";

type MessageViewTypes = { message: string };

export default function Message({ message }: MessageViewTypes) {
  const [msg, setMsg] = useState(message);

  useEffect(() => {
    setMsg(message);
    setTimeout(() => setMsg(""), 3000);
  }, [msg]);

  if (!msg) return <></>;

  return (
    <div className="fixed flex flex-col text-sm h-10 min-w-[200px] px-3 text-md items-center justify-center bottom-5 bg-green-500 left-10 text-white">
      <span>{message}</span>
    </div>
  );
}
