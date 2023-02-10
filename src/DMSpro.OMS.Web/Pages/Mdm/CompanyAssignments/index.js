var assignmentService = window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment;
var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
var userService = window.dMSpro.oMS.identityService.controllers.identityUsers.identityUserCustom

$(function () {
    var l = abp.localization.getResource("MdmService");
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
   
    var assignmentStore = new DevExpress.data.CustomStore({  
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            assignmentService.getListDevextremes(args)
                .done(result => {
                    result.data.forEach(x => x.companyName = "x");
                    
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        insert(values) {
            return assignmentService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return assignmentService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return assignmentService.delete(key);
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            assignmentService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var companyStore = new DevExpress.data.CustomStore({ 
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            debugger
            companyService.getListDevextremes(args)
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
            companyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });
    var userStore = new DevExpress.data.CustomStore({ 
        key: 'id',
        load: function (loadOptions) {
            var deferred = $.Deferred(),
                params = {};
            [
                "skip",
                "take",
                "sort",
                "filter",
                "searchExpr",
                "searchOperation",
                "searchValue",
                "group",
            ].forEach(function (i) {
                if (i in loadOptions && isNotEmpty(loadOptions[i]))
                    params[i] = JSON.stringify(loadOptions[i]);
            });
             
            userService.getListDevextremes(params)
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
            userService.getIdentityUser(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });
     
    
    var gridComAssignments = $('#dgComAssignments').dxDataGrid({
        dataSource: assignmentStore, 
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.CustomerAssignments.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerAssignments.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerAssignments.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        }, 
        remoteOperations: true,
        cacheEnabled: true,
        export: {
            enabled: true,
            // allowExportSelectedData: true,
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
        //focusedRowEnabled: true, 
        allowColumnReordering: true, 
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,

        columnMinWidth: 50,

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
            storageKey: 'dgCompanies',
        },
        paging: {
            enabled: true,
            pageSize: 10
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
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridComAssignments.addRow();
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
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'identityUserId',
                caption: l("UserName"),
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource() {
                        return {
                            store: userStore
                        };
                    },
                    displayExpr: 'userName',
                    valueExpr: 'id', 
                }
            },
            {
                dataField: 'companyId',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:CompanyName"),
                validationRules: [{ type: "required" }], 
                //cellTemplate(container, options) {
                //    $('<div>')
                //        .append($('<span>' + options.data.companyName + '</span>'))
                //        .appendTo(container);
                //},

                lookup: {
                    dataSource() {
                        return {
                            store: companyStore,
                            pageSize: 30,
                            paginate: true,
                            requireTotalCount: true  
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            }
        ],
        //onEditorPreparing: function (e) {
        //    if (e.dataField == "companyId" && e.parentType == "dataRow") {
        //        e.editorName = "dxDropDownBox";
        //        e.editorOptions.dropDownOptions = {
        //            //height: 500
        //        };
        //        e.editorOptions.contentTemplate = function (args, container) {
        //            var value = args.component.option("value"),
        //                $dataGrid = $("<div>").dxDataGrid({
        //                    width: '100%',
        //                    dataSource: companyStore,
        //                    //keyExpr: "id",
        //                    columns: [,
        //                        {
        //                            caption: "code",
        //                            dataField: "code"
        //                        }, {
        //                            caption: "Name",
        //                            dataField: "name"
        //                        }],
        //                    remoteOperations: true,
        //                    paging: {
        //                        enabled: true,
        //                        pageSize: 10
        //                    },
        //                    pager: {
        //                        visible: true,
        //                        showPageSizeSelector: true,
        //                        allowedPageSizes: [10, 20, 50, 100],
        //                        showInfo: true,
        //                        showNavigationButtons: true
        //                    }, 
        //                    hoverStateEnabled: true,
        //                    paging: { enabled: true, pageSize: 10 },
        //                    filterRow: { visible: true },
        //                    scrolling: { mode: "infinite" },
        //                    height: '90%',
        //                    showRowLines: true,
        //                    showBorders: true,
        //                    selection: { mode: "single" },
        //                    selectedRowKeys: value,
        //                    onSelectionChanged: function (selectedItems) {
        //                        var keys = selectedItems.selectedRowKeys;
        //                        args.component.option("value", keys);
        //                    }
        //                });

        //            var dataGrid = $dataGrid.dxDataGrid("instance");

        //            args.component.on("valueChanged", function (args) {
        //                var value = args.value;
        //                debugger
        //                dataGrid.selectRows(value, false);
        //                if (value != args.previousValue && value.length > 0) {
        //                    var items = dataGrid.getDataSource().items();
        //                    var obj = items.filter(x => x.id == value)[0];
        //                    e.component.cellValue(e.row.rowIndex, "companyId", value);
        //                    e.component.cellValue(e.row.rowIndex, "companyName", obj.name); 
        //                }
        //            });
        //            container.append($dataGrid);
        //            return container;
        //        };
        //    }
        //},
    }).dxDataGrid("instance");
     
});
