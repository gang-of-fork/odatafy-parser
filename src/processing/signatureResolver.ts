import { ValidationError } from './validations';

import {
    FuncNames1Args, FuncNames2Args, FuncNamesVarArgs, 
    FuncNames0Args, ConstantNodeTypes
} from '../types/nodes';

type TfuncSignature = {
    params: ConstantNodeTypes[],
    returnType: ConstantNodeTypes
}

export function getFuncSignature(funcName: FuncNames0Args | FuncNames1Args | FuncNames2Args | FuncNamesVarArgs): TfuncSignature[] {
    //assert for funcs with no args
    switch(funcName) {
        case FuncNames0Args.Maxdatetime:
            return [
                {
                    params: [],
                    returnType: ConstantNodeTypes.DateTimeOffsetValueInUrl
                }
            ];
        case FuncNames0Args.Mindatetime:
            return [
                {
                    params: [],
                    returnType: ConstantNodeTypes.DateTimeOffsetValueInUrl
                }
            ];
        case FuncNames0Args.Now:
            return [
                {
                    params: [],
                    returnType: ConstantNodeTypes.DateTimeOffsetValueInUrl
                }
            ];
    }

    //assert funcs with 1 args
    switch(funcName) {
        case FuncNames1Args.Ceiling:
            return [
                {
                    params: [ ConstantNodeTypes.Decimal ],
                    returnType: ConstantNodeTypes.Decimal
                }
            ];
        case FuncNames1Args.Date:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.DateTimeOffsetValueInUrl
                }
            ];
        case FuncNames1Args.Day:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.DateValue ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
        case FuncNames1Args.Floor:
            return [
                {
                    params: [ ConstantNodeTypes.Decimal ],
                    returnType: ConstantNodeTypes.Decimal
                }
            ];
        case FuncNames1Args.Fractionalseconds:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Decimal
                },
                {
                    params: [ ConstantNodeTypes.TimeOfDayValueInUrl ],
                    returnType: ConstantNodeTypes.Decimal
                }
            ];
        case FuncNames1Args.Geo_length:
            throw new ValidationError(`No registered signature for function ${funcName}`);
        case FuncNames1Args.Hour:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.TimeOfDayValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
        case FuncNames1Args.Length:
            return [
                {
                    params: [ ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
        case FuncNames1Args.Minute:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.TimeOfDayValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
        case FuncNames1Args.Month:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.DateValue ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
        case FuncNames1Args.Round:
            return [
                {
                    params: [ ConstantNodeTypes.Decimal ],
                    returnType: ConstantNodeTypes.Decimal
                }
            ];
        case FuncNames1Args.Second:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.TimeOfDayValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
        case FuncNames1Args.Time:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.TimeOfDayValueInUrl
                }
            ]
        case FuncNames1Args.Tolower:
            return [
                {
                    params: [ ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.String
                }
            ]
        case FuncNames1Args.Totaloffsetminutes:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                }
            ]
        case FuncNames1Args.Totalseconds:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                }
            ]
        case FuncNames1Args.Toupper:
            return [
                {
                    params: [ ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.String
                }
            ]
        case FuncNames1Args.Trim:
            return [
                {
                    params: [ ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.String
                }
            ]
        case FuncNames1Args.Year:
            return [
                {
                    params: [ ConstantNodeTypes.DateTimeOffsetValueInUrl ],
                    returnType: ConstantNodeTypes.Integer
                }
            ]
    }

    switch(funcName) {
        case FuncNames2Args.Concat:
            return [
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.String
                },
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Array
                }
            ];
        case FuncNames2Args.Contains:
            return [
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.Boolean
                },
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Boolean
                }
            ];
        case FuncNames2Args.Endswith:
            return [
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.Boolean
                },
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Boolean
                }
            ];
        case FuncNames2Args.Geo_distance:
            throw new ValidationError(`No registered signature for function ${funcName}`);
        case FuncNames2Args.Geo_intersects:
            throw new ValidationError(`No registered signature for function ${funcName}`);
        case FuncNames2Args.Hassubsequence:
            return [
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Boolean
                }
            ];
        case FuncNames2Args.Hassubset:
            return [
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Boolean
                }
            ];
        case FuncNames2Args.Indexof:
            return [
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
        case FuncNames2Args.MatchesPattern:
            return [
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.Boolean
                }
            ];
        case FuncNames2Args.Startswith:
            return [
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.String ],
                    returnType: ConstantNodeTypes.Integer
                },
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Array ],
                    returnType: ConstantNodeTypes.Integer
                }
            ];
    }

    switch(funcName) {
        case FuncNamesVarArgs.Case:
            throw new ValidationError(`No registered signature for function ${funcName}`);
        case FuncNamesVarArgs.Cast:
            throw new ValidationError(`No registered signature for function ${funcName}`);
        case FuncNamesVarArgs.Isof:
            throw new ValidationError(`No registered signature for function ${funcName}`);
        case FuncNamesVarArgs.Substring:
            return [
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.Integer ],
                    returnType: ConstantNodeTypes.String
                },
                {
                    params: [ ConstantNodeTypes.String, ConstantNodeTypes.Integer, ConstantNodeTypes.Integer ],
                    returnType: ConstantNodeTypes.String
                },
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Integer ],
                    returnType: ConstantNodeTypes.Array
                },
                {
                    params: [ ConstantNodeTypes.Array, ConstantNodeTypes.Integer, ConstantNodeTypes.Integer ],
                    returnType: ConstantNodeTypes.Array
                }
            ];
    }
}
