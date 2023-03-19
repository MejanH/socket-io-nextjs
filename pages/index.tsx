import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const URL = "http://localhost:8000";
export const socket = io(URL);

export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatEvent, setChatEvent] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatEvent(value: any) {
      setChatEvent((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat", onChatEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat", onChatEvent);
    };
  }, []);
  console.log("connection ", isConnected);
  console.log("chat ", chatEvent);

  function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);
    const data = {
      message: value,
      room: "room1",
    };

    socket.emit("chat", data, () => {
      setIsLoading(false);
    });
    setValue("");
  }

  return (
    <>
      <Head>
        <title>Socket.io with Nextjs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto my-10">
        <h1 className="text-3xl font-bold underline text-center">Lets Chat</h1>
        <form
          onSubmit={onSubmit}
          className="my-10 flex flex-col space-y-5 items-center justify-center"
        >
          <textarea
            className="border"
            rows={5}
            cols={50}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button className="bg-indigo-600 text-white px-4 py-2" type="submit">
            Submit
          </button>
        </form>

        {chatEvent.map((msg, i) => (
          <div key={i}>
            <div className="text-2xl">{msg}</div>
          </div>
        ))}
      </main>
    </>
  );
}
