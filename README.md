# Wordle challenge

This is a (mostly) identical replica of the core [Wordle](https://www.nytimes.com/games/wordle/index.html) game.

View live [here](https://wordle-challenge-eight.vercel.app/)

## Installation

Clone the repo, install dependencies and run the development server

```sh
git clone https://github.com/loganjross/wordle-challenge

npm install && npm run dev
```

Once the development server is running, open your browser to `https://localhost:3000`

## Tradeoffs while building

I only hit one notable tradeoff during the challenge (other than being on a tight timeframe) in that I couldn't find a free API for fetching either a random english word or an array of words for a given length that could also filter plurals. I also couldn't just use the wordle dictionary because that only includes 5 letter words. As a workaround, I was able to fetch a massive array of words via a free [API](https://random-word-api.herokuapp.com/all) and then filter through those based on word length and if I could reasonably _guess_ whether they were plurals.
