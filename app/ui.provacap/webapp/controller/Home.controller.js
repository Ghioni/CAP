sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    ODataModel,
    Fragment,
    Dialog,
    MessageBox,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("ui.provacap.controller.Home", {
      onInit: async function () {
        this.getView().setBusy(true);

        let oData = new sap.ui.model.json.JSONModel();
        let aData = await this._getHanaData("/DavidTabellaProva");
        oData.setData(aData);
        this.getView().setModel(oData, "Prova");

        this.getView().setBusy(false);
      },

      _getHanaData: function (Entity) {
        var xsoDataModelReport = this.getOwnerComponent().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.read(Entity, {
            success: function (oDataIn) {
              resolve(oDataIn.results);
            },
            error: function (error) {
              reject(console.log(error));
            },
          });
        });
      },
      onPressDelete: function (oEvent) {
        const oModel = this.getView().getModel();
        let oLine = oEvent.getSource().getBindingContext("Prova").getObject();
        const sKey = oLine.Id;
        console.log(sKey);
        let sPath = `/DavidTabellaProva(${sKey})`;

        MessageBox.warning("Are you sure you want to delete?", {
          actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
          onClose: async (sAction) => {
            if (sAction == "OK") {
              oModel.remove(sPath, {
                success: async () => {
                  console.log("eliminated");
                  let oData = new sap.ui.model.json.JSONModel();
                  let aData = await this._getHanaData("/DavidTabellaProva");
                  oData.setData(aData);
                  this.getView().setModel(oData, "Prova");
                },
                error: async (e) => {
                  console.log(e);
                  alert("Error in the deleting progress")
                },
              });
            }
          },
        });
      },
      onPressCreateDialog: function () {
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "ui.provacap.view.fragments.createDialog",
          });
        }
        this.pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      closeOnPress: function () {
        this.byId("createDialog").close();
      },
      onPressCreate: function (oEvent) {
        let modelloDati = this.getOwnerComponent().getModel();
        let oCreateForm = this.getView().getModel("formModel").getData();
        const sKey = oCreateForm.Id;
        const sName = oCreateForm.Name;

            const oNewInsert = {
                  Id: parseInt(sKey),
                  Name: sName,
                };

        modelloDati.create("/DavidTabellaProva", oNewInsert, {
            success: async (oCreateForm, response) => {
                MessageToast.show("New entry created")
              let oData = new sap.ui.model.json.JSONModel();
              let aData = await this._getHanaData("/DavidTabellaProva");
              oData.setData(aData);
              this.getView().setModel(oData, "Prova");
            },
            error: async (e) => {
              console.log(e);
              const msg = "Error in the creation. Enter a non-existent ID";
            //   alert(msg);
              MessageToast.show(msg);
            },
          })

      },
      onPressEditDialog: function () {
        if (!this.pDialog2) {
          this.pDialog2 = this.loadFragment({
            name: "ui.provacap.view.fragments.editDialog",
          });
        }
        this.pDialog2.then(function (oDialog2) {
          oDialog2.open();
        });
      },
      closeOnPressEdit: function () {
        this.byId("editDialog").close();
      },
      onPressGetObj: function (oEvent) {
        var oLine = oEvent.getSource().getBindingContext("Prova").getObject();
        this.getView().setModel(new JSONModel(oLine), "editForm");

        this.onPressEditDialog(oLine);
      },
      onPressEdit: function () {
        let modelloDati = this.getOwnerComponent().getModel();
        let oForm = this.getView().getModel("editForm").getData();
        let sKey = oForm.Id;
        let sName = oForm.Name;

        let oNewData = {
            Name: sName
        };

        modelloDati.update("/DavidTabellaProva(" + sKey + ")", oNewData,{
            success: async (oD,response)=>{
                let oData = new sap.ui.model.json.JSONModel();
                let aData = await this._getHanaData("/DavidTabellaProva");
                oData.setData(aData);
                this.getView().setModel(oData, "Prova");
            },
            error: async (e)=>{
                alert(e)
            }
        })
        
      },
    });
  }
);
