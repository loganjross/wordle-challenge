import { useEffect } from "react";
import { MdOutlineBackspace } from "react-icons/md";

import { useGame } from "@/providers/GameProvider";

export function Keyboard({
  onLetter,
  onEnter,
  onBackspace,
}: {
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}) {
  useEffect(() => {
    function handleKeyPress({ key }: KeyboardEvent) {
      const isLetter = "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .includes(key.toLowerCase());
      if (isLetter) {
        onLetter(key);
      } else if (key === "Enter") {
        onEnter();
      } else if (key === "Backspace") {
        onBackspace();
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onLetter, onEnter, onBackspace]);

  return (
    <div className="flex flex-col items-center self-end mb-1">
      <div className="flex items-center justify-center">
        {"qwertyuiop".split("").map((letter: string) => (
          <Key key={letter} letter={letter} onClick={onLetter} />
        ))}
      </div>
      <div className="flex items-center justify-center">
        {"asdfghjkl".split("").map((letter: string) => (
          <Key key={letter} letter={letter} onClick={onLetter} />
        ))}
      </div>
      <div className="flex items-center justify-center">
        <button
          className="w-14 md:w-16 h-14 m-1 bg-gray-400 rounded-md font-semibold text-xs uppercase"
          onClick={onEnter}
        >
          Enter
        </button>
        {"zxcvbnm".split("").map((letter: string) => (
          <Key key={letter} letter={letter} onClick={onLetter} />
        ))}
        <button
          className="w-14 md:w-16 h-14 m-1 bg-gray-400 rounded-md text-xl md:text-2xl"
          onClick={onBackspace}
        >
          <MdOutlineBackspace
            style={{
              margin: "auto",
            }}
          />
        </button>
      </div>
    </div>
  );
}

function Key({
  letter,
  onClick,
}: {
  letter: string;
  onClick: (letter: string) => void;
}) {
  const {
    currentGame: { guesses },
  } = useGame();

  const hasBeenGuessed = guesses.some((guess) => guess.word.includes(letter));
  const isInWord = guesses.some((guess) =>
    guess.hints.find((h) => h.letter === letter)
  );
  const isCorrect = guesses.some(
    (guess) => guess.hints.find((h) => h.letter === letter)?.isCorrect
  );

  return (
    <button
      className={`w-8 md:w-11 h-14 m-0.5 md:m-1 rounded-md font-bold uppercase ${
        isCorrect
          ? "bg-green"
          : isInWord
          ? "bg-yellow"
          : `bg-gray-${hasBeenGuessed ? "600" : "400"}`
      }`}
      onClick={() => onClick(letter)}
    >
      {letter}
    </button>
  );
}
