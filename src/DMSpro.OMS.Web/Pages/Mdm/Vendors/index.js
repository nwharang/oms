$(function () {
    var l = abp.localization.getResource("OMS");

    var vendorService = window.dMSpro.oMS.mdmService.controllers.vendors.vendor;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;

    var geoMasterStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            geoMasterService.getListDevextremes(args)
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
            geoMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    var pricelistLookup = new DevExpress.data.CustomStore({
        key: "id",
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
                        groupCount: result.groupCount
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
                })
            return d.promise();
        }
    });
    var companiesLookup = new DevExpress.data.CustomStore({
        key: "id",
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
                        groupCount: result.groupCount
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
                })
            return d.promise();
        }
    });

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            vendorService.getListDevextremes(args)
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
            return key == 0 ? vendorService.get(key) : null;
        },
        insert(values) {
            return Common.getCurrentCompany().then(x => {
                values.companyId = x.id;
                return vendorService.create(values, { contentType: "application/json" });
            });
        },
        update(key, values) {
            return vendorService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return vendorService.delete(key);
        }
    });

    var gridVendors = $('#dgVendors').dxDataGrid({
        dataSource: customStore,
        editing: {
            mode: "popup",
            allowAdding: abp.auth.isGranted('MdmService.Vendors.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.Vendors.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.Vendors.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                height: "fit-content"
            },
        },
        onInitNewRow: function (e) {
            e.data.active = true;
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
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
                width: 90,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Vendor:Code"),
                dataType: 'string',
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateingCodeField')
                    }
                ]
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:Vendor:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'shortName',
                caption: l("EntityFieldName:MDMService:Vendor:ShortName"),
                dataType: 'string',
                //validationRules: [{ type: "required" }]
            },
            {
                dataField: 'phone1',
                caption: l("EntityFieldName:MDMService:Vendor:Phone1"),
                dataType: 'string',
            },
            {
                dataField: 'phone2',
                caption: l("EntityFieldName:MDMService:Vendor:Phone2"),
                dataType: 'string',
            },
            {
                dataField: 'erpCode',
                caption: l("EntityFieldName:MDMService:Vendor:ERPCode"),
                dataType: 'string',
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:Vendor:Active"),
                width: 70,
                alignment: 'center',
                dataType: 'boolean',
                //validationRules: [{ type: "required" }],
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
            {
                dataField: 'linkedCompanyId',
                caption: l("EntityFieldName:MDMService:Vendor:LinkedCompany"),
                //validationRules: [{ type: "required" }],
                dataType: 'string',
                // calculateDisplayValue: function (rowData) {
                //     // if(rowData.geoLevel0){
                //     //     return rowData.geoLevel0.name;
                //     // }
                //     // return "";
                // },
                lookup: {
                    dataSource: {
                        store: companiesLookup,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    valueExpr: "id",
                    displayExpr: "code"
                },
                editorOptions: {
                    showClearButton: true
                }
            },
            //{
            //    dataField: 'warehouseId',
            //    caption: l("EntityFieldName:MDMService:Vendor:Warehouse"),
            //    dataType: 'string',
            //    validationRules: [{ type: "required" }],
            //    lookup: {
            //        dataSource: companiesLookup,
            //        valueExpr: "id",
            //        displayExpr: "displayName"
            //    }
            //},
            {
                dataField: 'priceListId',
                caption: l("PriceListName"),
                dataType: 'string',
                validationRules: [{ type: "required" }],
                calculateDisplayValue: (e) => {
                    if (e && e.priceList)
                        return e.priceList.code
                    return
                },
                lookup: {
                    dataSource: {
                        store: pricelistLookup,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    valueExpr: "id",
                    displayExpr: "code"
                }
            },
            // {
            //     dataField: "geoMaster0Id",
            //     caption: l1("GeoLevel0Name"),
            //     width: 110,
            //     setCellValue(rowData, value) {
            //         rowData.geoMaster0Id = value;
            //         rowData.geoMaster1Id = null;
            //     },
            //     lookup: {
            //         dataSource(options) {
            //             return {
            //                 store: geoMasterStore,
            //                 filter: options.data ? ['level', '=', 0] : null,
            //                 paginate: true,
            //                 pageSize: pageSizeForLookup
            //             };
            //         },
            //         valueExpr: "id",
            //         displayExpr: "name"
            //     }
            // },
            // {
            //     dataField: "geoMaster1Id",
            //     caption: l1("GeoLevel1Name"),
            //     width: 110,
            //     setCellValue(rowData, value) {
            //         rowData.geoMaster1Id = value;
            //         rowData.geoMaster2Id = null;
            //         rowData.geoMaster3Id = null;
            //         rowData.geoMaster4Id = null;
            //     },
            //     lookup: {
            //         dataSource(options) {
            //             return {
            //                 store: geoMasterStore,
            //                 filter: options.data ? ['parentId', '=', options.data.geoMaster0Id] : null,
            //                 paginate: true,
            //                 pageSize: pageSizeForLookup
            //             };
            //         },
            //         valueExpr: 'id',
            //         displayExpr: 'name',
            //     },
            // },
            // {
            //     dataField: "geoMaster2Id",
            //     caption: l1("GeoLevel2Name"),
            //     width: 110,
            //     setCellValue(rowData, value) {
            //         rowData.geoMaster2Id = value;
            //         rowData.geoMaster3Id = null;
            //         rowData.geoMaster4Id = null;
            //     },
            //     lookup: {
            //         dataSource(options) {
            //             return {
            //                 store: geoMasterStore,
            //                 filter: options.data ? ['parentId', '=', options.data.geoMaster1Id] : null,
            //                 paginate: true,
            //                 pageSize: pageSizeForLookup
            //             };
            //         },
            //         valueExpr: 'id',
            //         displayExpr: 'name',
            //     },
            // },
            // {
            //     dataField: "geoMaster3Id",
            //     caption: l1("GeoLevel3Name"),
            //     width: 110,
            //     setCellValue(rowData, value) {
            //         rowData.geoMaster3Id = value;
            //         rowData.geoMaster4Id = null;
            //     },
            //     lookup: {
            //         dataSource(options) {
            //             return {
            //                 store: geoMasterStore,
            //                 filter: options.data ? ['parentId', '=', options.data.geoMaster2Id] : null,
            //                 paginate: true,
            //                 pageSize: pageSizeForLookup
            //             };
            //         },
            //         valueExpr: 'id',
            //         displayExpr: 'name',
            //     }
            // },
            // {
            //     dataField: "geoMaster4Id",
            //     caption: l1("GeoLevel4Name"),
            //     width: 110,
            //     lookup: {
            //         dataSource(options) {
            //             return {
            //                 store: geoMasterStore,
            //                 filter: options.data ? ['parentId', '=', options.data.geoMaster3Id] : null,
            //                 paginate: true,
            //                 pageSize: pageSizeForLookup
            //             };
            //         },
            //         valueExpr: 'id',
            //         displayExpr: 'name',
            //     }
            // },
            // {
            //     dataField: 'street',
            //     caption: l("EntityFieldName:MDMService:CompanyProfile:Street"),
            //     width: 150,
            //     dataType: 'string',
            // },
            {
                dataField: 'address',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Address"),
                width: 150,
                dataType: 'string',
            },
            // {
            //     dataField: 'latitude',
            //     caption: l("EntityFieldName:MDMService:CompanyProfile:Latitude"),
            //     width: 110,
            //     dataType: 'string',
            // },
            // {
            //     dataField: 'longitude',
            //     caption: l("EntityFieldName:MDMService:CompanyProfile:Longitude"),
            //     width: 110,
            //     dataType: 'string',
            // },
        ],
    }).dxDataGrid("instance");
    initImportPopup('api/mdm-service/vendors', 'Vendors_Template', 'dgVendors');
});
