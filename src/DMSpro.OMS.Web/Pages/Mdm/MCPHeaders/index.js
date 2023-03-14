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
                allowAdding: abp.auth.isGranted('MdmService.MCPs.Create'),
                // allowUpdating: abp.auth.isGranted('MdmService.MCPs.Edit'),
                allowDeleting: abp.auth.isGranted('MdmService.MCPs.Delete'),
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
                            w.sessionStorage.removeItem("MCPModel");
                        },
                    },
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
                    "searchPanel",
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
                    caption: l("EntityFieldName:MDMService:MCPHeader:CompanyName"),
                    dataField: "company.name",
                },
                {
                    caption: l("EntityFieldName:MDMService:MCPHeader:ItemGroup"),
                    dataField: "itemGroup.description",
                },
                {
                    caption: l("EntityFieldName:MDMService:MCPHeader:Code"),
                    dataField: "code"
                }, {
                    caption: l("EntityFieldName:MDMService:MCPHeader:Name"),
                    dataField: "name"
                }, {
                    caption: l("EntityFieldName:MDMService:MCPHeader:EffectiveDate"),
                    dataField: "effectiveDate",
                    format: "dd/MM/yyyy",
                    dataType: "date"
                }, {
                    caption: l("EntityFieldName:MDMService:MCPHeader:EndDate"),
                    dataField: "endDate",
                    format: "dd/MM/yyyy",
                    dataType: "date"
                }
            ],
        })

    initImportPopup('api/mdm-service/m-cPHeaders', 'MCPHeaders_Template', 'dgMCPHeaders'); 

});
