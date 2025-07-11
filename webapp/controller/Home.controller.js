sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "studies/firstui5project/model/models",
    "sap/m/GroupHeaderListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "studies/firstui5project/model/formatter"
], (Controller, MessageToast, JSONModel, models, GroupHeaderListItem, Filter, FilterOperator, formatter) => {
    "use strict";

    return Controller.extend("studies.firstui5project.controller.Home", {
        formatter: formatter,
        onInit() {
            this.getView().setBusy(true)
            
            models.getProdutos()
                .then((data) => {
                    const oModel = new JSONModel(data)
                    this.getView().setModel(oModel, "produtosModel");
                }).finally(() => {
                    this.getView().setBusy(false)
                })
        },
        onItemPress: function (oEvent) {
            const oItem = oEvent.getParameter('listItem');
            const oContext = oItem.getBindingContext("produtosModel");
            const oData = oContext.getObject();
          
            MessageToast.show(`O item clicado '${oData.nome}' possui ${oData.quantidade} unidades`);
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