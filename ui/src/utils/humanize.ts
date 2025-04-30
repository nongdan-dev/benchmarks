import bytes from 'bytes'
import numbro from 'numbro'
import prettyMs from 'pretty-ms'

export const hNumber = (v: number) =>
  numbro(v).format({
    average: true,
    mantissa: 1,
    optionalMantissa: false,
  })

export const hBytes = (v: number) => bytes(v) as string
export const hBytesYAxis = (v: number) =>
  bytes(v, {
    decimalPlaces: 0,
    thousandsSeparator: ' ',
    unit: 'MB',
  }) as string

export const hNanosecond = (v: number) => {
  if (v === 0) {
    return '0'
  }
  if (v < 1000) {
    return `${v}ns`
  }
  return prettyMs(v / 1000)
}

export const hPercentage = (v: number) => `${v}%`
