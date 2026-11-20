import Decimal from 'decimal.js';

// Types

interface CurrencyItem {
  Value: Decimal.Instance;
  Base: Decimal.Instance;
  Multis: Decimal.Instance;
  Category: string;
  Icon: string,
  states: {
    [key: string]: (param: any) => void;
  };
  className: string,
};

type CurrencyName = keyof typeof Currencies;

const Currencies = {
  'Money':    createCurrency('Basic',
    'src/assets/money.svg',
    'text-green-700 font-[cursive]',
    Decimal(0)
  ),
  'Gems':     createCurrency('Basic',     '', '', Decimal(23)),
  'Crystals': createCurrency('Secondary', '', '', Decimal(64)),
} satisfies Record<string, CurrencyItem>;

function createCurrency(category: string, icon: string, className: string, value: Decimal.Instance): CurrencyItem {
  return {
    Value: value,
    Base: Decimal(0),
    Multis: Decimal(1),
    Category: category,
    Icon: icon,
    className: className,
    states: {},
  };
};

// Functions

function setCurrency(name: CurrencyName, value: Decimal.Instance) {
  const currency = Currencies[name];
  currency.Value = value;
  Object.values(currency.states).forEach(setState => {
    setState(formatCurrency(value))
  });
};

function addCurrency(name: CurrencyName) {
  const currency = Currencies[name];
  const newValue = currency.Value.plus(currency.Base.times(currency.Multis))
  setCurrency(name, newValue)
}

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Vg'];

function formatCurrency(value: Decimal.Instance, places = 2): string {
  let abs = value.abs();
  let tier = 0;

  while (abs.gte(1000) && tier < SUFFIXES.length - 1) {
    abs = abs.div(1000);
    tier++;
  }

  if (tier==0) return value.toDecimalPlaces(5).toString()

  let rounded = abs.toDecimalPlaces(places, Decimal.ROUND_HALF_UP);

  // if rounds 999.999K to 1000.00K
  if (rounded.gte(1000) && tier < SUFFIXES.length - 1) {
    rounded = rounded.div(1000).toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
    tier++;
  }

  const sign = value.isNegative() && !rounded.isZero() ? '-' : '';
  return sign + rounded.toFixed(places) + SUFFIXES[tier];
}

// Testing

// setInterval(() => {
//   console.log(Currencies.Money.states)
// }, 500);

// setInterval(() => {
//   setCurrency('Money', Decimal(Math.random()*50_000_000_000_000_000_000_000_000_000))
// }, 3000);

export {
  Currencies, setCurrency, addCurrency,
  formatCurrency,
  type CurrencyName
}