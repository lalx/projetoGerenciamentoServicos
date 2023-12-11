//url de referência https://cloud.google.com/dialogflow/es/docs/integrations/dialogflow-messenger?hl=pt-br

import Servicos from "../Models/servicosModel.js";

export function criarMessengerCard(){
    return {
        type:"info",
        title:"",
        subtitle:"",
        image: {
            src : {
                rawUrl:""
            }
        },
        actionLink:""
    }
}

export function criarCustomCard(){
    return {
        card: {
            title:"",
            subtitle:"",
            imageUri:"",
            buttons: [
                {
                    text:"botão",
                    postback:""
                }
            ]
        }
    }
    
}

export async function obterCardServicos(tipoCard = 'custom'){
    const servicoModel = new Servicos();
    const listaServicos = await servicoModel.consultar();
    const listaCards = [];
    for (const servico of listaServicos){
        let cartao;
        if (tipoCard == 'custom'){
            cartao = criarCustomCard();
            cartao.card.title = servico.categoria;
            cartao.card.subtitle = `prazo: ${servico.prazo} hora(s)`;
            cartao.card.imageUri = servico.urlImagem;
            cartao.card.buttons[0].text = "Clique aqui para mais informações";
            cartao.card.buttons[0].postback = "https://www.ibm.com/br-pt/topics/service-desk";
        } 
        else{
            //card para messenger
            cartao = criarMessengerCard();
            cartao.title = servico.categoria;
            cartao.subtitle = `prazo: ${servico.prazo} hora(s)`;
            cartao.image.src.rawUrl = servico.urlImagem;
            cartao.actionLink = "https://www.ibm.com/br-pt/topics/service-desk";
        }
        listaCards.push(cartao);
    }
    return listaCards;
}

