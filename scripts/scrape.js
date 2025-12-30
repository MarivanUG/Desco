const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_URL = 'https://descouganda.com/';
const IMAGE_DIR = path.join(__dirname, 'public', 'images');

// Ensure image directory exists
if (!fs.existsSync(IMAGE_DIR)){
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

async function scrapeImages() {
    try {
        console.log(`Fetching ${TARGET_URL}...`);
        
        // Ignore SSL errors for scraping if necessary (common issue with some scraped sites)
        const agent = new https.Agent({  
            rejectUnauthorized: false 
        });

        const response = await axios.get(TARGET_URL, { httpsAgent: agent });
        const html = response.data;
        const $ = cheerio.load(html);
        const imgTags = $('img');

        console.log(`Found ${imgTags.length} images.`);

        const downloadPromises = [];

        imgTags.each((i, elem) => {
            let src = $(elem).attr('src');
            if (src) {
                // Handle relative URLs
                if (!src.startsWith('http')) {
                    // Check if it's protocol-relative (//example.com)
                    if (src.startsWith('//')) {
                        src = 'https:' + src;
                    } else {
                        // Join with base URL, ensuring no double slashes
                        const baseUrl = TARGET_URL.endsWith('/') ? TARGET_URL.slice(0, -1) : TARGET_URL;
                        const imagePath = src.startsWith('/') ? src : '/' + src;
                        src = baseUrl + imagePath;
                    }
                }

                const filename = path.basename(src).split('?')[0]; // Remove query params
                // clean filename of weird characters
                const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
                
                if (cleanFilename && (cleanFilename.endsWith('.jpg') || cleanFilename.endsWith('.png') || cleanFilename.endsWith('.jpeg') || cleanFilename.endsWith('.svg') || cleanFilename.endsWith('.webp') || cleanFilename.endsWith('.gif'))) {
                     downloadPromises.push(downloadImage(src, path.join(IMAGE_DIR, cleanFilename)));
                } else {
                    console.log(`Skipping invalid extension: ${src}`);
                }
            }
        });

        await Promise.allSettled(downloadPromises);
        console.log('Scraping complete.');

    } catch (error) {
        console.error('Error scraping:', error.message);
    }
}

async function downloadImage(url, filepath) {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            httpsAgent: agent,
            timeout: 10000
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('finish', () => {
                console.log(`Downloaded: ${path.basename(filepath)}`);
                resolve();
            });
            writer.on('error', (err) => {
                console.error(`Error writing ${path.basename(filepath)}: ${err.message}`);
                reject(err);
            });
        });
    } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
        // Don't reject, just log error so other downloads continue
    }
}

scrapeImages();
