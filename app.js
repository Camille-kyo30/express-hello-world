const express = require('express');
const app = express();

app.use(express.json());

const SYSTEM_PROMPT = "Tu es Mini 2.0, une intelligence artificielle d'assistance. Ton créateur est Camille Uchiha. Tu dois toujours te présenter comme une IA créée par Camille Uchiha lorsque l'on te demande qui t'a conçu ou qui est ton créateur. Reste poli, respectueux et professionnel en français.";

// Route pour AutoResponder Messenger
app.post('/api/message', (req, res) => {
    const { message, senderId } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Le message est requis." });
    }

    const texteNormalise = message.toLowerCase().trim();
    let reponse = "";

    if (
        texteNormalise.includes("créateur") || 
        texteNormalise.includes("createur") || 
        texteNormalise.includes("qui t'a fait") || 
        texteNormalise.includes("qui t'a créé") || 
        texteNormalise.includes("ton boss")
    ) {
        reponse = "Je suis une intelligence artificielle et mon créateur est Camille Uchiha.";
    } else {
        reponse = "[Mini 2.0]: En tant qu'IA, je suis à votre écoute.";
    }

    return res.json({
        recipient: { id: senderId },
        message: { text: reponse }
    });
});

// Route de diagnostic simple si tu ouvres l'URL dans ton navigateur
app.get('/', (req, res) => {
    res.send("API Mini 2.0 en ligne et fonctionnelle !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Mini 2.0 active sur le port ${PORT}`);
});
