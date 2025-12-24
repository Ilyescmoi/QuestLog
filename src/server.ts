import app from './app';
import config from './config/config';
import pool from "./config/db";


pool.connect().then(() => {
    console.info('Connexion DB validée par le serveur');
}).catch((err) => {
    console.error('Erreur connexion DB :', err);
});

app.listen(config.port, () => {
    console.info(`Server running on port ${config.port}`);
});