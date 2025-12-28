const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const API_KEY = "AIzaSyDNwRYZ0CzkqAh2weARXUm68_L1gzDzz8o";
    const genAI = new GoogleGenerativeAI(API_KEY);

    const models = ["gemini-pro", "gemini-1.0-pro", "gemini-1.5-flash", "gemini-1.5-flash-latest"];

    console.log("--- STARTING TEST ---");
    for (const modelName of models) {
        console.log(`\nTesting: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            console.log(`✅ SUCCESS: ${modelName}`);
            console.log(`Output: ${response.text()}`);
            // If we found a working one, we theoretically could stop, but let's see which ones work.
        } catch (error) {
            console.log(`❌ FAILED: ${modelName}`);
            console.log(`Error: ${error.message}`);
        }
    }
    console.log("\n--- TEST COMPLETE ---");
}

test();
