# ohlc

[![npm version](https://badge.fury.io/js/ohlc.svg)](https://badge.fury.io/js/ohlc)
![npm](https://img.shields.io/npm/dw/ohlc.svg)
[![](https://data.jsdelivr.com/v1/package/npm/ohlc/badge)](https://www.jsdelivr.com/package/npm/ohlc)
[![Build Status](https://travis-ci.org/mick-whats/ohlc-node.svg?branch=master)](https://travis-ci.org/mick-whats/ohlc-node)

> Major update for version 2

## install

### node.js

```shell
npm install ohlc
```

```js
var ohlc = require('ohlc')
```

### Browser

```html
<script src="dist/ohlc.js"></script>
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ohlc"></script>

<script src="https://cdn.jsdelivr.net/gh/mick-whats/ohlc-node@2.0.1/dist/ohlc.js"></script>
```

## sumple data

```data.json
arrayData = [
  ["2017-01-04",348,350,346,350,68700],
  ["2017-01-05",350,353,349,352,59200],
  ["2017-01-06",350,358,350,356,168900]
]
```

## toDaily()

output to daily data

```js
ohlc(arrayData).toDaily();
/// result 
[
  ...
  {
    "Date": '2017-04-03',
    Open: 352,
    High: 352,
    Low: 348,
    Close: 348,
    Volume: 108200
  }
  ...
]
```

## toWeekly()

output to weekly data
```js
ohlc(arrayData).toWeekly();
/// result 
[
  ...
  {
    "Date": '2017-04-02',
    Open: 352,
    High: 352,
    Low: 338,
    Close: 339,
    Volume: 379400
  }
  ...
]
```

## toMonthly

output to monthly data
```js
ohlc(arrayData).toMonthly();
/// result 
[
  ...
  {
    "Date": '2017-04-01',
    Open: 352,
    High: 370,
    Low: 330,
    Close: 357,
    Volume: 1514900
  }
  ...
]
```

## value(period)
output data

```js

// daily
ohlc(arrayData).value()
// equal toDaily
ohlc(arrayData).toDaily()

// weekly
ohlc(arrayData).value('weekly')
// equal toWeekly
ohlc(arrayData).toWeekly()

// monthly
ohlc(arrayData).value('monthly')
// equal toMonthly
ohlc(arrayData).toMonthly()

```

## toChartData(period)

It complies with high charts

[Candlestick \| Highcharts](https://www.highcharts.com/stock/demo/candlestick)  
[https://www\.highcharts\.com/samples/data/aapl\-ohlc\.json](https://www.highcharts.com/samples/data/aapl-ohlc.json)
```js
var chartData = ohlc(arrayData).sma(5, 25).toChartData();

Object.keys(chartData)
//=> ['candle', 'volume', 'sma5', 'sma25']

chartData.candle[90]
//=> [1494979200000, 370, 372, 365, 369]
chartData.volume[90]
//=> [1494979200000, 32300]
chartData.sma5[90]
//=> [1494979200000, 372]
chartData.sma25[90]
//=> [1494979200000, 359]
moment.utc(1494979200000).format('YYYY-MM-DD')
//=> '2017-05-17'
```

## start() and end()

Set the output period

```js
prices = ohlc(arrayData).toDaily();
/// prices.length is 101

prices = ohlc(arrayData).start('2017-04-03').toDaily();
/// prices.length is 40

prices = ohlc(arrayData).end('2017-04-10').toDaily();
/// prices.length is 67

prices = ohlc(arrayData).start('2017-04-03').end('2017-04-10').toDaily();
/// prices.length is 6
```


## sma

This will add sma(simple MA)

```js
ohlc(arrayData).sma(5, 25, 75).toDaily();
/// result
[
  ...
  {
    Date: '2017-05-31',
    Open: 372,
    High: 372,
    Low: 362,
    Close: 364,
    Volume: 46500,
    sma5: 373,
    sma25: 373,
    sma75: 360
  }
  ...
]
```
