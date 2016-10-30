"use strict";
const stationSearch = require('../app/js/station-search');
const expect = require('chai').expect;

const searchWithManyResults = 'airport';
const searchWithOneResult = 'providence';
const searchWithNoResults = 'xxx';

describe('#StationSearch', () => {
  
  it('should return an array of objects when many results are found ', () => {
    const searchResult = stationSearch(searchWithManyResults);
    expect(searchResult).to.be.instanceof(Array);
    expect(searchResult.length).to.be.above(1);
    expect(searchResult[0]).to.be.instanceof(Object);
  });
  
  it('should return an empty array if nothing is found', () => {
    const searchResult = stationSearch(searchWithNoResults);
    expect(searchResult.length).to.equal(0);
  });

  it('should find station KPVD when searching for "providence"', () => {
    const searchResult = stationSearch('providence');
    expect(searchResult.length).to.equal(1);
    expect(searchResult[0].stationId).to.equal('KPVD');
  });
});
