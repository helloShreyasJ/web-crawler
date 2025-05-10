function generateReport(pages) {
  //START
  console.log(`
    - - - START - - -
  `)

  //Looping through the sorted pages
  const sortedPages = sortPages(pages);
  for( const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const hitCount = sortedPage[1];
    console.log(`Found ${hitCount} links to page ${url}`);
  }

  //END
  console.log(`
    - - - END - - -
  `)
}

function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((pageA, pageB) => {
    //index 0 is url, index 1 is count
    const aHits = pageA[1];
    const bHits = pageB[1];
    return bHits - aHits; // sort pagesArr descending
  })
  return pagesArr; //return sorted pagesArr 
}

module.exports = { generateReport, sortPages};