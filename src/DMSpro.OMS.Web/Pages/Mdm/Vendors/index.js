$(function () {
    var l = abp.localization.getResource("OMS");
    var l1 = abp.localization.getResource("OMS");
	
    var vendorService = window.dMSpro.oMS.mdmService.controllers.vendors.vendor;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;

    var geoMasterStore = new DevExpress.data.CustomStore({
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
        loadMode: 'processed',
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
        loadMode: 'processed',
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
                    dataCusAttributes = result.data;
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
            return vendorService.create(values, { contentType: "application/json" });
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
        //keyExpr: "id",
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
            }
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
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgVendors',
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
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridVendors.addRow();
                    },
                },
                'columnChooserButton',
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
                buttons: ['edit'],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Vendor:Code"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
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
                validationRules: [{ type: "required" }]
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
                dataField: 'creationTime',
                caption: l("EntityFieldName:MDMService:Vendor:CreationTime"),
                dataType: 'date',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'endDate',
                caption: l("EntityFieldName:MDMService:Vendor:EndDate"),
                dataType: 'date',
            },
            {
                dataField: 'companyId',
                caption: 'Company',
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: {
                        store: companiesLookup,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    valueExpr: "id",
                    displayExpr: "code"
                }
            },
            {
                dataField: 'linkedCompany',
                caption: l("EntityFieldName:MDMService:Vendor:LinkedCompany"),
                validationRules: [{ type: "required" }],
                dataType: 'string'
                //lookup: {
                //    dataSource: {
                //        store: companiesLookup,
                //        paginate: true,
                //        pageSize: pageSizeForLookup
                //    },
                //    valueExpr: "id",
                //    displayExpr: "code"
                //}
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
                caption: l1("PriceListName"),
                dataType: 'string',
                validationRules: [{ type: "required" }],
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
            {
                dataField: "geoMaster0Id",
                caption: l1("GeoLevel0Name"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoMaster0Id = value;
                    rowData.geoMaster1Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['level', '=', 0] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            },
            {
                dataField: "geoMaster1Id",
                caption: l1("GeoLevel1Name"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoMaster1Id = value;
                    rowData.geoMaster2Id = null;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoMaster0Id] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
            },
            {
                dataField: "geoMaster2Id",
                caption: l1("GeoLevel2Name"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoMaster2Id = value;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoMaster1Id] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
            },
            {
                dataField: "geoMaster3Id",
                caption: l1("GeoLevel3Name"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoMaster3Id = value;
                    rowData.geoMaster4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoMaster2Id] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                }
            },
            {
                dataField: "geoMaster4Id",
                caption: l1("GeoLevel4Name"),
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoMaster3Id] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                }
            },
            {
                dataField: 'street',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Street"),
                width: 150,
                dataType: 'string',
            },
            {
                dataField: 'address',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Address"),
                width: 150,
                dataType: 'string',
            },
            {
                dataField: 'latitude',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Latitude"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'longitude',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Longitude"),
                width: 110,
                dataType: 'string',
            },
        ],
    }).dxDataGrid("instance");
    initImportPopup('api/mdm-service/vendors', 'Vendors_Template', 'dgVendors');
//    $("#btnNewVendor").click(function (e) {
//        gridVendors.addRow();
//    });

//    $("input#Search").on("input", function () {
//        gridVendors.searchByText($(this).val());
//    });

	
//    $("#ExportToExcelButton").click(function (e) {
//        e.preventDefault();

//        vendorService.getDownloadToken().then(
//            function(result){
//                    var input = getFilter();
//                    var url =  abp.appPath + 'api/mdm-service/vendors/as-excel-file' + 
//                        abp.utils.buildQueryString([
//                            { name: 'downloadToken', value: result.token },
//                            { name: 'filterText', value: input.filterText }, 
//                            { name: 'code', value: input.code }, 
//                            { name: 'name', value: input.name }, 
//                            { name: 'shortName', value: input.shortName }, 
//                            { name: 'phone1', value: input.phone1 }, 
//                            { name: 'phone2', value: input.phone2 }, 
//                            { name: 'erpCode', value: input.erpCode }, 
//                            { name: 'active', value: input.active },
//                            { name: 'endDateMin', value: input.endDateMin },
//                            { name: 'endDateMax', value: input.endDateMax }, 
//                            { name: 'warehouseId', value: input.warehouseId }, 
//                            { name: 'street', value: input.street }, 
//                            { name: 'address', value: input.address }, 
//                            { name: 'latitude', value: input.latitude }, 
//                            { name: 'longitude', value: input.longitude }, 
//                            { name: 'linkedCompanyId', value: input.linkedCompanyId }
//, 
//                            { name: 'priceListId', value: input.priceListId }
//, 
//                            { name: 'geoMaster0Id', value: input.geoMaster0Id }
//, 
//                            { name: 'geoMaster1Id', value: input.geoMaster1Id }
//, 
//                            { name: 'geoMaster2Id', value: input.geoMaster2Id }
//, 
//                            { name: 'geoMaster3Id', value: input.geoMaster3Id }
//, 
//                            { name: 'geoMaster4Id', value: input.geoMaster4Id }
//                            ]);
                            
//                    var downloadWindow = window.open(url, '_blank');
//                    downloadWindow.focus();
//            }
//        )
//    });
});
