import Decimal from 'decimal.js';

// Types

interface CurrencyItem {
  Value: Decimal.Value;
  Base: Decimal.Value;
  Multis: Decimal.Value;
  Category: string;
  setState?: any;
  states: {
    [key: string]: (param: any) => void;
  };
};

type CurrencyName = keyof typeof Currencies;

const Currencies = {
  'Money': createCurrency(1602, 'Basic'),
  'Gems': createCurrency(23, 'Basic'),
  'Crystals': createCurrency(23, 'Secondary'),
} satisfies Record<string, CurrencyItem>;

function createCurrency(value: Decimal.Value, category: string): CurrencyItem {
  return {
    Value: value,
    Base: Decimal(1),
    Multis: Decimal(1),
    Category: category,
    states: {},
  };
};

// Functions

function setCurrency(name: CurrencyName, value: Decimal.Value) {
  const currency = Currencies[name];
  currency.Value = value;
  Object.values(currency.states).forEach(setState => {
    setState(formatCurrency(value))
  });
};

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Vg'];

function formatCurrency(value: Decimal.Value, places = 2): string {
  const n = new Decimal(value);
  let abs = n.abs();
  let tier = 0;

  while (abs.gte(1000) && tier < SUFFIXES.length - 1) {
    abs = abs.div(1000);
    tier++;
  }

  let rounded = abs.toDecimalPlaces(places, Decimal.ROUND_HALF_UP);

  // if rounds 999.999K to 1000.00K
  if (rounded.gte(1000) && tier < SUFFIXES.length - 1) {
    rounded = rounded.div(1000).toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
    tier++;
  }

  const sign = n.isNegative() && !rounded.isZero() ? '-' : '';
  return sign + rounded.toFixed(places) + SUFFIXES[tier];
}

// Testing

// setInterval(() => {
//   console.log(Currencies.Money.states)
// }, 500);

setInterval(() => {
  setCurrency('Money', Decimal(Math.random()*50_000_000_000_000_000_000_000_000_000))
}, 3000);

export {
  Currencies, setCurrency,
  formatCurrency,
  type CurrencyName
}