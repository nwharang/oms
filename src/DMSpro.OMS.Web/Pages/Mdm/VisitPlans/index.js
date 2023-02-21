var visitPlansService = window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan;
var mcpHeaderService = window.dMSpro.oMS.mdmService.controllers.mCPHeaders.mCPHeader;
var itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;
var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
var mcpDetailsService = window.dMSpro.oMS.mdmService.controllers.mCPDetails.mCPDetail;
$(function () {
    var l = abp.localization.getResource("MdmService");

    const dayOfWeek = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:MONDAY')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:TUESDAY')
        },
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:WEDNESDAY')
        },
        {
            id: 3,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:THURSDAY')
        },
        {
            id: 4,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:FRIDAY')
        },
        {
            id: 5,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:SATURDAY')
        },
        {
            id: 6,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:SUNDAY')
        }
    ]

    var _lookupModal = new abp.ModalManager({
        viewUrl: abp.appPath + "Shared/LookupModal",
        scriptUrl: "/Pages/Shared/lookupModal.js",
        modalClass: "navigationPropertyLookup"
    });

    const visitPlansStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            visitPlansService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            visitPlansService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return visitPlansService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return visitPlansService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return visitPlansService.delete(key);
        }
    });

    const getMCPHeaders = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            mcpHeaderService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            mcpHeaderService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    const getItemGroup = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemGroupService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            itemGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    const getCustomer = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            customerService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    const getMCPDetails = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            mcpDetailsService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            mcpDetailsService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    var dgVisitPlans = $('#dgVisitPlans').dxDataGrid({
        dataSource: visitPlansStore,
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        selection: {
            mode: 'multiple',
        },
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
        columnMinWidth: 50,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        export: {
            enabled: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgVisitPlans',
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
            mode: "row",
            allowAdding: false,
            allowUpdating: abp.auth.isGranted('MdmService.VisitPlans.Edit'),
            allowDeleting: false,
            useIcons: true
        },
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        toolbar: {
            items: [
                "groupPanel",
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
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit'],
                width: 110,
                fixedPosition: 'left'
            },
            {
                dataField: 'routeId',
                caption: l("EntityFieldName:MDMService:VisitPlan:RouteCode"),
                dataType: 'string',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Route code is required'
                    }
                ]
            },
            {
                dataField: 'customerId',
                caption: l("EntityFieldName:MDMService:VisitPlan:CustomerCode"),
                validationRules: [
                    {
                        type: 'required',
                        message: 'Customer is required'
                    }
                ],
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getCustomer,
                    valueExpr: 'id',
                    displayExpr: function (e) {
                        return e.code + ' - ' + e.name
                    }
                }
            },
            {
                dataField: 'dateVisit',
                caption: l('EntityFieldName:MDMService:VisitPlan:DateVisit'),
                dataType: 'date',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Date visit is required'
                    }
                ]
            },
            {
                dataField: 'companyId',
                caption: l("EntityFieldName:MDMService:VisitPlan:CompanyCode"),
                validationRules: [
                    {
                        type: 'required',
                        message: 'Company is required'
                    }
                ],
                //editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getMCPHeaders,
                //    valueExpr: 'id',
                //    displayExpr: function (e) {
                //        return e.code + ' - ' + e.name
                //    }
                //}
            },
            {
                dataField: 'itemGroupId',
                caption: l('EntityFieldName:MDMService:VisitPlan:ItemGroup'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getItemGroup,
                    valueExpr: 'id',
                    displayExpr: function (e) {
                        return e.code + ' - ' + e.name
                    }
                }
            },
            {
                dataField: 'distance',
                caption: l('EntityFieldName:MDMService:VisitPlan:Distance'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Distance is required'
                    }
                ]
            },
            {
                dataField: 'visitOrder',
                caption: l('EntityFieldName:MDMService:VisitPlan:VisitOrder'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Visit Order is required'
                    }
                ],
                value: 0
            },
            {
                dataField: 'dateVisit',
                name: 'VisitPlan:Week',
                caption: l('EntityFieldName:MDMService:VisitPlan:Week'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Week is required'
                    }
                ]
            },
            {
                dataField: 'dateVisit',
                name: 'VisitPlan:Month',
                caption: l('EntityFieldName:MDMService:VisitPlan:Month'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Month is required'
                    }
                ]
            },
            {
                dataField: 'dateVisit',
                name: 'VisitPlan:Year',
                caption: l('EntityFieldName:MDMService:VisitPlan:Year'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Year is required'
                    }
                ]
            },
            {
                dataField: 'dayOfWeek',
                caption: l('EntityFieldName:MDMService:VisitPlan:DayOfWeek'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: dayOfWeek,
                    valueExpr: 'id',
                    displayExpr: 'text'
                }
            },
            {
                dataField: 'mcpDetailId',
                caption: l('MCP Detail'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getMCPDetails,
                    valueExpr: 'id',
                    displayExpr: 'code'
                }
            }
        ]
    }).dxDataGrid('instance');
});
