import { useEffect, useRef, useState } from "react";

import { Guess, useGame } from "@/providers/GameProvider";
import { ANIMATION_DURATION_MS } from "@/pages";

export function Guess({
  guess,
  isCurrentGuess,
  className,
}: {
  guess: Guess;
  isCurrentGuess: boolean;
  className?: string;
}) {
  const {
    currentGame: { word },
    settings: { wordLength },
  } = useGame();
  const wasCurrentGuess = useRef(isCurrentGuess);
  const [wasGuessMade, setWasGuessMade] = useState(false);
  const [areAnimationsEnabled, setAreAnimationsEnabled] = useState(false);

  // Reset on word change
  useEffect(() => {
    setAreAnimationsEnabled(false);
    setWasGuessMade(false);
    wasCurrentGuess.current = isCurrentGuess;
  }, [word]);

  // Animate on making guess
  useEffect(() => {
    if (!isCurrentGuess && wasCurrentGuess.current) {
      setAreAnimationsEnabled(true);
      setWasGuessMade(true);
    }
    wasCurrentGuess.current = isCurrentGuess;
  }, [isCurrentGuess]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {Array.from({ length: word ? word.length : wordLength }).map((_, i) => {
        const letter = guess.word[i];
        const hints = guess.hints.filter((hint) => hint.letter === letter);
        const hintIndex = hints.findIndex((hint) => hint.position === i);

        const borderClassName = isCurrentGuess
          ? `border-gray-${letter ? "400" : "600"}`
          : hints[hintIndex]?.isCorrect
          ? "border-green"
          : !!hints[hintIndex]
          ? "border-yellow"
          : "border-gray-600";

        const backgroundClassName = hints[hintIndex]?.isCorrect
          ? "bg-green"
          : !!hints[hintIndex]
          ? "bg-yellow"
          : "bg-gray-600";

        const transitionDelay = wasGuessMade
          ? `${i * ANIMATION_DURATION_MS}ms`
          : "unset";

        return (
          <div
            key={i}
            className={`relative w-9 md:w-14 h-9 md:h-14 m-0.5 md:m-1 ${
              wasGuessMade ? "flip" : !!letter ? "pump" : ""
            }`}
            style={{
              animationDelay: transitionDelay,
            }}
          >
            <div
              className={`absolute inverted flex items-center justify-center w-full h-full uppercase text-3xl font-bold border-2 ${
                areAnimationsEnabled ? "transition-all" : ""
              } ${borderClassName} ${backgroundClassName} opacity-${
                wasGuessMade ? "100" : "0"
              }`}
              style={{
                transitionDelay,
              }}
            >
              {letter}
            </div>
            <div
              className={`absolute flex items-center justify-center w-full h-full uppercase text-3xl font-bold border-2 ${
                areAnimationsEnabled ? "transition-all" : ""
              } bg-black border-gray-${letter ? "400" : "600"} opacity-${
                wasGuessMade ? "0" : "100"
              }`}
              style={{
                transitionDelay,
              }}
            >
              {letter}
            </div>
          </div>
        );
      })}
    </div>
  );
}
