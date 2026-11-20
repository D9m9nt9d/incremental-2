import { useState } from 'react';
import { Currencies, formatCurrency, type CurrencyName } from '../scripts/currencies.ts';
import Currency from './Currency.tsx';


function CurrencyRow(
  { name, stateName }: { name: CurrencyName, stateName: string },
) {
  const [state, setState] = useState(formatCurrency(Currencies[name].Value))

  const currency = Currencies[name]
  currency.states[name + stateName] = setState

  return (
    <Currency
      id={name}
      text={state} />
  );
}

function CurrencyList(
  { name, currencies }: { name: string, currencies: CurrencyName[] }
) {
  const [hideRows, setHideRows] = useState(false)
  const rows: [any?] = [];

  if (!hideRows) {
    currencies.forEach(currencyName => {
      // const currency = Currencies[currencyName]
      // if (currency.Value.equals(0)) return;

      rows.push(
        <CurrencyRow
          name={currencyName}
          stateName={'left'}
          key={currencyName}
        />
      );
    });
  };

  function onClick() {
    setHideRows(!hideRows)
  };

  return (
    <div>
      <button
        className="font-bold text-white bg-black px-2 py-1"
        onClick={onClick}
      >{name + (hideRows ? ' (Hidden)' : '')}
      </button>
      {rows}
    </div>
  )
}

function Leftside() {
  const Dropdowns: any = {}

  for (const currency in Currencies) {
    const key = currency as CurrencyName;
    const info = Currencies[key];

    const dropdown: string[] = Dropdowns[info.Category] || [];
    dropdown.push(key);
    Dropdowns[info.Category] = dropdown;
  }

  const lists = []

  for (const name in Dropdowns) {
    lists.push(<CurrencyList
      currencies={Dropdowns[name]}
      name={name}
      key={name}
    />)
  }

  return (
    <div className="min-w-[120px]">
      {lists}
    </div>
  )
}

export default Leftside