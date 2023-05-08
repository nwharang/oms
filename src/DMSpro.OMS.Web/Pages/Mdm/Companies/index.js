﻿var l = abp.localization.getResource("OMS");
var l1 = abp.localization.getResource("OMS");
$(function () {

    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    var geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        useDefaultSearch: true,
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
                pageSize: pageSizeForLookup
            }),

            searchEnabled: true,
            onValueChanged(data) {
                //cellInfo.setValue(data.value);
            },
        });
    }

    //Custom store - for load, update, delete
    const customStore = new DevExpress.data.CustomStore({
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



    const gridCompanies = $('#dgCompanies').dxDataGrid({
        dataSource: customStore,
        remoteOperations: true,
        repaintChangesOnly: true,
        showColumnLines: true,
        showRowLines: false,
        rowAlternationEnabled: true,
        showBorders: true,
        dateSerializationFormat: "yyyy-MM-dd",
        ...genaralConfig('Company'),

        //#region Setting Grid
        focusedRowEnabled: true,

        allowColumnReordering: true,

        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        //columnChooser: {
        //    enabled: true,
        //    allowSearch: true,
        //},
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
        //#endregion Setting Grid

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
                //width: 90,
                buttons: ['edit', 'delete'],
                fixed: true,
                fixedPosition: "left",
                //alignment: 'right',
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
                fixed: true,
                fixedPosition: "left",
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
                caption: l("EntityFieldName:MDMService:CompanyProfile:Name"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: "geoLevel0Id",
                caption: l1("GeoLevel0Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel0 || rowData.geoLevel0 === null) return "";
                    return rowData.geoLevel0.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: ['level', '=', 0],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
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
                caption: l1("GeoLevel1Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel1 || rowData.geoLevel1 === null) return "";
                    return rowData.geoLevel1.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 1], 'and', ['parentId', '=', options.data.geoLevel0Id]] : ['level', '=', 1],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
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
                caption: l1("GeoLevel2Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel2 || rowData.geoLevel2 === null) return "";
                    return rowData.geoLevel2.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 2], 'and', ['parentId', '=', options.data.geoLevel1Id]] : ['level', '=', 2],
                            paginate: true,
                            pageSize: pageSizeForLookup
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
                caption: l1("GeoLevel3Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel3 || rowData.geoLevel3 === null) return "";
                    return rowData.geoLevel3.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 3], 'and', ['parentId', '=', options.data.geoLevel2Id]] : ['level', '=', 3],
                            paginate: true,
                            pageSize: pageSizeForLookup
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
                caption: l1("GeoLevel4Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel4 || rowData.geoLevel4 === null) return "";
                    return rowData.geoLevel4.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 4], 'and', ['parentId', '=', options.data.geoLevel3Id]] : ['level', '=', 4],
                            paginate: true,
                            pageSize: pageSizeForLookup
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
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]$',
                        message: l('ValidateingCodeField')
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
            },
            {
                dataField: 'parentId',
                caption: l("EntityFieldName:MDMService:CompanyProfile:ParentId"),
                //width: 145,
                visible: false,
                dataType: 'string',
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    //console.log(rowData.geoLevel2);
                    if (rowData.parent) {
                        return rowData.parent.name;
                    }
                    return "";
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: customStore,
                            filter: options.data ? ["!", ["name", "=", options.data.name]] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
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
            // {
            //     dataField: 'active',
            //     caption: l("EntityFieldName:MDMService:CompanyProfile:Active"),
            //     //width: 70,
            //     alignment: 'center',
            //     dataType: 'boolean',
            //     cellTemplate(container, options) {
            //         $('<div>')
            //             .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
            //             .appendTo(container);
            //     },
            // },
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
            }
            //#endregion
        ],

        //onEditorPreparing(e) {
        //    if (e.parentType === 'dataRow') {
        //        e.editorOptions.showClearButton = true;
        //        switch (e.dataField) {
        //            //case 'geoLevel0Id':
        //            //    e.editorOptions.onValueChanged = function (args) {
        //            //        e.setValue(args.value);
        //            //    };
        //            //    break;
        //            case 'geoLevel1Id':
        //                e.editorOptions.disabled = (typeof e.row.data.geoLevel0Id !== 'string');
        //                break;
        //            case 'geoLevel2Id':
        //                e.editorOptions.disabled = (typeof e.row.data.geoLevel1Id !== 'string');
        //                break;
        //            case 'geoLevel3Id':
        //                e.editorOptions.disabled = (typeof e.row.data.geoLevel2Id !== 'string');
        //                break;
        //            case 'geoLevel4Id':
        //                e.editorOptions.disabled = (typeof e.row.data.geoLevel3Id !== 'string');
        //                break;
        //            default:
        //        }
        //    }
        //},
        //onEditorPreparing(e) {
        //    if (e.dataField === 'parentId' && e.editorOptions.value == 0) {
        //        e.editorOptions.value = '';
        //    }
        //},
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
            // e.data.isHO = false;
            e.data.effectiveDate = new Date()
        }
    }).dxDataGrid("instance");
    initImportPopup('api/mdm-service/companies', 'Company_Template', 'dgCompanies');
});
