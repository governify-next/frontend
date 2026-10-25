export interface Option<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}
