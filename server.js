const axios = require('axios');
const cheerio = require('cheerio');
const mainDocumentUrl = 'https://stream.crichd.vip/update/skys2.php'; // Replace with your actual URL
async function scrapeIframeContent(iframeUrl) {
    try {
        // Fetch the main document HTML
        const mainDocumentResponse = await axios.get(mainDocumentUrl);
        const mainDocumentHtml = mainDocumentResponse.data;
        const $ = cheerio.load(mainDocumentHtml);
        const iframeElement = $('#myIframe'); // Replace 'myIframe' with the actual ID of your iframe
        const iframeSrc = iframeElement.attr('src');
        const iframeContentResponse = await axios.get(iframeSrc);
        const iframeContentHtml = iframeContentResponse.data;
        console.log(iframeContentHtml);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Call the function with the URL of the iframe
scrapeIframeContent();
