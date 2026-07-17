const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Initialisation de l'API Gemini avec la variable d'environnement de Render
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = "Tu es Mini 2.0, une intelligence artificielle d'assistance. Ton créateur est Camille Uchiha. Tu dois toujours te présenter comme une IA créée par Camille Uchiha lorsque l'on te demande qui t'a conçu ou qui est ton créateur. Reste poli, respectueux et professionnel en français.";

// Route pour traiter les messages du bot Messenger
app.post('/api/message', async (req, res) => {
    const { message, senderId } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Le message est requis." });
    }

    try {
        // Envoi du message à Gemini avec les instructions système intégrées
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: SYSTEM_PROMPT
            }
        });

        const reponseIA = response.text || "[Mini 2.0]: Désolé, je n'ai pas pu générer de réponse.";

        return res.json({
            recipient: { id: senderId },
            message: { text: reponseIA }
        });

    } catch (error) {
        console.error("Erreur Gemini API:", error);
        return res.json({
            recipient: { id: senderId },
            message: { text: "[Mini 2.0]: Une erreur est survenue lors de la génération de ma réponse." }
        });
    }
});

// Route de diagnostic simple
app.get('/', (req, res) => {
    res.send("API Mini 2.0 (Propulsée par Gemini) en ligne !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Mini 2.0 avec Gemini active sur le port ${PORT}`);
});
