/**
 * @private
 */
export declare const getDateRangeChunks: (startDate: Date, endDate: Date, chunkInDays: number) => {
    start: string;
    end: string;
}[];
/**
 * @private
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * @private
 * @param obj
 * @returns
 */
export declare const getDataSchema: (data: any, isTypeStrict?: boolean) => any[] | string;
//# sourceMappingURL=utils.d.ts.map