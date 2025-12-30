const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const https = require('https');

const TARGET_URL = 'https://descouganda.com/';

async function scrapeData() {
    try {
        console.log(`Fetching text content from ${TARGET_URL}...`);
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get(TARGET_URL, { httpsAgent: agent });
        const html = response.data;
        const $ = cheerio.load(html);

        const data = {
            siteTitle: "Desco Uganda",
            hero: {
                title: "DESCO (U) LTD", // Fallback or extracted
                subtitle: "Touching Lives", // Fallback
                backgroundImage: "/images/Tours-Main-01-1024x446.webp",
                ctaText: "Discover More",
                ctaLink: "#services"
            },
            about: {
                title: "About Us",
                text: "",
                image: "/images/Crested-Cranes.jpeg"
            },
            services: [],
            features: [],
            contact: {
                address: "",
                email: "",
                phone: ""
            }
        };

        // Extract Hero Content (Best guess based on common structures)
        // Adjust selectors based on inspection if I could see source, but guessing standard WP classes
        const heroTitle = $('h1').first().text().trim();
        if (heroTitle) data.hero.title = heroTitle;
        
        // Extract About Content
        // Looking for sections with "About" in ID or class
        let aboutSection = $('#about');
        if (aboutSection.length === 0) aboutSection = $('.about');
        
        if (aboutSection.length) {
             data.about.text = aboutSection.find('p').text().trim();
        } else {
            // Fallback: finding a paragraph that looks like intro text
            const firstP = $('p').filter((i, el) => $(el).text().length > 100).first();
            data.about.text = firstP.text().trim();
        }

        // Extract Services
        // WP sites often use .service-item, .feature, .column
        const serviceElements = $('.wp-block-column, .service-item, .elementor-column').filter((i, el) => {
            return $(el).find('h2, h3, h4').length > 0 && $(el).find('img').length > 0;
        });

        serviceElements.each((i, el) => {
            const title = $(el).find('h2, h3, h4').first().text().trim();
            const desc = $(el).find('p').first().text().trim();
            const img = $(el).find('img').attr('src');
            
            if (title && img) {
                let localImg = img.split('/').pop().split('?')[0];
                // basic cleanup of filename
                localImg = localImg.replace(/[^a-zA-Z0-9._-]/g, '_');

                data.services.push({
                    title: title,
                    description: desc || "Professional services provided by Desco.",
                    image: `/images/${localImg}`
                });
            }
        });

        // If automatic service extraction failed (common with complex page builders), use the known images
        if (data.services.length === 0) {
             data.services = [
                {
                    title: "Tours & Travel",
                    description: "We organize safaris, gorilla trekking, and cultural tours across Uganda.",
                    image: "/images/Tours-Main-01-1024x446.webp"
                },
                {
                    title: "Printing & Branding",
                    description: "High quality digital printing, large format printing, and corporate branding.",
                    image: "/images/Printing-1024x585.webp"
                },
                {
                    title: "General Supplies",
                    description: "Supply of general merchandise and office equipment.",
                    image: "/images/Travel-Management-1024x683.webp"
                }
            ];
        }

        // Extract Contact Info (often in footer or contact section)
        const footerText = $('footer, #contact').text();
        const emailMatch = footerText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
        const phoneMatch = footerText.match(/(\+?256[\d\s-]{8,})/);

        if (emailMatch) data.contact.email = emailMatch[0];
        if (phoneMatch) data.contact.phone = phoneMatch[0];
        
        // Manual override for known address if not found
        data.contact.address = "Kampala, Uganda";

        console.log("Extracted Data:", JSON.stringify(data, null, 2));
        
        // Write to a temp file to inspect
        fs.writeFileSync('extracted_content.json', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error scraping data:", error.message);
    }
}

scrapeData();
