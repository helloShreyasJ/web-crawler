const { normaliseURL } = require('./crawl.js');
const { test, expect } = require('@jest/globals')

test('To see if normaliseURL strips the protocol (HTTPS)', () => {
  const input = 'https://blog.boot.dev/path';
  const actual = normaliseURL(input);
  const expected = 'blog.boot.dev/path';

  expect(actual).toEqual(expected);
})

test('To see if normaliseURL strips the protocol (HTTP)', () => {
  const input = 'http://blog.boot.dev/path';
  const actual = normaliseURL(input);
  const expected = 'blog.boot.dev/path';

  expect(actual).toEqual(expected);
})

test('To see if normaliseURL strips trailing slash', () => {
  const input = 'https://blog.boot.dev/path/';
  const actual = normaliseURL(input);
  const expected = 'blog.boot.dev/path';

  expect(actual).toEqual(expected);
})

test('To see if normaliseURL ignores case', () => {
  const input = 'https://BloG.Boot.Dev/path/';
  const actual = normaliseURL(input);
  const expected = 'blog.boot.dev/path';

  expect(actual).toEqual(expected);
})