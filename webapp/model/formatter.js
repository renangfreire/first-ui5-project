sap.ui.define([], function () {
    "use strict";

    return {
        formatarPreco: function (valor) {
            if (!valor) return "R$ 0,00";
            const iValue = Number(valor)
            return "R$ " + iValue.toFixed(2).replace(".", ",");
        },
        traduzirStatus: function (bStatus) {
            if(!bStatus){
                return "Ativo"
            }

            return "Descontinuado"

            // const mapa = {
            //     ACTIVE: "Ativo",
            //     OUT_OF_STOCK: "Fora de estoque",
            //     PENDING: "Pendente"
            // };
            // return mapa[sStatus] || "Desconhecido";
        },

        corStatus: function (bStatus) {
            if(!bStatus){
                return "Success"
            }

            return "Error"
            // const mapa = {
            //     ACTIVE: "Success",
            //     OUT_OF_STOCK: "Error",
            //     PENDING: "Warning"
            // };
            
            // return mapa[sStatus] || "None";
        },

        visivelSeDisponivel: function (disponivel) {
            return !!disponivel;
        },

        booleanoParaTexto: function(bBoolean){
            return bBoolean ? 'Sim' : 'Não'
        }
    };
});
