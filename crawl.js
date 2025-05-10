const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function crawlPage(currentURL, baseURL, pages){
  // currentURL is the page that the crawler is currently crawling
  // baseURL is normalised currentURL
  // pages is an object that is used to keep track of the number of times we have seen each internal link

  // The crawlPage function always needs to return an updated version of pages

  //Making baseURL and currentURL JavaScript interactable objects.
  const currentURlObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL);

  if (currentURlObj.hostname !== baseURLObj.hostname){
    return pages;
  }

  const normalisedURL = normaliseURL(currentURL)

  // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalisedURL] > 0){
    pages[normalisedURL]++;
    return pages;
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalisedURL] = 1;

  // fetch and parse the html of the currentURL
  console.log(`crawling ${currentURL}`);
  let htmlBody = '';

  try {
    console.log(`crawling ${currentURL}`)
    const resp = await fetch(currentURL)
    if (resp.status > 399){
      console.log(`Got HTTP error, status code: ${resp.status}`);
      return
    }
    const contentType = resp.headers.get('content-type')
    if (!contentType.includes('text/html')){
      console.log(`Got non-html response: ${contentType}`);
      return
    }
    console.log(await resp.text())
  } catch (err){
    console.log(err.message);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs){
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages;
}


function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll('a');
  for(const linkElement of linkElements) {
    if(linkElement.href.slice(0, 1) === "/") { //If the href begins with / then this is an absolute url. Eg: (/path/)
      try{
        const URLObject = new URL(`${baseURL}${linkElement.href}`);
        urls.push(`${URLObject.href}`);
      } catch(err) {
        console.log(`Invalid Relative URL entered, error message: ${err.message}`);
      }
      //relative
    } else {
      try{
        const URLObject = new URL(linkElement.href);
        urls.push(URLObject.href);
      } catch(err) {
        console.log(`Invalid Absolute URL entered, error message: ${err.message}`);
      }
    }
  }
  return urls;
}

function normaliseURL(URLString) {
  const urlObject = new URL(URLString);
  const hostPath = `${urlObject.hostname}${urlObject.pathname}`;
  if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1); //Returns everything BUT the last character
  } 
  return hostPath;
}
module.exports = { normaliseURL, getURLsFromHTML, crawlPage};