const { normaliseURL, getURLsFromHTML } = require('./crawl.js');
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

test('To see if getURLsFromHTML can retrieve the URLs from HTML (absolute)', () => {
  const input = `
    <html>
      <body>
        <a href="https://blog.boot.dev">Boot.dev blog</a>
      </body>
    </html>
  `;
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(input, inputBaseURL);
  const expected = ["https://blog.boot.dev/"];
  expect(actual).toEqual(expected);
})

test('To see if getURLsFromHTML can retrieve the URLs from the HTML (relative)', () => {
  const inputHTML = `
    <html>
      <body>
        <a href="/path/">Blog boot.dev</a>
      </body>
    </html>
  `
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML,inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
})

test('To see if getURLsFromHTML can retrieve multiple URLS from the HTML (both relative and absolute)', () => {
  const inputHTML = `
    <html>
      <body>
        <a href="https://blog.boot.dev/path1/">Blog boot.dev path 1</a>
        <a href="/path2/">Blog boot.dev path 2</a>
      </body>
    </html>
  `
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML,inputBaseURL);
  const expected = ["https://blog.boot.dev/path1/","https://blog.boot.dev/path2/"];
  expect(actual).toEqual(expected);
})
test('To see if getURLsFromHTML can evade invalid URLs whilst returning an array of valid URLs', () => {
  const inputHTML = `
    <html>
      <body>
        <a href="invalid">Invalid URL</a>
        <a href="/path/">Blog boot.dev path 2</a>
      </body>
    </html>
  `
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML,inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
})