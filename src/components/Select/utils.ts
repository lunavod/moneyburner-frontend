import { SelectVariant } from '../../utils/form'

export function makeVariantsFromArray(
  raw: [string, string][],
): SelectVariant[] {
  return raw.map((r) => ({ name: r[0], code: r[1] }))
}

export function makeVariantsFromObject(
  raw: Record<string, string>,
): SelectVariant[] {
  return Object.entries(raw).map((r) => ({ name: r[1], code: r[0] }))
}

export function makeVariants(
  raw: Record<string, string> | [string, string][],
): SelectVariant[] {
  if (Array.isArray(raw)) return makeVariantsFromArray(raw)
  else return makeVariantsFromObject(raw)
}
