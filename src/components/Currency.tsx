import { type CurrencyName, Currencies } from "../scripts/currencies.ts"

function Currency({ id, text }:
  { id: CurrencyName, text: string }
) {
  const currency = Currencies[id]

  return (
    <div className='flex flex-row items-center whitespace-pre-wrap'>
      { currency.Icon 
      ? <img className='h-[16px]' src={currency.Icon} alt={currency.DisplayName} /> 
      : `${currency.DisplayName}: ` }
      {text}
    </div>
  )
}

export default Currency