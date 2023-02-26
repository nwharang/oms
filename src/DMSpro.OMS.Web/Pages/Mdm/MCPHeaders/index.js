var l = abp.localization.getResource("MdmService");
$(function () {
    var mCPHeaderService = window.dMSpro.oMS.mdmService.controllers.mCPHeaders.mCPHeader;
     
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;

    var salesOrgHierarchyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) { 
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
             
            salesOrgHierarchyService.getListDevextremes(args)
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
            salesOrgHierarchyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesOrgHierarchyService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesOrgHierarchyService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesOrgHierarchyService.delete(key);
        }
    });
    var mCPHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) { 
            const deferred = $.Deferred(); 
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            mCPHeaderService.getListDevextremes(args)
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
            mCPHeaderService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }, 
        remove(key) {
            return mCPHeaderService.delete(key);
        }
    });

    var dgMCPHeaders = $('#dgMCPHeaders')
        .dxDataGrid({
            dataSource: mCPHeaderStore,
            editing: {
                mode: "row",
                allowAdding: true,
                allowUpdating: true,
                //allowDeleting: true,
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                    deleteRow: l("Delete"),
                    confirmDeleteMessage: l("DeleteConfirmationMessage")
                }
            },
            remoteOperations: true,
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
            showRowLines: true,
            showBorders: true,
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
            stateStoring: { //save state in localStorage
                enabled: true,
                type: 'localStorage',
                storageKey: 'dgMCPHeaders',
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
            toolbar: {
                items: [
                    "groupPanel",
                    {
                        location: 'after',
                        template: '<button  id="AddNewButton" type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                        onClick() {
                            var w = window.open('/Mdm/MCPHeaders/Details', '_blank');
                            //w.sessionStorage.setItem("MCPModel", null);
                        },
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
                    type: 'buttons',
                    caption: l("Actions"),
                    width: 110,
                    buttons: [{
                        text: "Edit",
                        icon: "edit",
                        hint: "Edit",
                        onClick: function (e) {
                            var w = window.open('/Mdm/MCPHeaders/Details', '_blank');
                            w.sessionStorage.setItem("MCPModel", JSON.stringify(e.row.data));
                        }
                    }, 'delete'],
                    fixedPosition: "left",
                },
                {
                    caption: "Route",
                    dataField: "routeId",
                    lookup: {
                        dataSource() {
                            return {
                                store: salesOrgHierarchyStore,
                                paginate: true,
                                pageSize: pageSizeForLookup
                            };
                        },
                        displayExpr: 'name',
                        valueExpr: 'id',
                        searchEnabled: true,
                        searchMode: 'contains',
                        minSearchLength: 2,
                        showDataBeforeSearch: true
                    }
                },
                {
                    caption: "Company",
                    dataField: "company.name",
                },
                {
                    caption: "Item Group",
                    dataField: "itemGroup.description",
                },
                {
                    caption: "Code",
                    dataField: "code"
                }, {
                    caption: "Name",
                    dataField: "name"
                }, {
                    caption: "Effective Date",
                    dataField: "effectiveDate",
                    format: "dd/MM/yyyy",
                    dataType: "date"
                }, {
                    caption: "End Date",
                    dataField: "endDate",
                    format: "dd/MM/yyyy",
                    dataType: "date"
                } 
            ],
        })
});

var dataSource = [
    {
        id: 1,
        outletId: "C001",
        outletName: "Cửa hàng A2",
        address: "Quận 2, Hồ Chí Minh",
        effectiveDate: "01/01/2023",
        endDate: "02/11/2023",
        distance: 100,
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true,
        Week1: true,
        Week2: true,
        Week3: true,
        Week4: true,
    },
    {
        id: 2,
        outletId: "C002",
        outletName: "Cửa hàng A2",
        address: "Quận 2, Hồ Chí Minh",
        effectiveDate: "10/01/2023",
        endDate: "12/11/2023",
        distance: 100,
        Monday: true,
        Tuesday: true,
        Wednesday: false,
        Thursday: false,
        Friday: true,
        Saturday: true,
        Sunday: true,
        Week1: true,
        Week2: false,
        Week3: false,
        Week4: true,
    },
    {
        id: 3,
        outletId: "C003",
        outletName: "Cửa hàng A3",
        address: "Quận 4, Hồ Chí Minh",
        effectiveDate: "15/01/2023",
        endDate: "15/11/2023",
        distance: 400,
        Monday: false,
        Tuesday: false,
        Wednesday: true,
        Thursday: true,
        Friday: false,
        Saturday: false,
        Sunday: false,
        Week1: true,
        Week2: false,
        Week3: false,
        Week4: false,
    }
];