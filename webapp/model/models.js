sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/odata/v2/ODataModel"
], 
function (JSONModel, Device, ODataModel) {
    "use strict";

    return {
        init(oComponent) {
            this._oComponent = oComponent 
        },
        getOwnerComponent(){
            return this._oComponent
        },
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        getOModelData: function() {
            const sURI = this.getOwnerComponent().getManifestObject().resolveUri("northwind/northwind.svc/")

            const oModel = new ODataModel(sURI)

            return new Promise(function(resolve, reject) {
                oModel.attachMetadataLoaded(() => {
                    resolve(oModel)
                })

                oModel.attachMetadataFailed(() => {
                    reject("Serviço indisponível")
                })
            })
        },
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        getProdutos: async function(){
            const oModel = await this.getOModelData()

            return new Promise(async (resolve, reject) => {
                await oModel.read("/Products", {
                    urlParameters: {
                        $filter: 'UnitPrice gt 20'
                    },
                    success: (oData) => {
                      resolve(oData.results)
                    },
                    error: (error) => {
                      MessageToast.show("Erro ao carregar dados.");
                      reject(error)
                    }
                });
            })
        },
        getProduto: async function(sID){
            const oModel = await this.getOModelData()

            return new Promise(async (resolve, reject) => {
                await oModel.read(`/Products(${sID})`, {
                    success: (oData) => {
                      resolve(oData)
                    },
                    error: (error) => {
                      MessageToast.show("Erro ao carregar dados.");
                      reject(error)
                    }
                });
            })
        }
    };

});