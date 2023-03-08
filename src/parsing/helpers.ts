export function isPositiveInteger(expr: string | number): boolean {
  if (typeof expr == 'number') {
    return expr >= 0 && Number.isInteger(expr);
  } else if (typeof expr == 'string') {
    return !isNaN(parseInt(expr)) && isPositiveInteger(parseInt(expr));
  } else {
    throw new Error('type must be either string or number');
  }
}
