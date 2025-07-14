sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "studies/firstui5project/model/models",
    "sap/m/GroupHeaderListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "studies/firstui5project/model/formatter"
], (Controller, MessageToast, MessageBox, JSONModel, models, GroupHeaderListItem, Filter, FilterOperator, Fragment, formatter) => {
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
        onAbrirDialogo: function (sDialogName) {
            if (!this[sDialogName]) {
              this.criarDialog(sDialogName);
            } else {
              this[sDialogName].open();
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
        }, 

        onCreateProduct: function(){
          const oData = {
            data: {},
            mode: 'CREATE'
          }
          
          const oModel = new JSONModel(oData)
          
          this.getView().setModel(oModel, "managedProduct");

          this.onAbrirDialogo('ProdutoDialog')
        },

        onEditProduct: function (oEvent) {
          const oItem = oEvent.getSource() // Dessa vez o item está no GetSource, pode ser que mude conforme o Evento
          const oContext = oItem.getBindingContext("produtosModel");
          const data = oContext.getObject();

          // Sempre tire a referencia do Objeto antes: o UI5 tem uma importação chamada deepClone ou faça a abaixo:
          const dataClone = JSON.parse(JSON.stringify(data))

          const oData = {
            mode: "EDIT",
            data: dataClone,
            path: oContext.getPath()
          }

          const oModel = new JSONModel(oData)
        
          this.getView().setModel(oModel, "managedProduct");
        
          this.onAbrirDialogo('ProdutoDialog');
        },

        onSalvarProduto: function () {
          const oManagedProductModel = this.getView().getModel("managedProduct");
          const oProdutosModel = this.getView().getModel("produtosModel");

          const oProduto = oManagedProductModel.getProperty("/data");
          const sMode = oManagedProductModel.getProperty('/mode')

          const oProductData = {
            ...oProduto,
            preco: Number(oProduto.preco),
            disponivel: oProduto.quantidade > 5,
            status: oProduto.quantidade > 0 ? 'ACTIVE' : 'PENDING'
          }

          if (sMode === 'EDIT') {
            // Edição
            const sProductPath = oManagedProductModel.getProperty("/path");
            oProdutosModel.setProperty(sProductPath, oProductData);

            MessageToast.show("Produto atualizado!");
          } else {
            // Criação
            const aProdutos = oProdutosModel.getProperty("/produtos");
            
            aProdutos.push(oProductData);

            oProdutosModel.setProperty("/produtos", aProdutos);

            MessageToast.show("Produto criado!");
          }
        
          this.onFecharDialogo('ProdutoDialog');
        },

        onExcluirProduto: function () {
          const oManagedProduct = this.getView().getModel("managedProduct");
          const oProdutosModel = this.getView().getModel("produtosModel");
          const sPath = oManagedProduct.getProperty("/path")
        
          MessageBox.confirm("Tem certeza que deseja excluir?", {
            onClose: (sResposta) => {
              if (sResposta === MessageBox.Action.OK) {
                const aProdutos = oProdutosModel.getProperty("/produtos");
                const iIndex = parseInt(sPath.split("/").pop());
                aProdutos.splice(iIndex, 1);
                
                oProdutosModel.setProperty("/produtos", aProdutos);
                MessageToast.show("Produto excluído!");

                this.onFecharDialogo('ProdutoDialog');
              }
            }
          });
        }
    });
});