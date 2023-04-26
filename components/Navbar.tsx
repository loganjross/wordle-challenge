import { Bevan } from "next/font/google";
import { IoSettingsSharp } from "react-icons/io5";

import { useGame } from "@/providers/GameProvider";
import { useNotifications } from "@/providers/NotificationsProvider";
import { useModals } from "@/providers/ModalsProvider";

const bevan = Bevan({ subsets: ["latin"], weight: ["400"] });

export const NAV_HEIGHT_PX = 64;

export function Navbar() {
  const { newGame } = useGame();
  const { addNotification } = useNotifications();
  const { openModal } = useModals();

  return (
    <div
      className="absolute min-w-full flex items-center justify-between px-5 border-b border-gray-600 bg-black z-40"
      style={{
        height: NAV_HEIGHT_PX + "px",
      }}
    >
      <div className="w-1/3 flex items-center justify-start">
        <button
          className="py-1 px-3 bg-green rounded-md text-sm md:text-lg font-semibold"
          onClick={() => {
            newGame();
            addNotification("New game started");
          }}
        >
          New Game
        </button>
      </div>
      <div className="w-1/3 flex items-center justify-center opacity-0 md:opacity-100">
        <h1 className={`text-lg md:text-3xl text-center ${bevan.className}`}>
          Authenticle
        </h1>
      </div>
      <div className="w-1/3 flex items-center justify-end text-2xl md:text-3xl">
        <IoSettingsSharp
          className="cursor-pointer"
          onClick={() => openModal("settings")}
        />
      </div>
    </div>
  );
}
