import express from 'express';
import "dotenv/config";
import ExpressServer from './services/ExpressServer';

const StartServer = async () => {
    const app = express();
    await ExpressServer(app);

    app.listen(3000, () => console.log('Server is running on port 3000'));
};

StartServer();