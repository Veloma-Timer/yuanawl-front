export interface IOption {
  label: string;
  value?: number | string;
  id: number | string;
}

export type IOptions = IOption[];

export interface IDigitBoard {
  current: number | string;
  yesterday: number | string;
  year: number | string;
}
