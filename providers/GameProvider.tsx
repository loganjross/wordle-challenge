import { createContext, useContext, useState, useEffect } from "react";

type WordLength = 5 | 6 | 7 | 8;
const DEFAULT_WORD_LENGTH: WordLength = 5;
export const MIN_WORD_LENGTH: WordLength = 5;
export const MAX_WORD_LENGTH: WordLength = 8;

interface GameSettings {
  wordLength: WordLength;
  isHardMode: boolean;
}

export interface Guess {
  word: string;
  hints: {
    letter: string;
    position: number;
    isCorrect: boolean;
  }[];
}

const GameContext = createContext<{
  isInit: boolean;
  status: {
    isGameOver: boolean;
    isGameWon: boolean;
  };
  allWords: string[];
  currentGame: {
    word: string;
    guesses: Guess[];
  };
  newGame: () => void;
  makeGuess: (guessWord: string) => void;
  settings: GameSettings;
  updateSetting: (setting: keyof GameSettings, value: any) => void;
}>({
  isInit: false,
  status: {
    isGameOver: false,
    isGameWon: false,
  },
  allWords: [],
  currentGame: {
    word: "",
    guesses: [],
  },
  newGame: () => {},
  makeGuess: () => {},
  settings: {
    wordLength: 5,
    isHardMode: false,
  },
  updateSetting: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState({
    isGameOver: false,
    isGameWon: false,
  });
  const [allWords, setAllWords] = useState<string[]>([]);
  const [word, setWord] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    wordLength: DEFAULT_WORD_LENGTH,
    isHardMode: false,
  });
  const [isInit, setIsInit] = useState(false);

  // Use preferences and cache on init
  useEffect(() => {
    const preferredSettings = JSON.parse(
      localStorage.getItem("wordle-settings") || "{}"
    );
    setSettings({
      wordLength: preferredSettings.wordLength || DEFAULT_WORD_LENGTH,
      isHardMode: preferredSettings.isHardMode || false,
    });

    const cachedAllWords = JSON.parse(
      localStorage.getItem("wordle-all-words") || "[]"
    );
    setAllWords(cachedAllWords);
  }, []);

  // Save preferences on update
  useEffect(() => {
    if (!isInit) return;
    localStorage.setItem("wordle-settings", JSON.stringify(settings));
  }, [settings]);

  // Fetch and filter all words on mount
  useEffect(() => {
    async function getAllWords(): Promise<string[]> {
      const res = await fetch("https://random-word-api.herokuapp.com/all");
      const words = await res.json();

      // Filter plurals (sorta) and words that are too long / too short
      const irregularPlurals = [
        "children",
        "geese",
        "teeth",
        "sheep",
        "people",
        "criteria",
        "cacti",
        "fungi",
      ];
      const filteredWords = words.filter((word: string) => {
        const isPlural = word.slice(-1) === "s" && word.slice(-2) !== "ss";
        const isTooLong = word.length > 8;
        const isTooShort = word.length < 5;
        const isIrregularPlural = irregularPlurals.includes(word);

        return !isPlural && !isTooLong && !isTooShort && !isIrregularPlural;
      });

      return filteredWords;
    }

    if (!allWords.length) getAllWords().then(setAllWords);
  }, []);

  // Set initial game state
  useEffect(() => {
    if (!allWords.length) return;
    setWord(findWord(allWords));
    setIsInit(true);
  }, [allWords]);

  // Check game status on guess
  useEffect(() => {
    if (!guesses.length) return;

    const isGameWon = guesses[guesses.length - 1].word === word;
    const isGameOver = isGameWon || guesses.length === settings.wordLength + 1;
    setStatus({ isGameOver, isGameWon });
  }, [guesses, word, settings.wordLength]);

  // Restart game on settings change
  useEffect(newGame, [settings]);

  // Find random word that matches word length
  function findWord(allWords: string[]) {
    const filteredWords = allWords.filter(
      (word) => word.length === settings.wordLength
    );
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const randomWord = filteredWords[randomIndex];
    return randomWord;
  }

  // Start a new game
  function newGame() {
    setWord(findWord(allWords));
    setGuesses([]);
    setStatus({
      isGameOver: false,
      isGameWon: false,
    });
  }

  // Make a guess and track any hints
  function makeGuess(guessWord: string) {
    const hints: Guess["hints"] = [];

    const guessLetters = guessWord.split("");
    const hintLetters = word
      .split("")
      .filter((letter) => guessLetters.includes(letter));
    for (const letter of hintLetters) {
      let position = 0;
      const isInHints = hints.some((hint) => hint.letter === letter);
      if (!isInHints) {
        position = guessLetters.indexOf(letter);
      } else {
        position = guessLetters.indexOf(letter, position + 1);
      }

      hints.push({
        letter,
        position,
        isCorrect: letter === word[position],
      });
    }

    setGuesses((prevGuesses) => [
      ...prevGuesses,
      {
        word: guessWord,
        hints,
      },
    ]);
  }

  // Update a setting's value
  function updateSetting(setting: keyof GameSettings, value: any) {
    setSettings((prevSettings) => ({ ...prevSettings, [setting]: value }));
  }

  return (
    <GameContext.Provider
      value={{
        isInit,
        status,
        allWords,
        currentGame: {
          word,
          guesses,
        },
        newGame,
        makeGuess,
        settings,
        updateSetting,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error("useGame must be used within a GameProvider");

  return context;
}
