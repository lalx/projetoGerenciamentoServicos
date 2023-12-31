import { obterCardServicos } from "../functionsDialogFlow/functionsDLFlow.js";
import Chamado from '../Models/chamadosModel.js';
import Servicos from "../Models/servicosModel.js";

export default class DialogFlowController {

    processarIntencoes(req, res) {
        if (req.method === 'POST') {
            const intencao = req.body.queryResult.intent.displayName;

            const origem = req.body?.originalDetectIntentRequest?.source;
            if (intencao === 'intencao-usuario') {
                if (origem) {
                    obterCardServicos('custom').then((listaCards) => {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "text": {
                                "text": [
                                    "Bem vindo à Assistência de Serviços de TI! \n",
                                    "Esses são os serviços que prestamos suporte: \n"
                                ]
                            }
                        });
                        resDF.fulfillmentMessages.push(...listaCards);
                        resDF.fulfillmentMessages.push({
                            "text": {
                                "text": [
                                    "Por problemas técnicos estamos com um atraso e todos suportes levará 6 horas para atendimento. Pedimos desculpas! \n",
                                    "Qual serviço necessita suporte?"
                                ]
                            }
                        })
                        res.json(resDF);
                    }).catch((erro) => {
                        let resDF = {
                            "fulfillmentMessages": [{
                                "text": {
                                    "text": [
                                        "Erro ao recuperar o serviço: \n",
                                        "Não foi possível consultar o menu de serviços!",
                                        "Desculpe pelo transtorno!"
                                    ]
                                }
                            }]
                        }
                        res.json(resDF);
                    })

                }
                else {
                    obterCardServicos('messenger').then((listaCards) => {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": "Bem vindo à Assistência de Serviços de TI!",
                                    "text": [
                                        "Estamos sempre dispostos a te ajudar!",
                                        "Esses são os serviços que prestamos suporte: \n"
                                    ]
                                }]]
                            }
                        });
                        resDF.fulfillmentMessages[0].payload.richContent[0].push(...listaCards);
                        resDF.fulfillmentMessages[0].payload.richContent[0].push({
                            "type": "description",
                            "title": "Por problemas técnicos estamos com um atraso e todos suportes levará 6 horas para atendimento. Pedimos desculpas! Qual serviço necessita suporte?",
                            "text": []
                        });
                        res.json(resDF);
                    }).catch((erro) => {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": "Erro ao recuperar o serviço: \n",
                                    "text": [
                                        "Não foi possível consultar o menu de serviços!",
                                        "Desculpe pelo transtorno!"
                                    ]
                                }]]
                            }
                        });

                    })
                }
            }
            else if (intencao === "pedidoFinalizado") {
                let servicos = [];
                let nomes = [];
                let emails = [];
                for (const contexto of req.body.queryResult.outputContexts) {
                    
                    if (contexto.parameters.categoria) {

                        servicos = contexto.parameters.categoria;
                        //qtds = contexto.parameters.number; adaptar
                        nomes = contexto.parameters.person;
                        emails = contexto.parameters.email;
                    }
                }

                const dataHoje = new Date().toLocaleDateString();
                var servicosChamados = [];
                for (let i = 0; i < servicos.length; i++) {

                    servicosChamados.push({
                        "codigo":0,
                        "categoria": servicos[i],
                        //"qtd": qtds[i]
                        "nome": nomes[i],
                        "email": emails[i],
                    });

                }
                //consultar no banco o horario da categoria
                /*var svT = new Servicos();
                var pz = svT.consultar(servicosChamados[0].categoria);*/
                const chamado = new Chamado(0, dataHoje, servicosChamados);
                const prazo = 6;

                chamado.gravar().then(() => {
                    if (origem) {
                        let resDF = {
                            "fulfillmentMessages": [{
                                "text": {
                                    "text": [
                                        `Nº do chamado gerado: 000${chamado.id} \n`,
                                        `Técnico responsável pelo atendimento: Glauco Junior \n`,
                                        `Prazo para atendimento: ${prazo} horas.`
                                    ]
                                }
                            }]
                        }
                        res.json(resDF);
                    }
                    else {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": `Nº do chamado gerado: 000${chamado.id} \n`,
                                    "text": [
                                        `Técnico responsável pelo atendimento: Glauco Junior \n`,
                                        `Prazo para atendimento: ${prazo} horas.`
                                    ]
                                }]]
                            }
                        });
                        res.json(resDF);
                    }
                })
                .catch((erro) => {
                    if (origem) {
                        let resDF = {
                            "fulfillmentMessages": [{
                                "text": {
                                    "text": [
                                        `Erro ao registrar o seu chamado! \n`,
                                        `Erro: ${erro.message}`,
                                        `Entre em contato pelo telefone (11) 99999-9999`,
                                        `Agradecemos o seu contato!`
                                    ]
                                }
                            }]
                        }
                        res.json(resDF);
                    }
                    else {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": `Erro ao registrar o seu chamado! \n`,
                                    "text": [
                                        `Erro: ${erro.message}`,
                                        `Entre em contato pelo telefone (11) 99999-9999`,
                                        `Agradecemos o seu contato!`
                                    ]
                                }]]
                            }
                        });
                    }
                });
            }

        }
    }
}
