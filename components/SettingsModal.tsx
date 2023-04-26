import { IoCloseSharp } from "react-icons/io5";

import {
  MAX_WORD_LENGTH,
  MIN_WORD_LENGTH,
  useGame,
} from "@/providers/GameProvider";
import { useModals } from "@/providers/ModalsProvider";
import { Toggle } from "./Toggle";

export function SettingsModal() {
  const {
    updateSetting,
    settings: { isHardMode, wordLength },
  } = useGame();
  const { currentOpenModals, closeModal } = useModals();
  const isModalOpen = currentOpenModals.includes("settings");

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center transition bg-modal opacity-${
        isModalOpen ? 100 : 0
      }`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: isModalOpen ? 100 : -100,
      }}
    >
      <div
        className={`relative w-full max-w-lg flex flex-col items-center justify-center p-4 rounded-md bg-black transition-all duration-300 opacity-${
          isModalOpen ? 100 : 0
        } ${isModalOpen ? "" : "mt-20"}`}
      >
        <IoCloseSharp
          className="absolute top-4 right-4 text-2xl cursor-pointer"
          onClick={() => closeModal("settings")}
        />
        <h1 className="uppercase font-bold">Settings</h1>
        <div className="w-full flex items-center justify-between mt-6">
          <div className="flex flex-col">
            <p>Hard Mode</p>
            <p className="text-xs opacity-60">
              Any revealed hints must be used in subsequent guesses
            </p>
          </div>
          <Toggle
            isToggled={isHardMode}
            onToggle={(isToggled) => updateSetting("isHardMode", isToggled)}
          />
        </div>
        <div className="w-full h-px bg-gray-600 mt-3" />
        <div className="w-full flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <p>Word Length</p>
            <p className="text-xs opacity-60">
              You'll get the length of your word + 1 guesses
            </p>
          </div>
          <div className="flex items-end">
            {Array.from({ length: MAX_WORD_LENGTH - MIN_WORD_LENGTH + 1 }).map(
              (_, i) => (
                <button
                  key={i}
                  className={`w-7 h-7 flex items-center justify-center rounded-md mx-1 transition-all ${
                    wordLength === i + MIN_WORD_LENGTH
                      ? "bg-green text-white"
                      : "bg-gray-400 text-black"
                  }`}
                  onClick={() => {
                    updateSetting("wordLength", i + MIN_WORD_LENGTH);
                  }}
                >
                  {i + MIN_WORD_LENGTH}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
