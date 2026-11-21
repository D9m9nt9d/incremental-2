import { type CurrencyName, Currencies } from "../scripts/currencies.ts"

function Currency({ id, text }:
  { id: CurrencyName, text: string }
) {
  const currency = Currencies[id]

  return (
    <div className='flex flex-row items-center whitespace-pre-wrap'>
      { currency.Icon 
      ? <img className='h-[20px]' src={currency.Icon} alt={id+':'} /> 
      : `${id}: ` }
      <span className={currency.className}>{text}</span>
    </div>
  )
}

export default Currency