import ChamadoDAO from "../Persistence/chamadoDAO.js";

export default class Chamado{
    #id;
    #dataChamado;
    #servicosChamados;

    constructor(id=0, dataChamado="", servicosChamados=[]){
        this.#id = id;
        this.dataChamado = dataChamado;
        this.#servicosChamados = servicosChamados;
    }

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    get dataChamado(){
        return this.#dataChamado;
    }

    set dataChamado(novaData){
        this.#dataChamado = novaData;
    }

    get servicosChamados(){
        return this.#servicosChamados;
    }

    set servicosChamados(novosChamados){
        this.#servicosChamados = novosChamados;
    }

    toJSON(){
        return {
            'id': this.#id,
            'dataChamado': this.#dataChamado,
            'servicosChamados': this.#servicosChamados
        }
    }

    async gravar(){
        const chamadoDAO = new ChamadoDAO();
        await chamadoDAO.gravar(this);
    }

    async atualizar(){
        
    }

    async excluir(){
        
    }

    async consultar(termoBusca){
        
    }
}