$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var priceUpdateService = window.dMSpro.oMS.mdmService.controllers.priceUpdates.priceUpdate;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;

    const requestOptions = [
        "filter",
        "group",
        "groupSummary",
        "parentIds",
        "requireGroupCount",
        "requireTotalCount",
        "searchExpr",
        "searchOperation",
        "searchValue",
        "select",
        "sort",
        "skip",
        "take",
        "totalSummary",
        "userData"
    ];

    /****custom store*****/
    var priceUpdateStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceUpdateService.getListDevextremes(args)
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
            priceUpdateService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return priceUpdateService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return priceUpdateService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return priceUpdateService.delete(key);
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
    //Grid Price Update
    const priceUpdateContainer = $('#priceUpdateContainer').dxDataGrid({
        dataSource: priceUpdateStore,
        remoteOperations: false,
        cacheEnabled: true,
        export: {
            enabled: true,
            // allowExportSelectedData: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('PriceUpdates');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PriceUpdates.xlsx');
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
            storageKey: 'priceUpdateContainer',
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.PriceUpdate")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                    onClick() {
                        var newtab = window.open('/Mdm/PriceUpdates/Details', '_blank');
                        newtab.sessionStorage.setItem("PriceUpdate", null);
                    },
                    visible: abp.auth.isGranted('MdmService.PriceUpdates.Create')
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
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                buttons: [
                    {
                        text: l1('Button.ViewDetail'),
                        icon: "fieldchooser",
                        onClick: function (e) {
                            var newtab = window.open('/Mdm/PriceUpdates/Details', '_blank');
                            newtab.sessionStorage.setItem("PriceUpdate", JSON.stringify(e.row.data));
                        }
                    }
                ],
                fixed: true,
                fixedPosition: "left",
                allowExporting: false,
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:Code'),
                dataField: 'code',
                dataType: 'string'
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:Description'),
                dataField: 'description',
                dataType: 'string'
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:PriceList'),
                dataField: 'priceListId',
                validationRules: [{ type: "required" }],
                lookup: {
                    //dataSource: priceListStore,
                    dataSource: {
                        store: priceListStore,
                        paginate: true,
                        pageSize: 10
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:EffectiveDate'),
                dataField: 'effectiveDate',
                dataType: 'datetime'
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:Status'),
                dataField: 'status',
                lookup: {
                    dataSource: statusStore,
                    displayExpr: 'text',
                    valueExpr: 'id'
                }
            }
        ]
    }).dxDataGrid("instance");

    /****button*****/

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});