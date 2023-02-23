$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    var geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        //loadMode: 'raw',
        //cacheRawData: true,
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

        showColumnLines: true,
        showRowLines: false,
        rowAlternationEnabled: true,
        showBorders: false,

        /*keyExpr: "id",*/
        /*Export Excel*/
        export: {
            enabled: true,
            //formats: ['xlsx', 'pdf'],
            //allowExportSelectedData: true,
        },
        onExporting: function (e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Companies');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Companies.xlsx');
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('Companies.pdf');
                });
            }
        },
        /*End Export Excel*/

        //#region Setting Grid
        focusedRowEnabled: true,

        allowColumnReordering: true,

        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,

        columnMinWidth: 50,

        columnChooser: {
            enabled: true,
            allowSearch: true,
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

        //columnHidingEnabled: true,
        //errorRowEnabled: false,
        searchPanel: {
            visible: true
        },
        //scrolling: {
        //    mode: 'standard'
        //},

        //stateStoring: { //save state in localStorage
        //    enabled: true,
        //    type: 'localStorage',
        //    storageKey: 'dgCompanies',
        //},

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
                //{
                //    location: 'before',
                //    name: 'addRowButton',
                //},
                "groupPanel",
                "addRowButton",
                {
                    name: "columnChooserButton",
                    locateInMenu: "auto",
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            id: "import-excel",
                            class: "import-excel",
                        },
                        onClick() {
                            popup.show();
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
                caption: l("EntityFieldName:MDMService:CompanyProfile:Id"),
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
                validationRules: [{ type: "required" }],
                dataType: 'string',
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CompanyProfile:Name"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
                fixed: true,
                fixedPosition: "left"
            },
            {
                dataField: "geoLevel0.name",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel0Id"),
                formItem: {
                    visible: false
                },  
            },
            {
                dataField: "geoLevel0Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel0Id"),
                visible: false,
                formItem: {
                    visible: true,
                },  
                //calculateDisplayValue: "geoLevel0.name", // provides display values
                //calculateCellValue: function (rowData) {
                //    return rowData.geoLevel0.name;
                //},
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
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    //lookup: {
                    //    valueExpr: 'id',
                    //    displayExpr: 'name',
                    //    dataSource(options) {
                    //        return {
                    //            store: geoMasterStore,
                    //            filter: ['level', '=', 0],
                    //            paginate: true,
                    //        };
                    //    },
                    //},
                },
                //editCellTemplate: selectBoxEditorTemplate,
                dataType: 'string',
            },
            {
                dataField: "geoLevel1Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel1Id"),
                calculateDisplayValue: "geoLevel1.name",
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

                    store: DevExpress.data.AspNet.createStore({
                        key: "id",
                        loadUrl: "api/mdm-service/companies/GetListDevextremes"
                    })

                    //dataSource(options) {
                    //    return {
                    //        store: geoMasterStore,
                    //        filter: options.data ? ['parentId', '=', options.data.geoLevel0Id] : ['level', '=', 1],
                    //        paginate: true,
                    //    };
                    //},
                    //lookup: {
                    //    valueExpr: 'id',
                    //    displayExpr: 'name',
                    //    dataSource(options) {
                    //        return {
                    //            store: geoMasterStore,
                    //            filter: options.data ? ['parentId', '=', options.data.geoLevel0Id] : ['level', '=', 1],
                    //            paginate: true,
                    //        };
                    //    },
                    //},
                    // dataSource(options) {
                    //     return {
                    //         store: geoMasterStore,
                    //         filter: options.data ? ['parentId', '=', options.data.geoLevel0Id] : ['level', '=', 1],
                    //         paginate: true,
                    //         pageSize: pageSizeForLookup
                    //     };
                    // },
                },
                dataType: 'string',
            },
            {
                dataField: "geoLevel2Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel2Id"),
                calculateDisplayValue: "geoLevel2.name",
                //width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel2Id = value;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
                lookup: {
                    //dataSource(options) {
                    //    return {
                    //        store: geoMasterStore,
                    //        filter: options.data ? ['parentId', '=', options.data.geoLevel1Id] : ['level', '=', 2],
                    //    };
                    //},
                    // dataSource(options) {
                    //     return {
                    //         store: geoMasterStore,
                    //         filter: options.data ? ['parentId', '=', options.data.geoLevel1Id] : ['level', '=', 2],
                    //         paginate: true,
                    //         pageSize: pageSizeForLookup
                    //     };
                    // },
                    valueExpr: 'id',
                    displayExpr: 'name',
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
                },
                dataType: 'string',
            },
            {
                dataField: "geoLevel3Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel3Id"),
                calculateDisplayValue: "geoLevel3.name",
                //width: 110,
                setCellValue(rowData, value) {
                    rowData.geoLevel3Id = value;
                    rowData.geoLevel4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel2Id] : ['level', '=', 3],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                dataType: 'string',
            },
            {
                dataField: "geoLevel4Id",
                caption: l("EntityFieldName:MDMService:CompanyProfile:geoLevel4Id"),
                visible: false,
                calculateDisplayValue: "geoLevel4.name",
                formItem: {
                    visible: false,
                }, 
                //width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel3Id] : ['level', '=', 4],
                            paginate: true,
                            pageSize: pageSizeForLookup
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
                caption: l("EntityFieldName:MDMService:CompanyProfile:ParentId"),
                //width: 145,
                visible: false,
                dataType: 'string',
                calculateDisplayValue: "parent.name",
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
            if (e.parentType === 'dataRow') {
                e.editorOptions.showClearButton = true;
                switch (e.dataField) {
                    //case 'geoLevel0Id':
                    //    e.editorOptions.onValueChanged = function (args) {
                    //        e.setValue(args.value);
                    //    };
                    //    break;
                    case 'geoLevel1Id':
                        e.editorOptions.disabled = (typeof e.row.data.geoLevel0Id !== 'string');
                        break;
                    case 'geoLevel2Id':
                        e.editorOptions.disabled = (typeof e.row.data.geoLevel1Id !== 'string');
                        break;
                    case 'geoLevel3Id':
                        e.editorOptions.disabled = (typeof e.row.data.geoLevel2Id !== 'string');
                        break;
                    case 'geoLevel4Id':
                        e.editorOptions.disabled = (typeof e.row.data.geoLevel3Id !== 'string');
                        break;
                    default:
                }
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
        }
    }).dxDataGrid("instance");

    const popup = $('#popup').dxPopup({
        contentTemplate: "",
        width: 300,
        height: 280,
        container: '#import-excel',
        showTitle: true,
        title: 'Information',
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: true,
        position: {
            at: 'top',
            my: 'right',
            collision: 'fit',
        },
        toolbarItems: [{
            locateInMenu: 'always',
            widget: 'dxButton',
            toolbar: 'top',
            options: {
                text: 'More info',
                onClick() {
                    //const message = `More info about ${employee.FirstName} ${employee.LastName}`;

                    DevExpress.ui.notify({
                        message,
                        position: {
                            my: 'center top',
                            at: 'center top',
                        },
                    }, 'success', 3000);
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'before',
            options: {
                icon: 'email',
                text: 'Send',
                onClick() {
                    //const message = `Email is sent to ${employee.FirstName} ${employee.LastName}`;
                    DevExpress.ui.notify({
                        message,
                        position: {
                            my: 'center top',
                            at: 'center top',
                        },
                    }, 'success', 3000);
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Close',
                onClick() {
                    popup.hide();
                },
            },
        }],
    }).dxPopup('instance');

});
