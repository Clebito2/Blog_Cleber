
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Note: In production, use process.env.GOOGLE_GENAI_API_KEY
// User provided key for this specific implementation context
const API_KEY = "AIzaSyDNwRYZ0CzkqAh2weARXUm68_L1gzDzz8o";
const genAI = new GoogleGenerativeAI(API_KEY);

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { theme } = JSON.parse(event.body);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // logic adapted from medicatholic/src/ai/flows/thematic-meditation.ts
        let specialInstructions = '';
        if (theme === 'Exame de consciência') {
            specialInstructions = `Para a Leitura, busque um trecho sobre a necessidade do autoexame e da conversão. Na Meditação, estruture a reflexão como um guia prático para o exame de consciência, abordando mandamentos e pecados capitais com perguntas reflexivas. A Oração deve ser um ato de contrição, e a Contemplação deve focar no propósito de emenda.`;
        } else if (theme === 'Casamento') {
            specialInstructions = `Para a Leitura, use preferencialmente ensinamentos do livro "Casamento e Família" de Monsenhor Tihamér Tóth, se houver um trecho relevante nas fontes. A Meditação deve abordar a santidade do matrimônio, os deveres dos esposos e a família como igreja doméstica. A Oração deve ser pelos casais e famílias.`;
        } else if (theme === 'Anjo da Guarda') {
            specialInstructions = `Para a Leitura, use preferencialmente ensinamentos do livro "O Meu Anjo e Eu" de Pe. Rogelio T. Alcántara, se houver um trecho relevante nas fontes. A Meditação deve explorar a presença e a ação do anjo da guarda, ensinando a devoção e a confiança neste protetor celeste.`;
        }

        const prompt = `Você é um diretor espiritual e teólogo católico, especialista em guiar fiéis na prática da Lectio Divina. Sua missão é criar uma meditação temática profunda e pastoral, estritamente focada no tema de "${theme}" e estruturada nos quatro passos da Lectio Divina.

Garanta que todo o conteúdo esteja em português e seja acessível, tocando o coração dos fiéis.

FONTES DE INSPIRAÇÃO:
Para a elaboração da meditação, use como base de conhecimento os seguintes livros e a doutrina católica:
1. "Imitação de Cristo" de Tomás de Kempis
2. "Filoteia - Introdução à Vida Devota" de São Francisco de Sales
3. "Glórias de Maria Santíssima" de Santo Afonso de Ligório
4. "A Arte de Aproveitar-se das Próprias Faltas" de Pe. José Tissot
5. "Catecismo da Igreja Católica"
6. "O Devoto Josephino"
7. "História de uma Alma" de Santa Teresinha do Menino Jesus

${specialInstructions ? `INSTRUÇÕES ESPECIAIS: ${specialInstructions}` : ''}

INSTRUÇÕES DE SAÍDA:
Retorne APENAS um objeto JSON com a seguinte estrutura, sem markdown codes:
{
  "leitura": { "titulo": "Leitura (Lectio)", "conteudo": "Texto do trecho...", "referencia": "Fonte citation" },
  "meditacao": { "titulo": "Meditação (Meditatio)", "conteudo": "Reflexão de 3 parágrafos..." },
  "oracao": { "titulo": "Oração (Oratio)", "conteudo": "Oração curta..." },
  "contemplacao": { "titulo": "Contemplação (Contemplatio)", "conteudo": "Reflexão breve..." }
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            body: text,
            headers: {
                "Content-Type": "application/json"
            }
        };

    } catch (error) {
        console.error("Error generating meditation:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Failed to generate meditation",
                details: error.message,
                stack: error.stack
            }),
        };
    }
};
