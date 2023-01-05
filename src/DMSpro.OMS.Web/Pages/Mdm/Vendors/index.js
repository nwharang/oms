$(function () {
    var l = abp.localization.getResource("MdmService");
	
    var vendorService = window.dMSpro.oMS.mdmService.controllers.vendors.vendor;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }


    var geosLookup = [];
    var pricelistLookup = [];
    var companiesLookup = [];

    var urlGeo = abp.appPath + 'api/mdm-service/vendors/geo-master-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    var urlPriceList = abp.appPath + 'api/mdm-service/vendors/price-list-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    var urlCompany = abp.appPath + 'api/mdm-service/vendors/company-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlGeo}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call geosLookup ajax: ', data);
            geosLookup = data.items;
        }
    });
    $.ajax({
        url: `${urlPriceList}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call pricelistLookup ajax: ', data);
            pricelistLookup = data.items;
        }
    });
    $.ajax({
        url: `${urlCompany}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call companiesLookup ajax: ', data);
            companiesLookup = data.items;
        }
    });

    var getGEOLevel = function (level) {
        //return geosLookup.filter(x => x.level === level);
        return geosLookup;
    };

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            [
                'skip',
                'take',
                'requireTotalCount',
                'requireGroupCount',
                'sort',
                'filter',
                'totalSummary',
                'group',
                'groupSummary',
            ].forEach((i) => {
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
        keyExpr: "id",
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
        remoteOperations: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        //columnHidingEnabled: true,
        errorRowEnabled: false,
        filterRow: {
            visible: false
        },
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
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
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 90,
                buttons: ['edit'],
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
                validationRules: [{ type: "required" }],
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
                dataField: 'linkedCompanyId',
                caption: l("EntityFieldName:MDMService:Vendor:LinkedCompany"),
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: companiesLookup,
                    valueExpr: "id",
                    displayExpr: "displayName"
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
                caption: l("EntityFieldName:MDMService:Vendor:Pricelist"),
                dataType: 'string',
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: pricelistLookup,
                    valueExpr: "id",
                    displayExpr: "displayName"
                }
            },
            {
                dataField: "geoLevel0Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel0Id"),
                width: 110,
                lookup: {
                    dataSource: getGEOLevel(0),
                    valueExpr: "id",
                    displayExpr: "displayName"
                }
            },
            {
                dataField: "geoLevel1Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel1Id"),
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: getGEOLevel(1),
                            //filter: options.data ? ['geoLevel0Id', '=', options.data.parentId] : null,
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'displayName',
                },
            },
            {
                dataField: "geoLevel2Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel2Id"),
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: getGEOLevel(2),
                            //filter: options.data ? ['geoLevel1Id', '=', options.data.parentId] : null,
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'displayName',
                },
            },
            {
                dataField: "geoLevel3Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel3Id"),
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: getGEOLevel(3),
                            //filter: options.data ? ['geoLevel2Id', '=', options.data.parentId] : null,
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'displayName',
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

    $("#btnNewVendor").click(function (e) {
        gridVendors.addRow();
    });

    $("input#Search").on("input", function () {
        gridVendors.searchByText($(this).val());
    });

	
    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        vendorService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/vendors/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'name', value: input.name }, 
                            { name: 'shortName', value: input.shortName }, 
                            { name: 'phone1', value: input.phone1 }, 
                            { name: 'phone2', value: input.phone2 }, 
                            { name: 'erpCode', value: input.erpCode }, 
                            { name: 'active', value: input.active },
                            { name: 'endDateMin', value: input.endDateMin },
                            { name: 'endDateMax', value: input.endDateMax }, 
                            { name: 'warehouseId', value: input.warehouseId }, 
                            { name: 'street', value: input.street }, 
                            { name: 'address', value: input.address }, 
                            { name: 'latitude', value: input.latitude }, 
                            { name: 'longitude', value: input.longitude }, 
                            { name: 'linkedCompanyId', value: input.linkedCompanyId }
, 
                            { name: 'priceListId', value: input.priceListId }
, 
                            { name: 'geoMaster0Id', value: input.geoMaster0Id }
, 
                            { name: 'geoMaster1Id', value: input.geoMaster1Id }
, 
                            { name: 'geoMaster2Id', value: input.geoMaster2Id }
, 
                            { name: 'geoMaster3Id', value: input.geoMaster3Id }
, 
                            { name: 'geoMaster4Id', value: input.geoMaster4Id }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });
});
