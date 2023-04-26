import { useEffect, useState } from "react";
import { Libre_Franklin } from "next/font/google";

import { useGame } from "@/providers/GameProvider";
import { useNotifications } from "@/providers/NotificationsProvider";
import { Guess } from "@/components/Guess";
import { Keyboard } from "@/components/Keyboard";
import { NAV_HEIGHT_PX } from "@/components/Navbar";

const franklin = Libre_Franklin({ subsets: ["latin"] });

export const ANIMATION_DURATION_MS = 500;

export default function Home() {
  const {
    isInit,
    status: { isGameOver, isGameWon },
    settings: { isHardMode, wordLength },
    allWords,
    currentGame: { word, guesses },
    makeGuess,
  } = useGame();
  const { addNotification } = useNotifications();
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [isInvalidGuess, setIsInvalidGuess] = useState<boolean>(false);
  const [isGuessingDisabled, setIsGuessingDisabled] = useState<boolean>(false);

  // Disable if not init
  useEffect(() => setIsGuessingDisabled(!isInit), [isInit]);

  // Reset current guess on new game
  useEffect(() => setCurrentGuess(""), [word]);

  // Inform user when game is over
  useEffect(() => {
    if (isGameOver) {
      addNotification(isGameWon ? "🎉 Correct! 🎉" : word.toUpperCase());
    }
  }, [isGameOver, isGameWon]);

  // Validate guess and either notify user or make guess
  function onGuess() {
    if (isGameOver || isGuessingDisabled) return;

    let invalidNotification = "";
    if (isHardMode) {
      const allHints = [];
      for (const guess of guesses) {
        allHints.push(...guess.hints);
      }

      const guessLetters = currentGuess.split("");
      for (const hint of allHints) {
        if (!guessLetters.includes(hint.letter)) {
          invalidNotification = "Must use all previous letter hints";
        }
        if (hint.isCorrect && guessLetters[hint.position] !== hint.letter) {
          invalidNotification = "Must keep correct letters the same";
        }
      }
    }

    // Check that guess is valid
    if (!allWords.includes(currentGuess))
      invalidNotification = "Not in word list";
    if (currentGuess.length !== wordLength)
      invalidNotification = "Not enough letters";

    // Notify or make guess
    if (invalidNotification) {
      addNotification(invalidNotification);
      setIsInvalidGuess(true);
      setTimeout(() => setIsInvalidGuess(false), ANIMATION_DURATION_MS);
    } else {
      makeGuess(currentGuess);
      setCurrentGuess("");
      setIsGuessingDisabled(true);
      setTimeout(
        () => setIsGuessingDisabled(false),
        wordLength * ANIMATION_DURATION_MS
      );
    }
  }

  return (
    <main className={`flex flex-col items-center ${franklin.className}`}>
      <div
        className="grid h-full md:h-screen"
        style={{ paddingTop: NAV_HEIGHT_PX + "px" }}
      >
        <div className="flex flex-col items-center justify-center self-center my-2">
          {Array.from({ length: wordLength + 1 }).map((_, i) => {
            const isCurrentGuess = i === guesses.length;
            return (
              <Guess
                key={i}
                className={isCurrentGuess && isInvalidGuess ? "shake" : ""}
                guess={
                  isCurrentGuess
                    ? { word: currentGuess, hints: [] }
                    : guesses[i] || {
                        word: "",
                        hints: [],
                      }
                }
                isCurrentGuess={isCurrentGuess}
              />
            );
          })}
        </div>
        <Keyboard
          onLetter={(letter) => {
            if (
              isGameOver ||
              isGuessingDisabled ||
              currentGuess.length === wordLength
            )
              return;
            setCurrentGuess((currentGuess) => currentGuess + letter);
          }}
          onEnter={onGuess}
          onBackspace={() => {
            if (isGameOver || isGuessingDisabled) return;
            setCurrentGuess((currentGuess) => currentGuess.slice(0, -1));
          }}
        />
      </div>
    </main>
  );
}
