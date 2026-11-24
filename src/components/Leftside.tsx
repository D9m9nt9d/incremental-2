import { useState } from 'react';
import { Currencies, formatCurrency, setCurrency, type CurrencyName } from '../scripts/currencies.ts';
import Currency from './Currency.tsx';
import Decimal from 'decimal.js';


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
    <div className="w-50 fixed left-0 top-0 z-5">
      {lists}
      <TestingMode />
    </div>
  )
}

export default Leftside



function TestingMode() {
  const [currencyName, setCurrencyName] = useState<CurrencyName>('Money')
  const [amount, setAmount] = useState<number|string>(0.6)

  return (
    <div className="ml-1 mt-4 flex flex-col gap-2">
      <p className='text-center font-medium leading-2'>Testing menu</p>
      <select
        className="border-2 border-gray-400 bg-gray-200 px-2 py-1"
        value={currencyName}
        onChange={e => setCurrencyName(e.target.value as CurrencyName)}
      >
        {Object.keys(Currencies).map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <input
        className="border-2 border-gray-400 bg-gray-200 px-2 py-1"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button
        className="cursor-pointer bg-gray-300 px-2 py-1"
        onClick={() => setCurrency(currencyName, Decimal(amount))}>
        Set
      </button>
      <button
        className="cursor-pointer bg-gray-300 px-2 py-1"
        onClick={() => 
          setCurrency(currencyName, Currencies[currencyName].Value.plus(amount))}>
        Add
      </button>
      <button
        className="cursor-pointer bg-gray-300 px-2 py-1"
        onClick={() => 
          setCurrency(currencyName, Currencies[currencyName].Value.minus(amount))}>
        Remove
      </button>

      <button
        className="cursor-pointer bg-gray-300 px-2 py-1"
        onClick={() => {
          localStorage.clear()
          location.reload()
        }}>
        Clear local storage
      </button>
    </div>
  )
}