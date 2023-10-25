
export const noop = () => undefined;

export const transactionExample = {
  id: 47245,
  date: '2020-10-05',
  transaction_details: 'CleanCircuit Electrical Check',
  amount: -41.05,
  type: 'Debit',
  category1: 'MAINTENANCE',
  category2: 'HOME/SOCIETY MAINTENANCE',
  channel: 'SWIFTTransfer',
  source: 'Account',
  city: 'Huntersville',
  carbon: 45.23,
};

export type Theme = {
  name: string;
  logofilename: string;
  colorOne:string;
  colorTwo:string;
  locale:string;
  currency:string;
};

export function getTheme(): Theme {

  let defaultTheme: Theme = { name: "default", logofilename: "logoXebia.png", colorOne: "#691d5d", colorTwo: "#691d5d", locale: 'en-US', currency: 'USD'}
  let capital1Theme: Theme = { name: "capone", logofilename: "CapitalOneLogo.png", colorOne: "#004879", colorTwo: "#D22E1E", locale: 'en-US', currency: 'USD'}
  let irelandTheme: Theme = { name: "ireland", logofilename: "logo_bank_ireland.png", colorOne: "#0703f5", colorTwo: "#888888", locale: 'en-GB', currency: 'GBP'}
  const themes: Map<string, Theme> = new Map([
    ["", defaultTheme],
    ["capone", capital1Theme],
    ["ireland", irelandTheme],
  ]);

  let chosenTheme: string = localStorage.getItem("theme") || ""
  let maybeTheme: Theme = themes.get(chosenTheme);
  return maybeTheme ?? defaultTheme
}