import Decimal from 'decimal.js';
import moneyIcon from '/src/assets/images/money.svg'
import crystalsIcon from '/src/assets/images/crystal.svg'

// Types

interface CurrencyItem {
  Value: Decimal.Instance
  Base: Decimal.Instance
  Multis: Decimal.Instance
  Per: Decimal.Instance
  ActiveMultis: {
    [key: string]: Decimal.Value
  }
  ParticleColor: string
  Category: string
  Icon: string
  states: {
    [key: string]: (param: any) => void
  }
  className: string
};

type CurrencyName = keyof typeof Currencies;

const Currencies = {
  'Money': createCurrency('Basic', moneyIcon, "#529b5d",
    'text-green-600 font-medium font-[Comic+Neue]', Decimal(0)
  ),
  'Crystals': createCurrency('Basic', crystalsIcon, "#9261ce",
    'text-purple-600 font-medium font-[Jost]', Decimal(0)
  ),
} satisfies Record<string, CurrencyItem>;

function createCurrency(category: string, icon: string, particleColor: string, className: string, value: Decimal.Instance): CurrencyItem {
  return {
    Value: value,
    Per: Decimal(0),
    Base: Decimal(0),
    Multis: Decimal(1),
    ActiveMultis: {},
    ParticleColor: particleColor,
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

function addCurrency(name: CurrencyName, amount?: Decimal.Instance) {
  const currency = Currencies[name];
  amount = amount || currency.Per
  const activeMultis = currency.ActiveMultis;
  for (const key in activeMultis) {
    amount = amount.times(activeMultis[key]);
  };
  setCurrency(name, currency.Value.plus(amount));
}

function addBase(name: CurrencyName, amount: Decimal.Value) {
  const currency = Currencies[name];
  currency.Base = currency.Base.plus(amount)
  currency.Per = currency.Base.times(currency.Multis)
}

function addMulti(name: CurrencyName, amount: Decimal.Value) {
  const currency = Currencies[name];
  currency.Multis = currency.Multis.times(amount)
  currency.Per = currency.Base.times(currency.Multis)
}

function changeMulti(name: CurrencyName, key: string, amount: Decimal.Value) {
  Currencies[name].ActiveMultis[key] = amount
}

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Vg'];

function formatCurrency(value: Decimal.Value, places = 2): string {
  const n = Decimal(value)
  let abs = n.abs();
  let tier = 0;

  while (abs.gte(1000) && tier < SUFFIXES.length - 1) {
    abs = abs.div(1000);
    tier++;
  }

  if (tier == 0) return n.toDecimalPlaces(5).toString()

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

// setInterval(() => {
//   setCurrency('Money', Decimal(Math.random()*50_000_000_000_000_000_000_000_000_000))
// }, 3000);

export {
  Currencies, setCurrency, addCurrency,
  addBase, addMulti, changeMulti,
  formatCurrency,
  type CurrencyName
}