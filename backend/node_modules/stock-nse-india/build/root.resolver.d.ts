import { EquityDetails } from './interface';
interface StringArrayFilter {
    startsWith?: string;
    regex?: string;
    in?: string[];
    nin?: string[];
    eq?: string;
    neq?: string;
    offset?: number;
    limit?: number;
}
declare const _default: {
    Query: {
        equities: (_parent: unknown, { symbolFilter }: {
            symbolFilter: StringArrayFilter;
        }) => Promise<string[]>;
        indices: (_parent: unknown, { filter }: {
            filter: any;
        }) => Promise<any>;
    };
    Equity: {
        symbol: (parent: string) => string;
        details: (parent: string) => Promise<EquityDetails>;
    };
};
export default _default;
//# sourceMappingURL=root.resolver.d.ts.map