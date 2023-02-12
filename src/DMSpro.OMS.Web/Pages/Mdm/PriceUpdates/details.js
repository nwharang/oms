$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var priceUpdateService = window.dMSpro.oMS.mdmService.controllers.priceUpdates.priceUpdate;
    var priceUpdateDetailService = window.dMSpro.oMS.mdmService.controllers.priceUpdateDetails.priceUpdateDetail;
    var priceListDetailService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    //get data from sessionStorage
    var PriceUpdateModel = JSON.parse(sessionStorage.getItem("PriceUpdate"));
    var stateMode = "home";
    var priceUpdateIdIdFilter = null;

    /****custom store*****/
    var priceUpdateDetailStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
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

            var d = new $.Deferred();
            priceListDetailService.get(key)
                .done(data => {
                    d.resolve(data);
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
                    dataSource: priceListStore,
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
        remoteOperations: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        errorRowEnabled: false,
        noDataText: l1('NoData'),
        filterRow: {
            visible: false
        },
        searchPanel: {
            visible: false
        },
        scrolling: {
            mode: 'standard'
        },
        paging: {
            enabled: true,
            pageSize: 20
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
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
        onInitNewRow(e) {
            //e.data.status = 'OPEN';
            e.data.priceUpdateId = PriceUpdateModel.id;
        },
        onRowUpdating: function (e) {
            //var objectRequire = ['code', 'description', 'priceListId', 'effectiveDate', 'status'];
            //for (var property in e.oldData) {
            //    if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
            //        e.newData[property] = e.oldData[property];
            //    }
            //}
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 100,
                buttons: ['edit']
            },
            //{
            //    caption: l('EntityFieldName:MDMService:PriceList:Code'),
            //    dataField: 'code',
            //},
            //{
            //    caption: l('EntityFieldName:MDMService:PriceList:Name'),
            //    dataField: 'name',
            //},
            //{
            //    caption: l('EntityFieldName:MDMService:PriceListDetail:Item'),
            //    dataField: 'itemId',
            //},
            {
                caption: l('EntityFieldName:MDMService:PriceListDetail:PriceList'),
                dataField: 'PriceListDetailId',
                lookup: {
                    dataSource: priceListDetailStore,
                    displayExpr: 'itemId',
                    valueExpr: 'id'
                },
                editCellTemplate: dropDownBoxPriceListDetailTemplate,
            },
            {
                caption: l1('EntityFieldName:MDMService:PriceListDetail:PriceBeforeUpdate'),
                dataField: 'priceBeforeUpdate'
            },
            {
                caption: l('EntityFieldName:MDMService:PriceListDetail:Price'),
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

    $("#NewPriceUpdateDetailButton").click(function (e) {
        e.preventDefault();
        priceUpdateDetailContainer.addRow();
    });

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }

    function dropDownBoxPriceListDetailTemplate(cellElement, cellInfo) {
        return $('<div>').dxDropDownBox({
            dropDownOptions: { width: 500 },
            dataSource: itemMasterStore,
            value: cellInfo.value,
            valueExpr: 'id',
            displayExpr(item) {
                return item && `${item.code} - ${item.name}`;
            },
            contentTemplate(e) {
                return $('<div>').dxDataGrid({
                    dataSource: itemMasterStore,
                    remoteOperations: true,
                    columns: ['code', 'name'],
                    hoverStateEnabled: true,
                    scrolling: { mode: 'virtual' },
                    height: 250,
                    selection: { mode: 'single' },
                    selectedRowKeys: [cellInfo.value],
                    focusedRowEnabled: true,
                    focusedRowKey: cellInfo.value,
                    onSelectionChanged(selectionChangedArgs) {
                        e.component.option('value', selectionChangedArgs.selectedRowKeys[0]);
                        cellInfo.setValue(selectionChangedArgs.selectedRowKeys[0]);
                        if (selectionChangedArgs.selectedRowKeys.length > 0) {
                            e.component.close();
                        }
                    },
                });
            },
        });
    }

    function LoadData() {
        PriceUpdateModel = JSON.parse(sessionStorage.getItem("PriceUpdate"));
        if (PriceUpdateModel == null) {
            stateMode = 'add';
            $('#NewPriceUpdateDetailButton, #CancelButton').prop('disabled', true);
        } else {
            stateMode = 'edit';
            priceUpdateIdIdFilter = PriceUpdateModel.id;

            if (PriceUpdateModel && PriceUpdateModel.status == 'CANCELLED') {
                priceUpdateForm.option('formData', PriceUpdateModel);
                priceUpdateForm.option('disabled', true);
                $('#SaveButton, #CancelButton, #NewPriceUpdateDetailButton').prop('disabled', true);
            } else {
                $('#SaveButton, #CancelButton, #NewPriceUpdateDetailButton').prop('disabled', false);
            }
        }
    }

    LoadData();
});
