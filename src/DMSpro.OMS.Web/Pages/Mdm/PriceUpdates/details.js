$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var priceUpdateService = window.dMSpro.oMS.mdmService.controllers.priceUpdates.priceUpdate;
    var priceUpdateDetailService = window.dMSpro.oMS.mdmService.controllers.priceUpdateDetails.priceUpdateDetail;
    var priceListDetailService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;

    //get data from sessionStorage
    var PriceUpdateModel = JSON.parse(sessionStorage.getItem("PriceUpdate"));
    var stateMode = "home";

    /****custom store*****/
    var priceUpdateDetailStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {

            if (loadOptions.filter == undefined) {
                loadOptions.filter = ['priceUpdateId', '=', PriceUpdateModel ? PriceUpdateModel.id : null];
            } else {
                loadOptions.filter = [['priceUpdateId', '=', PriceUpdateModel ? PriceUpdateModel.id : null], 'and', loadOptions.filter];
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
        loadMode: 'raw',
        load(loadOptions) {
            loadOptions.filter = ['priceListDetail.priceListId', '=', PriceUpdateModel ? PriceUpdateModel.priceListId : null];
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

            var filter = JSON.stringify(['priceListDetail.id', '=', key]);

            var d = new $.Deferred();
            priceListDetailService.getListDevextremes({ filter: filter })
                .done(result => {
                    d.resolve(result.data);
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
            id: 'OPEN',
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:OPEN')
        },
        {
            id: 'CONFIRMED',
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:CONFIRMED')
        },
        {
            id: 'RELEASED',
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:RELEASED')
        },
        {
            id: 'CANCELLED',
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:CANCELLED')
        },
        {
            id: 'COMPLETED',
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:COMPLETED')
        },
        {
            id: 'FAILED',
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:FAILED')
        },
        {
            id: 'INCOMPLETED',
            text: l('EntityFieldValue:MDMService:PriceUpdate:Status:INCOMPLETED')
        }
    ];

    /****control*****/

    //Form - Price Update
    var priceUpdateForm = $('#priceUpdateForm').dxForm({
        formData: {
            code: PriceUpdateModel && PriceUpdateModel.code,
            description: PriceUpdateModel && PriceUpdateModel.description,
            priceListId: PriceUpdateModel && PriceUpdateModel.priceListId,
            effectiveDate: PriceUpdateModel && PriceUpdateModel.effectiveDate,
            status: PriceUpdateModel ? PriceUpdateModel.status : 'OPEN'
        },
        labelMode: "floating",
        colCount: 4,
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
                    //dataSource: priceListStore,
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
                    type: 'datetime'
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
                editorOptions: {
                    readOnly: true
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
        remoteOperations: false,
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
        //scrolling: {
        //    mode: 'standard'
        //},

        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'priceUpdateDetailContainer',
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
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        if (PriceUpdateModel != null)
                            priceUpdateDetailContainer.addRow();
                    }
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                    onClick() {
                        //todo
                    },
                },
                "searchPanel"
            ],
        },
        onInitNewRow(e) {
            if (PriceUpdateModel == null || (PriceUpdateModel && PriceUpdateModel.status == 'CANCELLED')) {
                window.setTimeout(function () { e.component.cancelEditData(); }, 0);
            }
            //e.data.status = 'OPEN';
            e.data.priceUpdateId = PriceUpdateModel.id;
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
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource() {
                        return {
                            store: priceListDetailStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr(data) {
                        if (data && data.item) {
                            return `${data.item.code} - ${data.item.name}`;
                        }
                        return null;
                    },
                    valueExpr: "priceListDetail.id"
                },
                setCellValue: function (rowData, value) {
                    rowData.priceListDetailId = value;

                    var filter = JSON.stringify(['priceListDetail.id', '=', value]);
                    var d = new $.Deferred();
                    priceListDetailService.getListDevextremes({ filter: filter })
                        .done(result => {
                            d.resolve(rowData.priceBeforeUpdate = result.data[0].priceListDetail.price);
                        });
                    return d.promise();
                }
            },
            {
                caption: l1('EntityFieldName:MDMService:PriceListDetail:PriceBeforeUpdate'),
                dataField: 'priceBeforeUpdate',
                allowEditing: false
            },
            {
                caption: l('EntityFieldName:MDMService:PriceListDetail:Price'),
                validationRules: [{ type: "required" }],
                dataField: 'newPrice',
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
            abp.message.warn(l1('WarnMessage.RequiredField'));
            return;
        }

        var data = priceUpdateForm.option('formData');

        if (stateMode == 'add') {
            priceUpdateService.create(data, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    priceUpdateIdIdFilter = result.id;
                    sessionStorage.setItem("PriceUpdate", JSON.stringify(result));
                    LoadData();
                })
                .fail(() => { });
        } else if (stateMode == 'edit') {
            priceUpdateService.update(PriceUpdateModel.id, data, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    sessionStorage.setItem("PriceUpdate", JSON.stringify(result));
                    LoadData();
                });
        }
    });

    /****button*****/
    $("#CloseButton").click(function (e) {
        e.preventDefault();

        abp.message.confirm(l1('ConfirmationMessage.UnSavedAndLeave'), l1('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
            if (confirmed) {
                window.close();
            }
        });
    });

    $("#CancelButton").click(function (e) {
        e.preventDefault();

        var dataForm = priceUpdateForm.option('formData');
        var data = {
            code: dataForm.code,
            description: dataForm.description,
            priceListId: dataForm.priceListId,
            effectiveDate: dataForm.effectiveDate,
            status: 'CANCELLED'
        };


        abp.message.confirm(l1('ConfirmationMessage.Cancel')).then(function (confirmed) {
            if (confirmed) {
                priceUpdateService.update(PriceUpdateModel.id, data, { contentType: "application/json" })
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
        PriceUpdateModel = JSON.parse(sessionStorage.getItem("PriceUpdate"));
        if (PriceUpdateModel == null) {
            stateMode = 'add';
            $('#CancelButton').prop('disabled', true);
        } else {
            stateMode = 'edit';
            priceUpdateIdIdFilter = PriceUpdateModel.id;

            if (PriceUpdateModel && PriceUpdateModel.status == 'CANCELLED') {
                priceUpdateForm.option('formData', PriceUpdateModel);
                priceUpdateForm.option('disabled', true);
                $('#SaveButton, #CancelButton').prop('disabled', true);
            } else {
                $('#SaveButton, #CancelButton').prop('disabled', false);
            }
        }
    }

    LoadData();
});
