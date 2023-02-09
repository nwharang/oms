$(function () {
    var l = abp.localization.getResource("MdmService");
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
    var assignmentService = window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;

    var assignmentStore = new DevExpress.data.CustomStore({
        key: 'id', 
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
            assignmentService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var companyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            companyService.getListDevextremes(args)
                .done(result => { 
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        }
    });
    var userStore = new DevExpress.data.CustomStore({
        key: "ID",
        load: function (loadOptions) {
            var d = $.Deferred(),
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

            abp.ajax($.extend(true, {
                url:'https://webgw-dev.dmspro.vn/api/identity-user-service/identity-users/GetListDevextremes',
                type: 'GET'
            }, params)).done(result => {
                debugger
                d.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });;
            return d.promise();
        },
       
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
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
          stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'storage',
        },
        showBorders: true,
        columnAutoWidth: true,
        scrolling: {
            columnRenderingMode: 'virtual',
        },
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        allowColumnReordering: true,
        paging: {
            enabled: true,
            pageSize: 10
        },
        rowAlternationEnabled: true,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        headerFilter: {
            visible: false,
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
                {
                    location: 'before',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>${l("Button.New.Route")}</span></button>`,
                    onClick() {
                        gridRoutes.addRow();
                    },
                }, 
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-upload"></i> </button>`,
                    onClick() {
                        //todo
                    },
                },
                "searchPanel"
            ],
        },
        export: {
            enabled: true,
            allowExportSelectedData: true,
        }, groupPanel: {
            visible: true,
        },
        selection: {
            mode: 'single',
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
                    displayExpr: 'name',
                    valueExpr: 'id',
                    paginate: true,
                    pageSize: 10
                }
            },
            {
                dataField: 'companyId',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:CompanyName"),
                validationRules: [{ type: "required" }], 
                lookup: {
                    dataSource() {
                        return {
                            store: companyStore
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            }
        ],
    }).dxDataGrid("instance");
     
});
