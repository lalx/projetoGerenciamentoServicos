import Chamado from "../Models/chamadosModel.js";
import conectar from "./conexao.js";

export default class ChamadoDAO{
    async gravar(chamado){
        if (chamado instanceof Chamado){
            const conexao = await conectar();
            let sql = `INSERT INTO chamado (dataChamado) VALUES (?);`;
            let parametros = [chamado.dataChamado];
            const resultado = await conexao.execute(sql, parametros);
            chamado.id = resultado[0].insertId;

            //não está funcionando
            for (const item of chamado.servicosChamados){
                sql = `SELECT codigo FROM servicos WHERE categoria like ?`;
                const [registros] = await conexao.execute(sql, ['%' + item.categoria + '%']);
                item.codigo = registros[0].codigo;
                sql = `
                    INSERT INTO chamado_servicos(fk_id_chamado, fk_codigo_servicos, nome, email)
                    VALUES (?,?,?,?);
                `
                parametros = [chamado.id, item.codigo, item.nome, item.email];
                await conexao.execute(sql, parametros);
            }
            global.poolConexoes.releaseConnection(conexao);
        }
    }
}