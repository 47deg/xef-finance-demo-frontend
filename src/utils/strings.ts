import {Theme} from '@/utils/constants.ts';

export const toSnakeCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('_') ?? str;

export const toSpaceCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join(' ') ?? str;

export const toCapitalizedSpaceCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1).toLowerCase()}`)
    .join(' ') ?? str;

export function dateNicely(date_Object: Date): string {
    return date_Object.getFullYear() + "/" + (date_Object.getMonth() + 1) + "/" + +date_Object.getDate();
}

export function formatCurrency(number, theme: Theme) {
    // Check if the input is a valid number
    let newNumber = (typeof number !== 'number' || isNaN(number))? +number :  number;

    if (typeof newNumber !== 'number' || isNaN(newNumber)) {
        return 'Invalid Input';
    }

    // Convert the number to a string with dollar symbol
    const formattedCurrency = newNumber.toLocaleString(theme.locale, {
        style: 'currency',
        currency: theme.currency,
    });

    return formattedCurrency;
}
