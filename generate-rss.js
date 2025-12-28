
const fs = require('fs');
const path = require('path');

// 1. Read data.js content
const dataPath = path.join(__dirname, 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

const vm = require('vm');

// 2. Extract blogData safely using VM
const sandbox = {};
let blogData;
try {
    // Append "; blogData;" to the end so the script returns the value
    // because 'const' declarations don't attach to the sandbox object automatically
    blogData = vm.runInNewContext(dataContent + "; blogData;", sandbox);
} catch (e) {
    console.error("Error executing data.js in sandbox:", e);
    process.exit(1);
}

if (!blogData) {
    console.error("blogData not found in data.js");
    process.exit(1);
}

// 3. Helper to escape XML special chars
const escapeXml = (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
};

// 4. Generate RSS 2.0 Content
const generateRss = (posts) => {
    const siteUrl = "https://agequodagis.netlify.app"; // Using the user's domain from screenshot/context
    const date = new Date().toUTCString();

    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Cléber Donato</title>
  <link>${siteUrl}</link>
  <description>Ensaios, reflexões e atualizações do laboratório de IA.</description>
  <lastBuildDate>${date}</lastBuildDate>
  <language>pt-br</language>
`;

    posts.forEach(post => {
        // Parse custom date format "27 DEZ 2025" if needed, 
        // or just use current build time for pubDate if parsing is hard
        // Let's try to map Portuguese months
        const monthMap = {
            'JAN': 'Jan', 'FEV': 'Feb', 'MAR': 'Mar', 'ABR': 'Apr', 'MAI': 'May', 'JUN': 'Jun',
            'JUL': 'Jul', 'AGO': 'Aug', 'SET': 'Sep', 'OUT': 'Oct', 'NOV': 'Nov', 'DEZ': 'Dec'
        };

        let pubDate = date; // Fallback
        try {
            const parts = post.date.split(' ');
            if (parts.length === 3) {
                const day = parts[0];
                const ptMonth = parts[1].toUpperCase();
                const year = parts[2];
                const dbMonth = monthMap[ptMonth] || 'Jan';
                pubDate = new Date(`${day} ${dbMonth} ${year} 12:00:00 GMT`).toUTCString();
            }
        } catch (e) { }

        // Create absolute URL for the post (assuming query param navigation based on app.js)
        const postLink = `${siteUrl}/?post=${post.id}`;

        xml += `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${postLink}</link>
    <guid>${postLink}</guid>
    <description>${escapeXml(post.description)}</description>
    <pubDate>${pubDate}</pubDate>
    <category>${escapeXml(post.category)}</category>
    <enclosure url="${siteUrl}/${post.image}" length="0" type="image/jpeg" />
  </item>
`;
    });

    xml += `</channel>
</rss>`;

    return xml;
};

// 5. Write file
const rssContent = generateRss(blogData.posts);
fs.writeFileSync(path.join(__dirname, 'rss.xml'), rssContent);

console.log("RSS Feed generated successfully at rss.xml");
