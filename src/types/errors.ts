export type OdatafyError = {
    //for documentation and troubleshooting crossreference
    name: OdatafyErrorNames;

    //module where the error originates
    originModule: OdatafyModules;

    //whether there is a problem with a SystemQueryOption or AggregationPipeline(for the future) expression
    area: 'SystemQueryOptions';

    //which Queryoption (e.g. skip, filter) Expression causes a problem
    queryOption?: string;

    //custom error message
    message: string;
};

export enum OdatafyModules {
    Parser = 'odatafy-parser',
    MongoDBGenerator = 'odatafy-mongodb'
    //..
}

export enum OdatafyErrorNames {
    ParserException = 'ParserException'
    //...
}

export enum OdatafyQueryOptions {
    Compute = 'compute',
    Expand = 'expand',
    Filter = 'filter',
    Levels = 'levels',
    OrderBy = 'orderby',
    Search = 'search',
    Select = 'select',
    Skip = 'skip',
    Top = 'top'
}
