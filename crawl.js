const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function crawlPage(currentURL, baseURL, pages) { // pages is a sort-of map of currentURLs. It keeps track of the url and the times we have encountered it.
  const currentURlObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL);

  if (currentURlObj.hostname !== baseURLObj.hostname) { // If hostnames are different skip the page
    return pages;
  }

  const normalisedURL = normaliseURL(currentURL); // Normalise currentURL

  if (pages[normalisedURL] > 0) { // We have seen the URL before we increment its count
    pages[normalisedURL]++;
    return pages;
  }

  pages[normalisedURL] = 1; // We initialise the count to 1, because we have seen this page

  console.log(`crawling ${currentURL}`);
  let htmlBody = '';

  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) { // If status code is over 399 (400+) then its an error
      console.log(`Got HTTP error, status code: ${resp.status}`);
      return pages;
    }
    const contentType = resp.headers.get('content-type'); // If the response is not HTML content return pages
    if (!contentType || !contentType.includes('text/html')) {
      console.log(`Got non-html response: ${contentType}`);
      return pages;
    }
    htmlBody = await resp.text(); // extract html body from promise thats resolved as a string
  } catch (err) { // log any errors that occur during fetch
    console.log(err.message);
    return pages;
  }

  // recursion: function calling itself
  const nextURLs = getURLsFromHTML(htmlBody, baseURL); // getting a url from the html of the baseURL
  for (const nextURL of nextURLs) {
    pages = await crawlPage(nextURL, baseURL, pages); // calling the function again. this time, the nextURL is the currentURL
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody); // to interact with htmlBody convert it to a JSDOM object 
  const linkElements = dom.window.document.querySelectorAll('a');
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") { // relative
      try {
        const URLObject = new URL(linkElement.href, baseURL);
        urls.push(URLObject.href);
      } catch (err) {
        console.log(`Invalid Relative URL entered, error message: ${err.message}`);
      }
    } else { // absolute
      try {
        const URLObject = new URL(linkElement.href);
        urls.push(URLObject.href);
      } catch (err) {
        console.log(`Invalid Absolute URL entered, error message: ${err.message}`);
      }
    }
  }
  return urls;
}

function normaliseURL(URLString) {
  const urlObject = new URL(URLString); // convert to URL object
  const hostPath = `${urlObject.hostname}${urlObject.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') { // If url ends with forward slash, normalise it
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = { normaliseURL, getURLsFromHTML, crawlPage }; // export functions