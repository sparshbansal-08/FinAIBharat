import { IndexEquityInfo } from './interface';
/**
 *
 * @param indexSymbol
 * @returns
 */
export declare const getGainersAndLosersByIndex: (indexSymbol: string) => Promise<{
    gainers: IndexEquityInfo[];
    losers: IndexEquityInfo[];
}>;
/**
 *
 * @param indexSymbol
 * @returns
 */
export declare const getMostActiveEquities: (indexSymbol: string) => Promise<{
    byVolume: IndexEquityInfo[];
    byValue: IndexEquityInfo[];
}>;
//# sourceMappingURL=helpers.d.ts.map