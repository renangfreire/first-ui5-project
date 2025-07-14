sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "studies/firstui5project/model/models",
    "studies/firstui5project/model/formatter",
    "sap/ui/core/routing/History"
  ], (Controller, JSONModel, models, formatter, History) => {
    "use strict";
  
    return Controller.extend("studies.firstui5project.controller.Detalhes", {
        formatter: formatter,
        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("detalhes")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const sIndex = oEvent.getParameter("arguments").produtoIndex;
            
            this.getView().setBusy(true)
            models.getProdutos()
                .then((data) => {
                    const iIndex = Number(sIndex)
                    const oProduct = data?.produtos?.at(iIndex)
                    const oModel = new JSONModel(oProduct)
                    
                    this.getView().setModel(oModel, "produtoModel");
                }).finally(() => {
                    this.getView().setBusy(false)
                })
        },
        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPrevHash = oHistory.getPreviousHash();
            
            if (sPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent()
                .getRouter()
                .navTo("home", {}, true);
            }
        }
    });
  });