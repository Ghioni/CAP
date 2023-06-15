sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    MessageBox,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("ui.provacap.controller.Home", {
      onInit: async function () {
        this.getView().setBusy(true);

        const oData = new sap.ui.model.json.JSONModel();
        const aData = await this._getHanaData("/DavidTabellaProva");
        oData.setData(aData);
        this.getView().setModel(oData, "Prova");

        this.getView().setBusy(false);
      },

      _getHanaData: function (Entity) {
        const xsoDataModelReport = this.getOwnerComponent().getModel();
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
                  const oData = new sap.ui.model.json.JSONModel();
                  const aData = await this._getHanaData("/DavidTabellaProva");
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
              const oData = new sap.ui.model.json.JSONModel();
              const aData = await this._getHanaData("/DavidTabellaProva");
              oData.setData(aData);
              this.getView().setModel(oData, "Prova");
            },
            error: async (e) => {
              console.log(e);
              const msg = "Error in the creation. Enter a non-existent ID";
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
        const oLine = oEvent.getSource().getBindingContext("Prova").getObject();
        this.getView().setModel(new JSONModel(oLine), "editForm");

        this.onPressEditDialog(oLine);
      },
      onPressEdit: function () {
        const modelloDati = this.getOwnerComponent().getModel();
        const oForm = this.getView().getModel("editForm").getData();
        const sKey = oForm.Id;
        const sName = oForm.Name;

        const oNewData = {
            Name: sName
        };

        modelloDati.update("/DavidTabellaProva(" + sKey + ")", oNewData,{
            success: async (oD,response)=>{
                const oData = new sap.ui.model.json.JSONModel();
                const aData = await this._getHanaData("/DavidTabellaProva");
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
