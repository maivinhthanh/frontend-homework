
export const numberFormatter = (value: number | undefined) =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const numberParser = (value: string | undefined) =>
  +value!.replace(/\s?|(,*)/g, '');