$(function () {
    let l = abp.localization.getResource("OMS");
    let companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    let geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    let geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const argsGeo = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    argsGeo[i] = JSON.stringify(loadOptions[i]);
                }
            });
            geoMasterService.getListDevextremes(argsGeo)
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

            let d = new $.Deferred();
            geoMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    });

    const customStore = new DevExpress.data.CustomStore({
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
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            companyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return companyService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return companyService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return companyService.delete(key);
        }
    });

    const gridCompanies = $('#dgCompanies').dxDataGrid({
        dataSource: customStore,
        remoteOperations: true,
        repaintChangesOnly: true,
        showColumnLines: true,
        showRowLines: false,
        rowAlternationEnabled: true,
        showBorders: true,
        dateSerializationFormat: "yyyy-MM-dd",
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Companies');
            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${name || "Exports"}.xlsx`);
                });
            });
            e.cancel = true;
        },
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
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        editing: {
            mode: "popup",
            allowAdding: abp.auth.isGranted('MdmService.CompanyMasters.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CompanyMasters.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CompanyMasters.Delete'),
            useIcons: true,
            popup: {
                title: l("Page:Title:CompanyProfiles"),
                showTitle: true,
                width: "95%",
                dragEnabled: false
            },
            form: {
                labelMode: "outside",
                colCount: 2,
                items: [
                    'code',
                    'name',
                    'geoLevel0Id',
                    'geoLevel1Id',
                    'geoLevel2Id',
                    'geoLevel3Id',
                    'geoLevel4Id',
                    'street',
                    'address',
                    'phone',
                    'license',
                    'taxCode',
                    'erpCode',
                    'parentId',
                    'vatName',
                    'vatAddress',
                    'effectiveDate',
                    'endDate',
                    'latitude',
                    'longitude',
                    'contactName',
                    'contactPhone',
                ]
            },
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
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
                buttons: ['edit', 'delete'],
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
                formItem: {
                    visible: false
                },
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Code"),
                dataType: 'string',
                fixed: true,
                fixedPosition: "left",
                editorOptions: {
                    maxLength: 20,
                },
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ]
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Name"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: "geoLevel0Id",
                caption: l("GeoLevel0Name"),
                dataType: 'string',
                calculateDisplayValue: (rowData) => {
                    if (rowData?.geoLevel0)
                        return rowData.geoLevel0.name;
                    return;
                },
                calculateSortValue: 'geoLevel0.name',
                width: 110,
                lookup: {
                    dataSource: {
                        store: geoMasterStore,
                        filter: ['level', '=', 0],
                        paginate: true,
                        pageSize
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel0Id = value;
                    rowData.geoLevel1Id = null;
                    rowData.geoLevel2Id = null;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
            },
            {
                dataField: "geoLevel1Id",
                caption: l("GeoLevel1Name"),
                dataType: 'string',
                calculateDisplayValue: (rowData) => {
                    if (rowData?.geoLevel1)
                        return rowData.geoLevel1.name;
                    return
                },
                calculateSortValue: 'geoLevel1.name',
                width: 110,
                lookup: {
                    dataSource: (options) => {
                        return {
                            store: geoMasterStore,
                            filter: options?.data ? [['level', '=', 1], 'and', ['parentId', '=', options.data.geoLevel0Id]] : ['level', '=', 1],
                            paginate: true,
                            pageSize
                        }
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel1Id = value;
                    rowData.geoLevel2Id = null;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
            },
            {
                dataField: "geoLevel2Id",
                caption: l("GeoLevel2Name"),
                dataType: 'string',
                calculateDisplayValue: (rowData) => {
                    if (rowData?.geoLevel2)
                        return rowData.geoLevel2.name;
                    return;
                },
                calculateSortValue: 'geoLevel2.name',
                width: 110,
                lookup: {
                    dataSource: (options) => {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 2], 'and', ['parentId', '=', options.data.geoLevel1Id]] : ['level', '=', 2],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel2Id = value;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
            },
            {
                dataField: "geoLevel3Id",
                caption: l("GeoLevel3Name"),
                dataType: 'string',
                calculateDisplayValue: (rowData) => {
                    if (rowData?.geoLevel3)
                        return rowData.geoLevel3.name;
                    return;
                },
                calculateSortValue: 'geoLevel3.name',
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 3], 'and', ['parentId', '=', options.data.geoLevel2Id]] : ['level', '=', 3],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel3Id = value;
                    rowData.geoLevel4Id = null;
                },
            },
            {
                dataField: "geoLevel4Id",
                caption: l("GeoLevel4Name"),
                dataType: 'string',
                calculateDisplayValue: (rowData) => {
                    if (rowData.geoLevel4)
                        return rowData.geoLevel4.name;
                    return;
                },
                calculateSortValue: 'geoLevel4.name',
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 4], 'and', ['parentId', '=', options.data.geoLevel3Id]] : ['level', '=', 4],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel4Id = value;
                },
            },

            //#region 
            {
                dataField: 'street',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Street"),
                dataType: 'string',
            },
            {
                dataField: 'address',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Address"),
                dataType: 'string',
            },
            {
                dataField: 'phone',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Phone"),
                //width: 110,
                dataType: 'string',
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{10}$',
                        message: l('ValidateError:Phone')
                    }
                ]
            },
            {
                dataField: 'license',
                caption: l("EntityFieldName:MDMService:CompanyProfile:License"),
                dataType: 'string',
                visible: false,
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]$',
                        message: l('ValidateError:Code')
                    }
                ]
            },
            {
                dataField: 'taxCode',
                caption: l("EntityFieldName:MDMService:CompanyProfile:TaxCode"),
                //width: 90,
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'erpCode',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ERPCode"),
                //width: 80,
                dataType: 'string',
                visible: false,
                editorOptions: {
                    maxLength: 20,
                },
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ]
            },
            {
                dataField: 'parentId',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ParentId"),
                //width: 145,
                visible: false,
                dataType: 'string',
                allowSearch: false,
                calculateDisplayValue: (rowData) => {
                    if (rowData?.parent)
                        return rowData.parent.name;
                    return;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: customStore,
                            filter: options.data ? ["!", ["name", "=", options.data.name]] : null,
                            paginate: true,
                            pageSize
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            },
            {
                dataField: 'vatName',
                caption: l("EntityFieldName:MDMService:CompanyProfile:VATName"),
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'vatAddress',
                caption: l("EntityFieldName:MDMService:CompanyProfile:VATAddress"),
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'isHO',
                caption: l("EntityFieldName:MDMService:CompanyProfile:IsHO"),
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
                visible: false,
            },
            {
                dataField: 'effectiveDate',
                caption: l("EntityFieldName:MDMService:CompanyProfile:EffectiveDate"),
                dataType: 'date',
                visible: false,
            },
            {
                dataField: 'endDate',
                caption: l("EntityFieldName:MDMService:CompanyProfile:EndDate"),
                dataType: 'date',
                visible: false,
            },
            {
                dataField: 'latitude',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Latitude"),
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'longitude',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Longitude"),
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'contactName',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ContactName"),
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'contactPhone',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ContactPhone"),
                dataType: 'string',
                visible: false,
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{10}$',
                        message: l('ValidateError:Phone')
                    }
                ]
            }
        ],

        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        onRowInserting: function (e) {
            if (e.data.geoLevel0Id == '')
                e.data.geoLevel0Id = null
            if (e.data.geoLevel1Id == '')
                e.data.geoLevel1Id = null
            if (e.data.geoLevel2Id == '')
                e.data.geoLevel2Id = null
            if (e.data.geoLevel3Id == '')
                e.data.geoLevel3Id = null
            if (e.data.geoLevel4Id == '')
                e.data.geoLevel4Id = null
        },
        onInitNewRow: (e) => {
            e.data.active = true;
            e.data.effectiveDate = new Date()
        }
    }).dxDataGrid("instance");
    initImportPopup('api/mdm-service/companies', 'Company_Template', 'dgCompanies');
});
