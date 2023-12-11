import express from 'express';
import routeDialogFlow from './Routes/dialogFlowRoute.js';

const host = '0.0.0.0';
const porta = 3500;

const app = express();
app.use(express.json());
app.use('/dialogflow', routeDialogFlow);
app.use(express.static('./public'));

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})