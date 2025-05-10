const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function crawlPage(currentURL){
  console.log(`crawling ${currentURL}`)
  try {
    const resp = await fetch(currentURL)
    if (resp.status > 399){
      console.log(`Got HTTP error, status code: ${resp.status}`)
      return
    }
    const contentType = resp.headers.get('content-type')
    if (!contentType.includes('text/html')){
      console.log(`Got non-html response: ${contentType}`)
      return
    }
    console.log(await resp.text())
  } catch (err){
    console.log(err.message)
  }
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