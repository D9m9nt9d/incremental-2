import { useState } from 'react';
import './Leftside.css'
import { Currencies, formatCurrency, type CurrencyName } from '../scripts/currencies.ts';

function CurrencyRow(
  { name, stateName }: { name: CurrencyName, stateName: string },
) {
  const [state, setState] = useState(formatCurrency(Currencies[name].Value))
  Currencies[name].states[name + stateName] = setState
  
  return (
    <div >
      {name}: {state}
    </div>
  );
}

function CurrencyList(
  { name, currencies }: { name: string, currencies: CurrencyName[] }
) {
  const [hideRows, setHideRows] = useState(false)
  const rows: [any?] = [];

  if (!hideRows) {
    currencies.forEach(currencyName => {
      const currency = Currencies[currencyName]
      if (currency.Value == 0) return;

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
    <div id="left-side">
      {lists}
    </div>
  )
}

export default Leftside