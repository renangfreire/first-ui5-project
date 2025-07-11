sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "studies/firstui5project/model/models",
    "sap/m/GroupHeaderListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
     "sap/ui/core/Fragment",
    "studies/firstui5project/model/formatter"
], (Controller, MessageToast, JSONModel, models, GroupHeaderListItem, Filter, FilterOperator, Fragment, formatter) => {
    "use strict";

    return Controller.extend("studies.firstui5project.controller.Home", {
        formatter: formatter,
        onInit() {
            models.getProdutos().then((data) => {
                const oModel = new JSONModel(data)
                this.getView().setModel(oModel, "produtosModel");
            });
        },
        onItemPress: function (oEvent) {
            const oItem = oEvent.getParameter('listItem');
            const oContext = oItem.getBindingContext("produtosModel");
            const oData = oContext.getObject();
          
            MessageToast.show(`O item clicado '${oData.nome}' possui ${oData.quantidade} unidades`);
          },
        onAbrirDialogo: function () {
            const dialogName = 'DialogExemplo'
      
            if (!this[dialogName]) {
              this.criarDialog(dialogName);
            } else {
              this[dialogName].open();
            }
        },
        criarDialog: async function(sDialogName){
              const oView = this.getView()
          
              const oDialog = await Fragment.load({
                id: oView.getId(),
                name: `studies.firstui5project.view.fragments.${sDialogName}`,
                controller: this
              })
              
            oView.addDependent(oDialog);
            oDialog.open();
            
            this[sDialogName] = oDialog;
            
            return oDialog
        },
    
        onFecharDialogo: function (sDialogName) {
          this[sDialogName].close();
        },
      
        onConfirmar: function () {
          MessageToast.show("Confirmado!");

          this['DialogExemplo'].close();
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