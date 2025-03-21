#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var yargs_1 = __importDefault(require("yargs"));
var _argv = yargs_1.default
    .command('$0', 'the default command', {}, api_1.showMarketStatus)
    .command('equity <symbol>', 'Get details of the symbol', function (yargsBuilder) {
    yargsBuilder.positional('symbol', {
        type: 'string',
        demandOption: true,
        describe: 'Symbol of NSE equities.'
    });
}, api_1.showEquityDetails)
    .command('historical <symbol>', 'Get historical chart of the symbol', function (yargsBuilder) {
    yargsBuilder.positional('symbol', {
        type: 'string',
        demandOption: true,
        describe: 'Symbol of NSE equities.'
    });
}, api_1.showHistorical)
    .command('index [indexSymbol]', 'Get details of the index.', function (yargsBuilder) {
    yargsBuilder.positional('indexSymbol', {
        type: 'string',
        demandOption: true,
        describe: 'Symbol of NSE Indices.'
    });
}, function (argv) {
    var index = argv.indexSymbol;
    if (index)
        api_1.showIndexDetails(argv);
    else
        api_1.showIndexOverview();
})
    .argv;
//# sourceMappingURL=index.js.map