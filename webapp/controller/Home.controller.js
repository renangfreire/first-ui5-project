sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "studies/firstui5project/model/models"
], (Controller, MessageToast, JSONModel, models) => {
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
        }
    });
});