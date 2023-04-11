var PriceUpdateId = sessionStorage.getItem('PriceUpdateId');
var PriceUpdateModel = [];

$(function () {
    var l = abp.localization.getResource("OMS");
    var priceUpdateService = window.dMSpro.oMS.mdmService.controllers.priceUpdates.priceUpdate;
    var priceUpdateDetailService = window.dMSpro.oMS.mdmService.controllers.priceUpdateDetails.priceUpdateDetail;
    var priceListDetailService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;

    var previousCode = "";
    var previousDescription = "";
    var previousPriceListId = "";
    var previousEffectiveDate = "";

    /****custom store*****/
    var priceUpdateDetailStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {

            if (loadOptions.filter == undefined) {
                loadOptions.filter = ['priceUpdateId', '=', PriceUpdateId];
            } else {
                loadOptions.filter = [['priceUpdateId', '=', PriceUpdateId], 'and', loadOptions.filter];
            }

            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceUpdateDetailService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            priceUpdateDetailService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return priceUpdateDetailService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return priceUpdateDetailService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return priceUpdateDetailService.delete(key);
        }
    });

    var priceListDetailStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            //loadOptions.filter = ['priceListDetail.priceListId', '=', PriceUpdateModel ? PriceUpdateModel.priceListId : null];
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceListDetailService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            //var d = new $.Deferred();
            //priceListDetailService.get(key)
            //    .done(data => {
            //        d.resolve(data);
            //    });
            //return d.promise();

            var d = new $.Deferred();
            priceListDetailService.getListDevextremes({ filter: JSON.stringify(['id', '=', key]) })
                .done(result => {
                    d.resolve(result.data[0]);
                });
            return d.promise();
        }
    });

    var priceListStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceListService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return priceListService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return priceListService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return priceListService.delete(key);
        }
    });

    var itemMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            itemMasterService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            itemMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    })

    const statusStore = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:OPEN')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:CONFIRMED')
        },
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:RELEASED')
        },
        {
            id: 3,
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:CANCELLED')
        },
        {
            id: 4,
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:COMPLETED')
        },
        {
            id: 5,
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:FAILED')
        },
        {
            id: 6,
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:INCOMPLETED')
        }
    ];

    /****control*****/

    //Form - Price Update
    var priceUpdateForm = $('#priceUpdateForm').dxForm({
        formData: PriceUpdateModel,
        labelMode: "floating",
        colCount: 5,
        items: [
            {
                dataField: "code",
                label: {
                    visible: false,
                    text: l('EntityFieldName:MDMService:PriceUpdate:Code')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "description",
                label: {
                    visible: false,
                    text: l('EntityFieldName:MDMService:PriceUpdate:Description')
                }
            },
            {
                dataField: "priceListId",
                editorType: 'dxSelectBox',
                label: {
                    visible: false,
                    text: l('EntityFieldName:MDMService:PriceUpdate:PriceList')
                },
                editorOptions: {
                    dataSource: {
                        store: priceListStore,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "effectiveDate",
                editorType: 'dxDateBox',
                label: {
                    visible: false,
                    text: l('EntityFieldName:MDMService:PriceUpdate:EffectiveDate')
                },
                editorOptions: {
                    type: 'datetime',
                    /*min: new Date()*/
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "status",
                label: {
                    visible: false,
                    text: l('EntityFieldName:MDMService:PriceUpdate:Status')
                },
                editorType: 'dxSelectBox',
                editorOptions: {
                    readOnly: true,
                    dataSource: statusStore,
                    displayExpr: 'text',
                    valueExpr: 'id'
                },
                validationRules: [{
                    type: 'required',
                }]
            }
        ]
    }).dxForm('instance');

    //DataGrid - Price Update Detail
    var priceUpdateDetailContainer = $('#priceUpdateDetailContainer').dxDataGrid({
        dataSource: priceUpdateDetailStore,
        remoteOperations: true,
        export: {
            enabled: true,
            // allowExportSelectedData: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('PriceUpdatesDetail');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PriceUpdatesDetail.xlsx');
                });
            });
            e.cancel = true;
        },
        showRowLines: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        groupPanel: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        rowAlternationEnabled: true,
        searchPanel: {
            visible: true
        },
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        editing: {
            mode: 'row',
            allowAdding: abp.auth.isGranted('MdmService.PriceUpdateDetails.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.PriceUpdateDetails.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.PriceUpdateDetails.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        toolbar: {
            items: [
                //"groupPanel",
                "addRowButton",
                //'columnChooserButton',
                //"exportButton",
                // {
                //     location: 'after',
                //     widget: 'dxButton',
                //     options: {
                //         icon: "import",
                //         elementAttr: {
                //             class: "import-excel",
                //         },
                //         onClick(e) {
                //             var gridControl = e.element.closest('div.dx-datagrid').parent();
                //             var gridName = gridControl.attr('id');
                //             var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //             if (popup) popup.show();
                //         },
                //     }
                // },
                // "searchPanel"
            ],
        },
        onInitNewRow(e) {
            if (PriceUpdateModel == null || (PriceUpdateModel && PriceUpdateModel.status == 3)) {
                window.setTimeout(function () { e.component.cancelEditData(); }, 0);
            }
            //e.data.status = 'OPEN';
            e.data.priceUpdateId = PriceUpdateId;
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 100,
                buttons: ['edit'],
                fixed: true,
                fixedPosition: "left",
                allowExporting: false,
            },
            {
                caption: l('EntityFieldName:MDMService:PriceListDetail:PriceList'),
                dataField: 'priceListDetailId',
                /*calculateDisplayValue: "item.name",*/
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource() {
                        return {
                            store: priceListDetailStore,
                            paginate: true,
                            pageSize: pageSizeForLookup,
                            filter: ['', '', price], //thanhhq
                        };
                    },
                    displayExpr(data) {
                        if (data && data.item) {
                            return `${data.item.code} - ${data.item.name}`;
                        }
                        return null;
                    },
                    valueExpr: "id"
                },
                setCellValue: function (newData, value, currentData) {
                    newData.priceListDetailId = value;

                    var d = new $.Deferred();
                    priceListDetailService.getListDevextremes({ filter: JSON.stringify(['id', '=', value]) })
                        .done(result => {
                            d.resolve(newData.priceBeforeUpdate = result.data[0].price);
                        });
                    return d.promise();
                },
                minWidth: 200
            },
            {
                caption: l('EntityFieldName:MDMService:PriceListDetail:PriceBeforeUpdate'),
                dataField: 'priceBeforeUpdate',
                dataType: 'number',
                format: ",##0.###",
                allowEditing: false,
                width: 200
            },
            {
                caption: l('EntityFieldName:MDMService:PriceListDetail:Price'),
                validationRules: [{ type: "required" }],
                dataField: 'newPrice',
                dataType: 'number',
                format: ",##0.###",
                editorOptions: {
                    format: '#,##0.##',
                },
                width: 200
            },
            {
                dataField: 'priceUpdateId',
                visible: false
            },
        ]
    }).dxDataGrid("instance");


    /****event*****/
    $("#form-container").on("submit", function (e) {
        e.preventDefault();

        if (!priceUpdateForm.validate().isValid) {
            abp.message.warn(l('WarnMessage.RequiredField'));
            return;
        }

        var data = priceUpdateForm.option('formData');

        if (PriceUpdateId == null) {
            priceUpdateService.create(data, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    PriceUpdateId = result.id;
                    PriceUpdateModel = result;
                    LoadData();
                })
                .fail(() => { });
        } else {
            priceUpdateService.update(PriceUpdateId, data, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    PriceUpdateModel = result;
                    LoadData();
                });
        }
    });

    /****button*****/
    $("#CloseButton").click(function (e) {
        e.preventDefault();

        if (previousCode != PriceUpdateModel.code || previousDescription != PriceUpdateModel.description || previousPriceListId != PriceUpdateModel.priceListId || previousEffectiveDate != PriceUpdateModel.effectiveDate) {
            abp.message.confirm(l('ConfirmationMessage.UnSavedAndLeave'), l('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
                if (confirmed) {
                    window.close();
                }
            });
        } else {
            window.close();
        }
    });

    $("#CancelButton").click(function (e) {
        e.preventDefault();

        var dataForm = priceUpdateForm.option('formData');

        dataForm.status = 3;

        abp.message.confirm(l('ConfirmationMessage.Cancel')).then(function (confirmed) {
            if (confirmed) {
                priceUpdateService.update(PriceUpdateModel.id, dataForm, { contentType: "application/json" })
                    .done(result => {
                        abp.message.success(l('Congratulations'));
                        sessionStorage.setItem("PriceUpdate", JSON.stringify(result));
                        LoadData();
                    });
            }
        });
    });

    /****function*****/
    function LoadData() {
        priceUpdateDetailContainer.option("editing.allowAdding", false);
        if (PriceUpdateId != null) {
            priceUpdateService.get(PriceUpdateId, { contentType: "application/json" })
                .done(result => {
                    previousCode = result.code;
                    previousDescription = result.description;
                    previousPriceListId = result.priceListId;
                    previousEffectiveDate = result.effectiveDate;

                    PriceUpdateModel = result;
                    priceUpdateForm.option('formData', PriceUpdateModel);

                    if (PriceUpdateModel.status == 3) {
                        priceUpdateForm.option('disabled', true);
                        priceUpdateDetailContainer.option("editing.allowUpdating", false);
                        $('#SaveButton, #CancelButton').prop('disabled', true);
                    } else {
                        priceUpdateDetailContainer.option("editing.allowAdding", true);
                        $('#SaveButton, #CancelButton').prop('disabled', false);
                    }
                });
        } else {
            priceUpdateForm.option('formData', { status: 0 });
            $('#CancelButton').prop('disabled', true);
        }
    }

    LoadData();

    initImportPopup('api/mdm-service/price-update-details', 'PriceUpdateScheduleDetails_Template', 'priceUpdateDetailContainer');
});
