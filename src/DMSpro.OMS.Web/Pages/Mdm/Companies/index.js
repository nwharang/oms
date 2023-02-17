$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    const requestOptions = [
        "filter",
        "group",
        "groupSummary",
        "parentIds",
        "requireGroupCount",
        "requireTotalCount",
        "searchExpr",
        "searchOperation",
        "searchValue",
        "select",
        "sort",
        "skip",
        "take",
        "totalSummary",
        "userData"
    ];

    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }

    var geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const argsGeo = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    argsGeo[i] = JSON.stringify(loadOptions[i]);
                }
            });
            console.log(argsGeo)
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
        },
    });

    function selectBoxEditorTemplate(cellElement, cellInfo) {
        return $('<div>').dxLookup({
            valueExpr: "id",
            displayExpr: "name",
            dataSource: new DevExpress.data.DataSource({
                store: geoMasterStore,
                //filter: ['level', '=', 0],
                paginate: true,
                pageSize: 2
            }),

            searchEnabled: true,
            onValueChanged(data) {
                //cellInfo.setValue(data.value);
            },
        });
    }

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        // loadMode: "processed",
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

    var gridCompanies = $('#dgCompanies').dxDataGrid({
        dataSource: customStore,
        remoteOperations: true,
        /*keyExpr: "id",*/
        export: {
            enabled: true,
            //allowExportSelectedData: true,
        },
        showRowLines: true,
        showBorders: true,

        focusedRowEnabled: true,

        allowColumnReordering: true,

        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,

        columnMinWidth: 50,

        columnChooser: {
            enabled: true,
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

        //columnHidingEnabled: true,
        //errorRowEnabled: false,
        searchPanel: {
            visible: true
        },
        //scrolling: {
        //    mode: 'standard'
        //},

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
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridCompanies.addRow();
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
                //width: 90,
                buttons: ['edit', 'delete'],
                fixed: true,
                fixedPosition: "left",
                //alignment: 'right',
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Code"),
                //fixed: true,
                //width: 70,
                validationRules: [{ type: "required" }],
                dataType: 'string',
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Name"),
                //fixed: true,
                //width: 110,
                validationRules: [{ type: "required" }],
                dataType: 'string',
                fixed: true,
                fixedPosition: "left"
            },
            {
                dataField: "geoLevel0Id",
                caption: l1("GeoLevel0Name"),
                //calculateDisplayValue: "geoLevel0Id", // provides display values
                //width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel0Id = value;
                    rowData.geoLevel1Id = null;
                    rowData.geoLevel2Id = null;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: ['level', '=', 0],
                        };
                    },
                },

                //editCellTemplate: selectBoxEditorTemplate,
                dataType: 'string',
            },
            {
                dataField: "geoLevel1Id",
                caption: l1("GeoLevel1Name"),
                //calculateDisplayValue: "geoLevel1Id",
                //width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel1Id = value;
                    rowData.geoLevel2Id = null;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
                lookup: {
                    valueExpr: 'id',
                    displayExpr: 'name',
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel0Id] : ['level', '=', 1],
                        };
                    },
                },
                dataType: 'string',
            },
            {
                dataField: "geoLevel2Id",
                caption: l1("GeoLevel2Name"),
                //calculateDisplayValue: "geoLevel2Id",
                //width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel2Id = value;
                    rowData.geoLevel3Id = '';
                    rowData.geoLevel4Id = '';
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel1Id] : ['level', '=', 2],
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                dataType: 'string',
            },
            {
                dataField: "geoLevel3Id",
                caption: l1("GeoLevel3Name"),
                //calculateDisplayValue: "geoLevel3Id",
                //width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel3Id = value;
                    rowData.geoLevel4Id = '';
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel2Id] : ['level', '=', 3],
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                dataType: 'string',
            },
            {
                dataField: "geoLevel4Id",
                caption: l1("GeoLevel4Name"),
                //calculateDisplayValue: "geoLevel4Id",
                //width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel3Id] : ['level', '=', 4],
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                dataType: 'string',
            },

            //#region 
            {
                dataField: 'street',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Street"),
                //width: 150,
                dataType: 'string',
            },
            {
                dataField: 'address',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Address"),
                //width: 150,
                dataType: 'string',

                //calculateCellValue(data) {
                //    return [data.geo1,
                //    data.geo2, data.geo3]
                //        .join(' ');
                //},
            },
            {
                dataField: 'phone',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Phone"),
                //width: 110,
                dataType: 'string',
            },
            {
                dataField: 'license',
                caption: l("EntityFieldName:MDMService:CompanyProfile:License"),
                //width: 70,
                dataType: 'string',
                visible: false,
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
            },
            {
                dataField: 'parentId',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ParentName"),
                //width: 145,
                visible: false,
                dataType: 'string',
                //lookup: {
                //    dataSource(options) {
                //        return {
                //            store: customStore,
                //            filter: options.data ? ["!", ["name", "=", options.data.name]] : null,
                //        };
                //    },
                //    displayExpr: 'name',
                //    valueExpr: 'id',
                //}
            },
            {
                dataField: 'vatName',
                caption: l("EntityFieldName:MDMService:CompanyProfile:VATName"),
                //width: 90,
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'vatAddress',
                caption: l("EntityFieldName:MDMService:CompanyProfile:VATAddress"),
                //width: 200,
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Active"),
                //width: 70,
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
                //width: 70,
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
                //width: 110,
                dataType: 'date',
                visible: false,
            },
            {
                dataField: 'endDate',
                caption: l("EntityFieldName:MDMService:CompanyProfile:EndDate"),
                //width: 90,
                dataType: 'date',
                visible: false,
            },
            {
                dataField: 'latitude',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Latitude"),
                //width: 110,
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'longitude',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Longitude"),
                //width: 110,
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'contactName',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ContactName"),
                //width: 110,
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'contactPhone',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ContactPhone"),
                //width: 110,
                dataType: 'string',
                visible: false,
            }
            //#endregion
        ],

        onEditorPreparing(e) {
            if (e.parentType === 'dataRow' && e.dataField === 'geoLevel1Id') {
                e.editorOptions.disabled = (typeof e.row.data.geoLevel0Id !== 'string');
                e.editorOptions.showClearButton = true;
            }
        },
        //onEditorPreparing(e) {
        //    if (e.dataField === 'parentId' && e.editorOptions.value == 0) {
        //        e.editorOptions.value = '';
        //    }
        //},
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        onRowInserting: function (e) {
            // for create first data - if parentId = 0, update parentId = null
            //if (e.data && e.data.parentId == 0) {
            //    e.data.parentId = null;
            //}
        },

    }).dxDataGrid("instance");

    //$("input#Search").on("input", function () {
    //    gridCompanies.searchByText($(this).val());
    //});

    //$("#btnNewCompany").click(function (e) {
    //    gridCompanies.addRow();
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    companyService.getDownloadToken().then(
    //        function(result){
    //                var input = getFilter();
    //                var url =  abp.appPath + 'api/mdm-service/companies/as-excel-file' + 
    //                    abp.utils.buildQueryString([
    //                        { name: 'downloadToken', value: result.token },
    //                        { name: 'filterText', value: input.filterText }, 
    //                        { name: 'code', value: input.code }, 
    //                        { name: 'name', value: input.name }, 
    //                        { name: 'address', value: input.address }, 
    //                        { name: 'phone', value: input.phone }, 
    //                        { name: 'license', value: input.license }, 
    //                        { name: 'taxCode', value: input.taxCode }, 
    //                        { name: 'erpCode', value: input.erpCode }, 
    //                        { name: 'parentId', value: input.parentId }, 
    //                        { name: 'inactive', value: input.inactive }, 
    //                        { name: 'isHO', value: input.isHO }
    //                        ]);

    //                var downloadWindow = window.open(url, '_blank');
    //                downloadWindow.focus();
    //        }
    //    )
    //});

});
