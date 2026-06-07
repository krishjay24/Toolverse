export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayDays: number;
  nextBirthdayDate: Date;
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculateAge(dateOfBirth: Date, referenceDate: Date = new Date()): AgeResult {
  const dob = new Date(dateOfBirth);
  dob.setHours(0, 0, 0, 0);
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  let years = ref.getFullYear() - dob.getFullYear();
  let months = ref.getMonth() - dob.getMonth();
  let days = ref.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor(
    (ref.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24),
  );

  let nextBirthday = new Date(ref.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday <= ref) {
    nextBirthday = new Date(ref.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }

  const nextBirthdayDays = Math.ceil(
    (nextBirthday.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    years,
    months,
    days,
    totalDays,
    nextBirthdayDays,
    nextBirthdayDate: nextBirthday,
  };
}

export function calculateEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
): EmiResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
  }

  const monthlyRate = annualInterestRate / 12 / 100;

  if (monthlyRate === 0) {
    const monthlyEmi = principal / tenureMonths;
    return {
      monthlyEmi,
      totalInterest: 0,
      totalPayment: principal,
    };
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayment = monthlyEmi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}

export type CompressionQuality = 'low' | 'medium' | 'high';

export function getCompressionValue(quality: CompressionQuality): number {
  switch (quality) {
    case 'low':
      return 0.3;
    case 'medium':
      return 0.6;
    case 'high':
      return 0.85;
  }
}

export interface GstResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export function calculateGstInclusive(amount: number, rate: number): GstResult {
  const baseAmount = amount / (1 + rate / 100);
  const gstAmount = amount - baseAmount;
  return { baseAmount, gstAmount, totalAmount: amount };
}

export function calculateGstExclusive(amount: number, rate: number): GstResult {
  const gstAmount = amount * (rate / 100);
  return { baseAmount: amount, gstAmount, totalAmount: amount + gstAmount };
}

export interface BmiResult {
  bmi: number;
  category: string;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

export type PercentageMode = 'of' | 'isWhatPercent' | 'increase' | 'decrease';

export function calculatePercentage(
  mode: PercentageMode,
  valueA: number,
  valueB: number,
): number {
  switch (mode) {
    case 'of':
      return (valueA / 100) * valueB;
    case 'isWhatPercent':
      return valueB === 0 ? 0 : (valueA / valueB) * 100;
    case 'increase':
      return valueA + (valueA * valueB) / 100;
    case 'decrease':
      return valueA - (valueA * valueB) / 100;
  }
}

const PASSWORD_CHARS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}',
};

export function generatePassword(
  length: number,
  options: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean },
): string {
  let pool = '';
  if (options.lower) pool += PASSWORD_CHARS.lower;
  if (options.upper) pool += PASSWORD_CHARS.upper;
  if (options.numbers) pool += PASSWORD_CHARS.numbers;
  if (options.symbols) pool += PASSWORD_CHARS.symbols;
  if (!pool) pool = PASSWORD_CHARS.lower;

  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += pool.charAt(Math.floor(Math.random() * pool.length));
  }
  return password;
}

export type LengthUnit = 'm' | 'km' | 'cm' | 'ft' | 'mile';
export type TempUnit = 'c' | 'f' | 'k';
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';

const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  ft: 0.3048,
  mile: 1609.344,
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const meters = value * LENGTH_TO_METERS[from];
  return meters / LENGTH_TO_METERS[to];
}

const WEIGHT_TO_GRAMS: Record<WeightUnit, number> = {
  kg: 1000,
  g: 1,
  lb: 453.592,
  oz: 28.3495,
};

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  const grams = value * WEIGHT_TO_GRAMS[from];
  return grams / WEIGHT_TO_GRAMS[to];
}

export function convertTemperature(value: number, from: TempUnit, to: TempUnit): number {
  let celsius = value;
  if (from === 'f') celsius = ((value - 32) * 5) / 9;
  if (from === 'k') celsius = value - 273.15;
  if (to === 'c') return celsius;
  if (to === 'f') return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter((block) => block.trim().length > 0).length
    : 0;
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: text.length === 0 ? 0 : text.split('\n').length,
    sentences: trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g)?.length ?? 1) : 0,
    paragraphs,
  };
}
