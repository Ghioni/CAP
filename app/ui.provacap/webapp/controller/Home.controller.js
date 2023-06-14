sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
        'sap/ui/model/odata/v4/ODataModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,ODataModel) {
        "use strict";

        return Controller.extend("ui.provacap.controller.Home", {
            onInit: async function () {

                this.getView().setBusy(true);

                let oData1 = new sap.ui.model.json.JSONModel();
                let aData1 = await this._getHanaData("/DavidTabellaProva");
                oData1.setData(aData1);
                this.getView().setModel(oData1, "Prova");

                this.getView().setBusy(false);
            },

            _getHanaData: function (Entity, Filters, Sorters) {
                var xsoDataModelReport = this.getOwnerComponent().getModel();
                return new Promise(
                    function (resolve, reject) {
                        xsoDataModelReport.read(Entity, {
                            filters: Filters,
                            sorters: Sorters,
                            success: function (oDataIn, oResponse) {
                                resolve(oDataIn.results);
                            },
                            error: function (error) {
                                reject(console.log("error calling hana DB"))
                            }
                        });
                    });
            },
            onPressDelete: function(oEvent){
                var oModel = this.getView().getModel();
                var oLine = oEvent.getSource()
                                 .getBindingContext("Prova")
                                 .getObject();
           

            },
            onPressDialog: function(){

            },
            onPressEdit: function(){

            },
            onPressCreate: function(){

            }
        });
    });
