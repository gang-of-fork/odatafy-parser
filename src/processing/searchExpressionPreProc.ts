// this is by far the most amazing algorithm ever created in 6 hours
//God intends that one shall never touch any of this code
import crypto from 'crypto';

export enum Prefixes {
  Str_Escape = '$',
  Func_Escape = '%',
  Expr_Escape = '§',
  Multiexpr_Escape = '&'
}

export function getIdentifier(prefix: Prefixes) {
  return `${prefix}${crypto.randomBytes(20).toString('hex')}${prefix}`;
}

export function escapeStrings(expr: string) {
  let escaped = expr;
  const stringResolve: Record<string, string> = {};

  while (escaped.includes("'")) {
    const regex = /'.*?'/;
    const identifier = getIdentifier(Prefixes.Str_Escape);
    const toEscape = escaped.match(regex);

    if (toEscape == null) {
      break;
    }

    stringResolve[identifier] = toEscape[0].toString();

    escaped = escaped.replace(regex, identifier);
  }

  return [escaped, stringResolve];
}

export function hasOnlyMatchingParentheses(expr: string) {
  return [...expr.matchAll(/\(/g)].length == [...expr.matchAll(/\)/g)].length;
}
const expressionResolver: any = {};
const multiExpressionResolve: any = {};

export function escapeExpression(expr: string, depth = 0) {
  let result = '';
  const andOrRegex = /( AND | OR )/;
  const expressionsElements = expr.split(andOrRegex);

  for (let i = 0; i < expressionsElements.length; i++) {
    if (expressionsElements[i].match(andOrRegex)) {
      result += expressionsElements[i];
      continue;
    }

    if (
      !(
        expressionsElements[i].includes('(') ||
        expressionsElements[i].includes(')')
      ) ||
      hasOnlyMatchingParentheses(expressionsElements[i])
    ) {
      const identifier = getIdentifier(Prefixes.Expr_Escape);
      result += identifier;
      expressionResolver[identifier] = expressionsElements[i];
      continue;
    }
    let subExpr = expressionsElements[i];

    let not = false;

    if (subExpr.startsWith('NOT ')) {
      subExpr = subExpr.replace('NOT ', '');
      not = true;
    }

    //cannot be out of bounds
    while (!hasOnlyMatchingParentheses(subExpr)) {
      subExpr += expressionsElements[i + 1] + expressionsElements[i + 2];
      i += 2;
    }
    subExpr = subExpr.trim();
    subExpr = subExpr.substring(1, subExpr.length - 1);
    const identifier = getIdentifier(Prefixes.Multiexpr_Escape);
    const toEscape = escapeExpression(subExpr, depth + 1);
    result += identifier;

    multiExpressionResolve[identifier] = {
      toEscape: toEscape,
      depth: depth,
      not: not
    };
  }
  return result;
}

export function reverseEscaped(
  expr: string,
  resolvers: {
    [key: string]: { toEscape: string; depth: number; not: boolean };
  }
) {
  const andOrRegex = /( AND | OR )/;
  const expressionElements = expr.split(andOrRegex).reverse();
  expr = expressionElements.join('');

  const transformedResolvers = Object.keys(resolvers).map((resolverKey) => {
    return {
      toEscape: resolvers[resolverKey].toEscape,
      depth: resolvers[resolverKey].depth,
      not: resolvers[resolverKey].not,
      key: resolverKey
    };
  });

  const maxDepth = Math.max(...transformedResolvers.map((o) => o.depth));

  for (let i = 0; i <= maxDepth; i++) {
    const transformedResolversOnDepth = transformedResolvers.filter(
      (transRes) => transRes.depth == i
    );

    transformedResolversOnDepth.forEach((tRoD) => {
      const tRoDElements = tRoD.toEscape.split(andOrRegex).reverse();
      tRoD.toEscape = tRoDElements.join('');
      expr = expr.replace(
        tRoD.key,
        `${tRoD.not ? 'NOT ' : ''}(${tRoD.toEscape})`
      );
    });
  }

  return expr;
}

export function resolveExpression(
  expr: string,
  exprResolver: Record<string, string>,
  strResolver: Record<string, string>
) {
  Object.keys(exprResolver).forEach((key) => {
    expr = expr.replace(key, exprResolver[key]);
  });

  Object.keys(strResolver).forEach((key) => {
    expr = expr.replace(key, strResolver[key]);
  });

  return expr;
}

export function reverseExprLogic(expr: string) {
  const [strResult, stringResolver] = escapeStrings(expr);

  const exprResult = escapeExpression(strResult as string);
  const reverseResult = reverseEscaped(exprResult, multiExpressionResolve);

  const result = resolveExpression(
    reverseResult,
    expressionResolver,
    stringResolver as Record<string, string>
  );

  return result;
}

export default function searchExpressionPreProc(expr: string) {
  return reverseExprLogic(expr);
}
