const { crawlPage } = require('./crawl.js');

async function main() {
    if (process.argv.length < 3) {
        console.log("no website provided");
        process.exit(1);
    }
    if(process.argv.length > 3) {
        console.log("too many arguments. please provide only one website")
        process.exit(1);
    }
    const baseURL = new URL(process.argv[2]);
    console.log(`starting crawl of ${baseURL}`);

    const pages = await crawlPage(baseURL, baseURL, {})

    console.log(pages)
}

main();