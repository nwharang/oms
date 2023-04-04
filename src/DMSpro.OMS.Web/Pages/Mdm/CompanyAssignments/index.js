var assignmentService = window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment;
var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
var userService = window.dMSpro.oMS.identityService.controllers.identityUsers.identityUserCustom;

$(function () {
    var l = abp.localization.getResource("OMS");

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
                    //console.log(result.data);
                    //result.data.forEach(x => x.companyName = "x");
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        insert(values) {
            return assignmentService.create({
                companyId: values.companyIdentityUserAssignment.companyId,
                identityUserId: values.companyIdentityUserAssignment.identityUserId,
            }, { contentType: "application/json" });
        },
        update(key, values) {
            // console.log(key);
            // console.log(values);
            return assignmentService.update(key.companyIdentityUserAssignment.id,
                {
                    companyId: values.companyIdentityUserAssignment.companyId,
                    identityUserId: values.companyIdentityUserAssignment.identityUserId
                }, { contentType: "application/json" });
        },
        remove(key) {

            return assignmentService.delete(key.companyIdentityUserAssignment.id);
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
        useDefaultSearch: true,
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
                    //console.log(result.data);
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
            console.log('byKey')
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
        useDefaultSearch: true,
        load: function (loadOptions) {
            var deferred = $.Deferred();
            const params = {};
            requestOptions.forEach(function (i) {
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
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        remoteOperations: true,
        //cacheEnabled: true,
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

        // stateStoring: { //save state in localStorage
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'dgComAssignments',
        // },
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
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
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
                fixedPosition: "left",
            },
            {
                dataField: 'companyIdentityUserAssignment.identityUserId',
                caption: l("UserName"),
                validationRules: [{ type: "required" }],
                allowSearch: false,
                calculateDisplayValue(rowData){
                    if (!rowData.identityUser || rowData.identityUser === null) return "";
                    return rowData.identityUser.userName;
                },
                lookup: {
                    dataSource() {
                        return {
                            store: userStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'userName',
                    valueExpr: 'id',
                    searchEnabled: true,
                    searchMode: 'contains',
                    minSearchLength: 2,
                    showDataBeforeSearch: true
                }
            },
            {
                dataField: 'companyIdentityUserAssignment.companyId',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:CompanyName"),
                validationRules: [{ type: "required" }],
                allowSearch: false,
                calculateDisplayValue(rowData){
                    if (rowData.company)
                        return rowData.company.name;
                    else return "";
                },
                lookup: {
                    dataSource: {
                        store: companyStore,
                        paginate: true,
                        pageSize: pageSizeForLookup,

                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                    searchEnabled: true,
                    searchMode: 'contains'
                }
            },
        ]
    }).dxDataGrid("instance");
    initImportPopup('api/mdm-service/company-identity-user-assignments', 'CompanyAssignments_Template', 'dgComAssignments');
});
