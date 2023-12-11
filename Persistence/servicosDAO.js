import Servicos from "../Models/servicosModel.js";
import conectar from "./conexao.js";

export default class ServicosDAO{

    async gravar(servicos){
        if(servicos instanceof Servicos){
            const sql = 'INSERT INTO servicos (categoria, prazo, urlImagem) VALUES (?, ?, ?)';
            const parametros = [servicos.categoria, servicos.prazo, servicos.urlImagem];
            const conexao = await conectar();
            const resultado = await conexao.execute(sql, parametros);
            servicos.codigo = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(servicos){
        if(servicos instanceof Servicos){
            const sql = 'UPDATE servicos SET categoria = ?, prazo = ?, urlImagem = ? WHERE codigo = ?';
            const parametros = [servicos.categoria, servicos.prazo, servicos.urlImagem, servicos.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(servicos){
        if(servicos instanceof Servicos){
            const sql = 'DELETE servicos WHERE codigo = ?';
            const parametros = [servicos.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(pesquisa){
        let sql = "";
        if (pesquisa){
            sql = `SELECT * FROM servicos WHERE categoria LIKE '%${pesquisa}%'`;
        }
        else{
         sql =`SELECT * FROM servicos`;
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql);
        let listaServicos = [];
        for (const registro of registros){
            const servico = new Servicos(registro.codigo, registro.categoria, registro.prazo, registro.urlImagem);
            listaServicos.push(servico);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaServicos;
    }

}