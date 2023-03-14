var l = abp.localization.getResource("MdmService");
var l1 = abp.localization.getResource("OMS");
$(function () {
    
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

        stateStoring: { //save state in localStorage
           enabled: true,
           type: 'localStorage',
           storageKey: 'dgCompanies',
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
                //editCellTemplate: geoLookupEditorTemplate,
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

                    //store: DevExpress.data.AspNet.createStore({
                    //    key: "id",
                    //    loadUrl: "api/mdm-service/companies/GetListDevextremes"
                    //})

                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['parentId', '=', options.data.geoLevel0Id] : ['level', '=', 1],
                            paginate: true,
                        };
                    },
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
                     dataSource(options) {
                         return {
                             store: geoMasterStore,
                             filter: options.data ? ['parentId', '=', options.data.geoLevel1Id] : ['level', '=', 2],
                             paginate: true,
                             pageSize: pageSizeForLookup
                         };
                     },
                    valueExpr: 'id',
                    displayExpr: 'name',
                    //lookup: {
                    //    dataSource(options) {
                    //        return {
                    //            store: geoMasterStore,
                    //            filter: options.data ? ['parentId', '=', options.data.geoLevel1Id] : ['level', '=', 2],
                    //        };
                    //    },
                    //    valueExpr: 'id',
                    //    displayExpr: 'name',
                    //},
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
        }
    }).dxDataGrid("instance");

    /*thanhhq*/
    //var files = [];
    //var url = `${abp.appPath}api/mdm-service/companies/insert-from-excel`;

    //const popupContentTemplate = function () {
        
    //    const content = $('<div />');
    //    content.append(
    //        $('<div>').dxSelectBox({
    //            dataSource: [
    //                { name: l('Insert from Excel'), value: 'I' },
    //                { name: l('Update from Excel'), value: 'U' },
    //            ],
    //            valueExpr: 'value',
    //            displayExpr: 'name',
    //            value: 'I',
    //            onValueChanged(e) {
    //                if (e.value == 'I') {
    //                    url = `${abp.appPath}api/mdm-service/companies/insert-from-excel`;
    //                } else url = `${abp.appPath}api/mdm-service/companies/update-from-excel`
    //            },
    //        })); 
    //    content.append(
    //        $('<div>').dxFileUploader({
    //            selectButtonText: l('Select a file'),
    //            icon: 'import',
    //            //labelText: '',
    //            multiple: false,
    //            uploadMode: 'useForm',
    //            allowedFileExtensions: ['.xlsx', '.xls'],
    //            onValueChanged(e) {
    //                files = e.value;
    //            }
    //        })); 
    //    return content;
    //};

    //const popup = $('#popup').dxPopup({
    //    width: 400,
    //    height: 300,
    //    //container: '#import-excel',
    //    showTitle: true,
    //    title: l('Import Excel'),
    //    visible: false,
    //    dragEnabled: true,
    //    hideOnOutsideClick: true,
    //    showCloseButton: true,
    //    position: {
    //        my: 'top',
    //        at: 'center',
    //        //collision: 'fit',
    //    },
    //    toolbarItems: [{
    //        widget: 'dxButton',
    //        toolbar: 'bottom',
    //        location: 'before',
    //        options: {
    //            icon: 'download',
    //            text: l('Download Template'),
    //            onClick() {
    //                const url = '/api/mdm-service/companies/get-excel-template';
    //                fetch(url)
    //                    // Retrieve its body as ReadableStream
    //                .then((response) => {
    //                    console.log(response);
    //                    const reader = response.body.getReader();
    //                    console.log(reader);
    //                    return new ReadableStream({
    //                        start(controller) {
    //                            return pump();
    //                            function pump() {
    //                                return reader.read().then(({ done, value }) => {
    //                                    // When no more data needs to be consumed, close the stream
    //                                    if (done) {
    //                                        controller.close();
    //                                        return;
    //                                    }
    //                                    // Enqueue the next data chunk into our target stream
    //                                    controller.enqueue(value);
    //                                    return pump();
    //                                    });
    //                                }
    //                            }
    //                            })
    //                        })
    //                        // Create a new response out of the stream
    //                        .then((stream) => new Response(stream))
    //                        // Create an object URL for the response
    //                        .then((response) => response.blob())
    //                        .then((blob) => URL.createObjectURL(blob))
    //                        .then((href) => {
    //                            const a = document.createElement("a");
    //                            document.body.appendChild(a);
    //                            a.style = "display: none";
    //                            a.href = href;
    //                            a.download = 'Company_Template.xlsx';
    //                            a.click();

    //                        });
                           
    //                            },
    //        },
    //    }, {
    //        widget: 'dxButton',
    //        toolbar: 'bottom',
    //        location: 'after',
    //        options: {
    //            icon: 'upload',
    //            text: l('Import'),
    //            onClick(e) {
    //                if (files.length > 0) {
    //                    var formData = new FormData();
    //                    formData.append("file", files[0]);

    //                    $.ajax({
    //                        type: "POST",
    //                        url: url,
    //                        async: true,
    //                        data: formData,
    //                        cache: false,
    //                        contentType: false,
    //                        processData: false,
    //                        //timeout: 60000,
    //                        success: function (data) {
    //                            popup.hide();
    //                            gridCompanies.refresh();
    //                        },
    //                        error: function (msg) {
    //                            // handle error
    //                            console.log(msg.responseText.error);
    //                        },
                            
    //                    });
                        
    //                }
    //            },
    //        },
    //    }, 
    //    ],
    //}).dxPopup('instance');
    /*thanhhq*/
    initImportPopup('api/mdm-service/companies', 'Company_Template', 'dgCompanies'); 
});
