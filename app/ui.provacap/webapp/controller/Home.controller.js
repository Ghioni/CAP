sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/odata/v4/ODataModel',
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,ODataModel,Fragment,Dialog,MessageBox,MessageToast) {
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
                return new Promise(
                    function (resolve, reject) {
                        xsoDataModelReport.read(Entity, {
                            success: function (oDataIn) {
                                resolve(oDataIn.results);
                            },
                            error: function (error) {
                                reject(console.log(error))
                            }
                        });
                    });
            },
            onPressDelete: function(oEvent){
                const oModel = this.getView().getModel();
                let oLine = oEvent.getSource()
                                 .getBindingContext("Prova")
                                 .getObject();
                const sKey = oLine.Id; 
                console.log(sKey)
                let sPath = `/DavidTabellaProva(${sKey})`;  
                
                MessageBox.warning("Are you sure you want to delete?",{
                    actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                    onClose: function (sAction){
                        if (sAction == "OK"){
                            oModel.remove(sPath,{
                                success: function(){
                                    console.log("eliminated");
                                },
                                error: function(e){
                                    console.log(e)
                                }
                            })
                        }
                    }
                })

            },
            onPressCreateDialog: function(){
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                      name: "ui.provacap.view.fragments.createDialog",
                    });
                  }
                  this.pDialog.then(function (oDialog) {
                    oDialog.open();
                  });
            },
            closeOnPress: function(){
                    this.byId("createDialog").close();    
            },
            onPressCreate: function(){
                let modelloDati = this.getOwnerComponent().getModel();
                let oCreateForm = this.getView().getModel("formModel").getData();
                const sKey = oCreateForm.Id;
                const sName = oCreateForm.Name;
                const sDate = oCreateForm.Date;

                modelloDati.read("/DavidTabellaProva('" + sKey + "')",{
                    success: (oCreateForm, response)=>{
                        console.log(oCreateForm)
                        new sap.m.MessageToast.show("Enter a non-existent ID")
                    },
                    error: (e)=>{
                        console.log(e)
                        const oNewInsert ={
                            Id: parseInt(sKey),
                            Name: sName,
                            Date: sDate
                        };

                        modelloDati.create("/DavidTabellaProva", oNewInsert,{
                            success: async (oCreateForm,response)=>{
                                new sap.MessageToast.show("Insert success")
                                let oData = new sap.ui.model.json.JSONModel();
                                let aData = await this._getHanaData("/DavidTabellaProva");
                                oData.setData(aData);
                                this.getView().setModel(oData, "Prova");
                            },
                            error: async(e)=>{
                                new sap.MessageToast.show("Error during saving")
                            }
                            
                        });
                    }
                });
                oEvent.getSource().oParent.close();

            },
            RefreshDial: function (oEvent) {
                this.getView().getModel("FormModel").setData({});
                this.getView().getModel("FormModel").refresh();
                debugger
              },
            onPressEditDialog: function(){
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                      name: "ui.provacap.view.fragments.editDialog",
                    });
                  }
                  this.pDialog.then(function (oDialog) {
                    oDialog.open();
                  });
            },
            closeOnPressEdit: function(){
                    this.byId("editDialog").close();    
            },
            onPressGetObj: function(oEvent){
                var oLine = oEvent.getSource()
                                  .getBindingContext("Prova")
                                  .getObject();
                this.getView().setModel(new JSONModel(oLine), "editForm");

                this.onPressEditDialog(oLine);
            },
            onPressEdit: function(){
                let modelloDati = this.getOwnerComponent().getModel();
                    let oForm = this.getView().getModel("editForm").getData();
                    let sKey = oForm.Id;
                    let sPath = "/DavidTabellaProva('" + sKey + "')";
                    modelloDati.update(sPath,oForm,{
                
                        success: function(oDatain,oResponse){
                            console.lot(oResponse)
                        },
                        error: function(error){
                            debugger
                        }
                
                    })
            }
        });
    });
