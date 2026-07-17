const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = "Tu es Mini 2.0, une intelligence artificielle d'assistance. Ton créateur est Camille Uchiha. Tu devez toujours te présenter comme une IA créée par Camille Uchiha lorsque l'on te demande qui t'a conçu ou qui est ton créateur. Reste poli, respectueux et professionnel en français.";

app.post('/api/message', async (req, res) => {
    const { message, senderId } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Le message est requis." });
    }

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        // 🔥 SÉCURITÉ : Formatage strict du contenu pour Gemini
        const result = await model.generateContent([{ text: message }]);
        const response = await result.response;
        const reponseIA = response.text();

        return res.json({
            recipient: { id: senderId },
            message: { text: reponseIA }
        });

    } catch (error) {
        // Regarde ce log sur Render pour voir la cause exacte (ex: API key expired, etc.)
        console.error("Erreur Gemini API détaillée:", error);
        return res.json({
            recipient: { id: senderId },
            message: { text: "Désolé, je rencontre une petite difficulté à formuler ma réponse. Réessaie !" }
        });
    }
});

app.get('/', (req, res) => {
    res.send("API Mini 2.0 en ligne !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API active sur le port ${PORT}`);
});
