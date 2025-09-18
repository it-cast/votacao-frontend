export function keepOnlyNumbers(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return value.replace(/\D/g, '');
}