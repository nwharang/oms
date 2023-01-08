$(function () {
    var l = abp.localization.getResource("MdmService");
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }

    var geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        load(loadOptions) {
            const deferred = $.Deferred();
            const argsGeo = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
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

            var d = new $.Deferred();
            geoMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
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
                    console.log('data ne: ', result);
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

    var gridCompanies = $('#dgCompanies').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        parentIdExpr: "parentId",
        editing: {
            mode: "popup",
            allowAdding: abp.auth.isGranted('MdmService.CompanyMasters.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CompanyMasters.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CompanyMasters.Delete'),
            useIcons: true,
            popup: {
                title: l("Page:Title:CompanyProfiles"),
                showTitle: true,
                height: 720
            },
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            form: {
                colCount: 2,
                items: [
                    {
                        dataField: "code",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "name",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "geoLevel0Id",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "geoLevel1Id",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "geoLevel2Id",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "geoLevel3Id",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "geoLevel4Id",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "street",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "address",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "phone",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "license",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "taxCode",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "erpCode",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "parentId",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "vatName",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "vatAddress",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "active",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "isHO",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "effectiveDate",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "endDate",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "latitude",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "longitude",
                        cssClass: "pl-5",
                    },
                    {
                        dataField: "contactName",
                        cssClass: "pr-5",
                    },
                    {
                        dataField: "contactPhone",
                        cssClass: "pl-5",
                    }
                ]
            },
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
        onEditorPreparing(e) {
            if (e.dataField === 'parentId' && e.editorOptions.value == 0) {
                e.editorOptions.value = '';
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ["code", "name", "street", "address"];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        onRowInserting: function (e) {
            // for create first data - if parentId = 0, update parentId = null
            if (e.data && e.data.parentId == 0) {
                e.data.parentId = null;
            }
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 90,
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Code"),
                width: 70,
                validationRules: [{ type: "required" }],
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Name"),
                width: 110,
                validationRules: [{ type: "required" }],
                dataType: 'string',
            },
            {
                dataField: "geoLevel0Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel0Id"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel0Id = value;
                    rowData.geoLevel1Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['level', '=', 0] : null,
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            },
            {
                dataField: "geoLevel1Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel1Id"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel1Id = value;
                    rowData.geoLevel2Id = null;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel0Id] : null,
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
            },
            {
                dataField: "geoLevel2Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel2Id"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel2Id = value;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel1Id] : null,
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
            },
            {
                dataField: "geoLevel3Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel3Id"),
                width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel3Id = value;
                    rowData.geoLevel4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel2Id] : null,
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                }
            },
            //{
            //    dataField: "geoLevel4Id",
            //    caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel4Id"),
            //    width: 110,
            //    lookup: {
            //        dataSource(options) {
            //            return {
            //                store: geoMasterStore,
            //                filter: options.data ? ['parentId', '=', options.data.geoLevel3Id] : null,
            //            };
            //        },
            //        valueExpr: 'id',
            //        displayExpr: 'name',
            //    }
            //},
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
                dataField: 'phone',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Phone"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'license',
                caption: l("EntityFieldName:MDMService:CompanyProfile:License"),
                width: 70,
                dataType: 'string',
            },
            {
                dataField: 'taxCode',
                caption: l("EntityFieldName:MDMService:CompanyProfile:TaxCode"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'erpCode',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ERPCode"),
                width: 80,
                dataType: 'string',
            },
            {
                dataField: 'parentId',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ParentName"),
                width: 145,
                lookup: {
                    dataSource(options) {
                        return {
                            store: customStore,
                            filter: options.data ? ["!", ["name", "=", options.data.name]] : null,
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            },
            {
                dataField: 'vatName',
                caption: l("EntityFieldName:MDMService:CompanyProfile:VATName"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'vatAddress',
                caption: l("EntityFieldName:MDMService:CompanyProfile:VATAddress"),
                width: 200,
                dataType: 'string',
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Active"),
                width: 70,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
            {
                dataField: 'isHO',
                caption: l("EntityFieldName:MDMService:CompanyProfile:IsHO"),
                width: 70,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
            {
                dataField: 'effectiveDate',
                caption: l("EntityFieldName:MDMService:CompanyProfile:EffectiveDate"),
                width: 110,
                dataType: 'date',
            },
            {
                dataField: 'endDate',
                caption: l("EntityFieldName:MDMService:CompanyProfile:EndDate"),
                width: 90,
                dataType: 'date',
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
            {
                dataField: 'contactName',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ContactName"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'contactPhone',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ContactPhone"),
                width: 110,
                dataType: 'string',
            }
        ],
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        gridCompanies.searchByText($(this).val());
    });

    $("#btnNewCompany").click(function (e) {
        gridCompanies.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        companyService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/companies/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'name', value: input.name }, 
                            { name: 'address', value: input.address }, 
                            { name: 'phone', value: input.phone }, 
                            { name: 'license', value: input.license }, 
                            { name: 'taxCode', value: input.taxCode }, 
                            { name: 'erpCode', value: input.erpCode }, 
                            { name: 'parentId', value: input.parentId }, 
                            { name: 'inactive', value: input.inactive }, 
                            { name: 'isHO', value: input.isHO }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });
    
});
