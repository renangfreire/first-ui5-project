sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "studies/firstui5project/model/models",
     "sap/ui/core/Fragment"
], (Controller, MessageToast, JSONModel, models, Fragment) => {
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
        }
    });
});