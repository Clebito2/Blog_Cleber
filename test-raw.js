
const API_KEY = "AIzaSyDNwRYZ0CzkqAh2weARXUm68_L1gzDzz8o";
const MODEL = "gemini-flash-latest";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function test() {
    console.log(`Testing RAW REST API for ${MODEL}...`);
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log("Response Body:");
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

test();
