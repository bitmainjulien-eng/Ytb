const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.status(400).send('URL YouTube invalide');
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoURL, { format: 'mp4', quality: 'highest' }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors du téléchargement');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
