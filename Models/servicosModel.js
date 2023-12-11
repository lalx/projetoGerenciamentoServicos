import ServicosDAO from "../Persistence/servicosDAO.js"

export default class Servicos{

    #codigo
    #categoria
    #prazo
    #urlImagem

    get codigo(){ return this.#codigo; }
    set codigo(codigo){ this.#codigo = codigo; }

    get categoria(){ return this.#categoria; }
    set categoria(categoria){ this.#categoria = categoria; }

    get prazo(){ return this.#prazo; }
    set prazo(prazo){ this.#prazo = prazo; }

    get urlImagem(){ return this.#urlImagem; }
    set urlImagem(urlImagem){ this.#urlImagem = urlImagem; }

    constructor(codigo, categoria, prazo, urlImagem){
        this.codigo = codigo;
        this.categoria = categoria;
        this.prazo = prazo;
        this.urlImagem = urlImagem;
    }

    toJSON(){
        return{
            'codigo': this.#codigo,
            'categoria': this.#categoria,
            'prazo': this.#prazo,
            'urlImagem': this.#urlImagem
        }
    }

    async gravar(){
        const servicosDAO = new ServicosDAO();
        await servicosDAO.gravar(this);
    }

    async atualizar(){
        const servicosDAO = new ServicosDAO();
        await servicosDAO.atualizar(this);
    }

    async excluir(){
        const servicosDAO = new ServicosDAO();
        await servicosDAO.excluir(this);
    }

    async consultar(pesquisa){
        const servicosDAO = new ServicosDAO();
        return await servicosDAO.consultar(pesquisa);
    }
}