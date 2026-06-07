import { z } from 'zod';

export const qrContentSchema = z
  .string()
  .trim()
  .min(1, 'Enter text or a URL to generate a QR code.')
  .max(2000, 'Content is too long for a QR code.');

export const ageCalculatorSchema = z.object({
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.')
    .refine((value) => {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }, 'Enter a valid date.')
    .refine((value) => {
      const date = new Date(value);
      return date <= new Date();
    }, 'Date of birth cannot be in the future.'),
});

export const emiCalculatorSchema = z.object({
  loanAmount: z
    .string()
    .min(1, 'Loan amount is required.')
    .refine((value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num > 0;
    }, 'Enter a valid loan amount.'),
  interestRate: z
    .string()
    .min(1, 'Interest rate is required.')
    .refine((value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0 && num <= 100;
    }, 'Enter a rate between 0 and 100.'),
  tenure: z
    .string()
    .min(1, 'Tenure is required.')
    .refine((value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num > 0;
    }, 'Enter a valid tenure.'),
});

export type AgeCalculatorForm = z.infer<typeof ageCalculatorSchema>;
export type EmiCalculatorForm = z.infer<typeof emiCalculatorSchema>;
