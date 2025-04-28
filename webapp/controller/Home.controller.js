sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast" 
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("studies.firstui5project.controller.Home", {
        onInit() {
        },
        onItemPress: function (oEvent) {
            const oItem = oEvent.getParameter('listItem'); // Retorna o elemento clicado (nesse exemplo: o item)
            
            MessageToast.show(`O item clicado '${oItem.getTitle()}' possui ${oItem.getCounter()} itens`);
        }
    });
});