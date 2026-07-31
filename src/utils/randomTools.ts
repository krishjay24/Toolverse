/**
 * Random & Fun tools utilities
 * All functions are typed, safe with invalid inputs, and crash-free
 */

// ============= COIN FLIP =============
export type CoinResult = 'Heads' | 'Tails';

export function flipCoin(): CoinResult {
  return Math.random() < 0.5 ? 'Heads' : 'Tails';
}

// ============= DICE ROLL =============
export function rollDice(count: 1 | 2): number[] {
  if (count !== 1 && count !== 2) count = 1;
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

// ============= RANDOM NUMBERS =============
export function generateRandomNumbers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean,
): number[] {
  min = Number(min) || 0;
  max = Number(max) || 100;
  count = Math.max(1, Math.min(100, Number(count) || 1));

  if (min > max) [min, max] = [max, min];

  if (!allowDuplicates) {
    const range = max - min + 1;
    if (count > range) count = range;
  }

  const numbers: number[] = [];
  const used = new Set<number>();

  while (numbers.length < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (allowDuplicates || !used.has(num)) {
      numbers.push(num);
      used.add(num);
    }
  }

  return numbers;
}

// ============= TEXT PARSING =============
export function parseLines(input: string): string[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// ============= YES/NO/MAYBE =============
export type YesNoMode = 'yes-no' | 'yes-no-maybe';

export function getYesNoMaybeAnswer(mode: YesNoMode): string {
  const answers = mode === 'yes-no' ? ['Yes', 'No'] : ['Yes', 'No', 'Maybe'];
  return answers[Math.floor(Math.random() * answers.length)];
}

// ============= RANDOM PICKER =============
export function pickRandomItem<T>(items: T[]): T | null {
  if (!items || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

// ============= ARRAY SHUFFLE =============
export function shuffleArray<T>(items: T[]): T[] {
  if (!items || items.length === 0) return [];
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ============= TEAM SPLITTER =============
export function splitIntoTeams(names: string[], teamCount: number): string[][] {
  if (!names || names.length === 0) return [];
  if (teamCount < 1) teamCount = 1;
  if (teamCount > names.length) teamCount = names.length;

  const shuffled = shuffleArray(names);
  const teams: string[][] = Array.from({ length: teamCount }, () => []);

  shuffled.forEach((name, index) => {
    teams[index % teamCount].push(name);
  });

  return teams;
}

// ============= DECISION MAKER =============
export type DecisionMode =
  | 'yes-no'
  | 'yes-no-maybe'
  | 'do-it-wait'
  | 'agree-disagree'
  | 'go-stop';

export function getDecisionAnswer(mode: DecisionMode): string {
  const decisions: Record<DecisionMode, string[]> = {
    'yes-no': ['Yes', 'No'],
    'yes-no-maybe': ['Yes', 'No', 'Maybe'],
    'do-it-wait': ['Do It', 'Wait'],
    'agree-disagree': ['Agree', 'Disagree'],
    'go-stop': ['Go', 'Stop'],
  };

  const options = decisions[mode] || decisions['yes-no'];
  return options[Math.floor(Math.random() * options.length)];
}

// ============= ROCK PAPER SCISSORS =============
export type RpsChoice = 'rock' | 'paper' | 'scissors';
export type RpsResult = 'win' | 'lose' | 'draw';

export interface RpsGameResult {
  userChoice: RpsChoice;
  appChoice: RpsChoice;
  result: RpsResult;
}

export function playRockPaperScissors(userChoice: RpsChoice): RpsGameResult {
  const choices: RpsChoice[] = ['rock', 'paper', 'scissors'];
  const appChoice = choices[Math.floor(Math.random() * 3)];

  let result: RpsResult;

  if (userChoice === appChoice) {
    result = 'draw';
  } else if (
    (userChoice === 'rock' && appChoice === 'scissors') ||
    (userChoice === 'scissors' && appChoice === 'paper') ||
    (userChoice === 'paper' && appChoice === 'rock')
  ) {
    result = 'win';
  } else {
    result = 'lose';
  }

  return { userChoice, appChoice, result };
}

// ============= GUESS THE NUMBER =============
export interface GuessGameState {
  secret: number;
  min: number;
  max: number;
  attempts: number;
  guesses: number[];
  isGameOver: boolean;
}

export function createGuessNumberGame(
  min: number = 1,
  max: number = 100,
): GuessGameState {
  min = Math.max(1, Number(min) || 1);
  max = Math.max(min + 1, Number(max) || 100);

  const secret = Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    secret,
    min,
    max,
    attempts: 0,
    guesses: [],
    isGameOver: false,
  };
}

export type GuessHint = 'low' | 'high' | 'correct';

export function checkGuess(
  secret: number,
  guess: number,
): GuessHint {
  guess = Number(guess) || 0;
  if (guess < secret) return 'low';
  if (guess > secret) return 'high';
  return 'correct';
}

// ============= UTILITY HELPERS =============
export function limitHistory<T>(items: T[], limit: number = 10): T[] {
  return items.slice(-limit);
}
