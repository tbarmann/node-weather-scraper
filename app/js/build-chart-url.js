const d3 = require('d3');
const _ = require('lodash');
const querystring = require('querystring');

const CHART_WIDTH = 700;
const CHART_HEIGHT = 400;
const CHART_TITLE = 'Temperatures over the past 72 hours';

const getWeatherData = require('./nws-current-conditions-scraper');

const station = {
    "stationId": "KPVD",
    "timeZone": "E"
};

const encode = (a) => a;

function buildUrl(data) {
    const temps = data.data.map((item) => item.temp_air);
    const maxTemp = d3.max(temps);
    const minTemp = d3.min(temps);

    const scaler = d3.scaleLinear()
        .domain([minTemp, maxTemp])
        .range([0,100]);

    const scaledTemps = temps.map((temp) => Math.round(scaler(temp)));
    const tempString = scaledTemps.reverse().join(',');
    const dates = data.data.filter((item, index) => {
        const firstIndex = 0;
        const lastIndex = data.data.length -1;
        const middleIndex = Math.round((data.data.length-1)/2);
        return index === firstIndex || index === lastIndex || index === middleIndex;
    });
    const filteredDates = dates.map((item) => item.parsedDateLocal).join('|');

    console.log(filteredDates);

    const baseUrl = 'http://chart.apis.google.com/chart';
    const params = {
        cht:'lc',                                   // lc = line chart
        chxl: `0:|${filteredDates}`,                           // chxl = custom axis labels
        chs:`${CHART_WIDTH}x${CHART_HEIGHT}`,       // chs = chart size
        chco:'FF0000',                              // chco = chart line color
        chxt:'x,y',                                 // chxt
        chxr:`1,${minTemp},${maxTemp},5`,           // chxr = axis range (0 = x axis, 1 = y axis)
        chtt:CHART_TITLE.replace(/\s/g, '+'),       // chtt = chart chart title
        chts:'000000,24',                           // chts = title style: font color, font size
        chg: '0,5',                                 // chg = grid line interval, 0 means none
        chd: `t:${tempString}`                      // chd = chart data
    };

    const url = `${baseUrl}?${querystring.stringify(params, null, null, {encodeURIComponent: encode})}`;
    console.log('#!/bin/bash');
    console.log(`open "${url}"`);

    // console.log(url);
}

// console.log(filteredDates);

//getWeatherData(station, buildUrl);


const d = '2018-04-03T19:51:00-04:00';

var formatTime = d3.timeFormat("%B %d, %Y");
console.log(formatTime(new Date(d)));




