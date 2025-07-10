sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "studies/firstui5project/model/models",
    "sap/m/GroupHeaderListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, JSONModel, models, GroupHeaderListItem, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("studies.firstui5project.controller.Home", {
        onInit() {
            models.getProdutos().then((data) => {
                const oModel = new JSONModel(data)
                this.getView().setModel(oModel, "produtosModel");
            });
        },
        onItemPress: function (oEvent) {
            const oItem = oEvent.getParameter('listItem'); // Retorna o elemento clicado (nesse exemplo: o item)
            
            MessageToast.show(`O item clicado '${oItem.getTitle()}' possui ${oItem.getCounter()} itens`);
        },
      
        criarCabecalhoGrupo: function(oGroup){
          return new GroupHeaderListItem({
            title: oGroup.key
          });
        },
        
        onFiltrarProdutos: function (oEvent) {
          const sQuery = oEvent.getParameter("newValue");
          const oList = this.byId("listaProdutos");
          const oBinding = oList.getBinding("items");
        
          let aFiltros = [];
          if (sQuery) {
            aFiltros.push(new Filter(
              "nome",
              FilterOperator.Contains,
              sQuery
            ));
          }
        
          oBinding.filter(aFiltros);
        }
    });
});