﻿$(async function () {
    var l = abp.localization.getResource("OMS");
    var l1 = abp.localization.getResource("OMS");
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
    var cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.customerAttributeValues.customerAttributeValue;
    var cusAttrService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;

    let cusAttrStore = cusAttrService.getListDevextremes({ filter: JSON.stringify(['active', "=", true]) })

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
    var geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        useDefaultSearch: true,
        // loadMode: "raw",
        // cacheRawData: true,
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
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            customerService.getListDevextremes(args)
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
            return key == 0 ? customerService.get(key) : null;
        },
        insert(values) {
            return customerService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerService.delete(key);
        }
    });

    var getCusAttrValue = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            cusAttributeValueService.getListDevextremes({})
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            deferred.promise().then(attrVal => {
                listAttrValue = attrVal;
            })
            return deferred.promise();
        }
    });

    priceListStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            priceListService.getListDevextremes({})
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                    });
                });
            return deferred.promise();
        }
    });


    var cusProfile = {};

    var gridCustomers = $('#dgCustomers').dxDataGrid({
        dataSource: customStore,
        repaintChangesOnly: true,
        editing: {
            mode: "popup",
            allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                title: 'Customer Info',
                showTitle: true,
                width: "95%",
                height: "95%",
                hideOnOutsideClick: false,
                dragEnabled: false,
            },
            form: {
                labelMode: "outside",
                colCount: 3,
                elementAttr: {
                    id: "customerForm",
                },
                items: [
                    {
                        itemType: "group",
                        caption: 'IMAGE',
                        colSpan: 1,
                        template: renderUserImage // Fix for future versions
                    },
                    {
                        itemType: "group",
                        caption: 'GENERAL',
                        colSpan: 2,
                        items: ["code", 'name', 'phone1', 'phone2', 'erpCode', 'priceListId', 'active'],
                    },
                    {
                        itemType: "tabbed",
                        colSpan: 3,
                        tabs: [
                            {
                                title: 'DATA',
                                items: [
                                    {
                                        dataField: 'effectiveDate',
                                        editorType: "dxDateBox"
                                    },
                                    {
                                        dataField: 'endDate',
                                        editorType: "dxDateBox"
                                    },
                                    {
                                        dataField: 'lastOrderDate',
                                        editorType: "dxDateBox"
                                    },
                                    {
                                        dataField: 'creditLimit'
                                    },
                                    {
                                        dataField: 'linkedCompanyId',
                                        editorOptions: {
                                            elementAttr: {
                                                id: "linkedCompanyId",
                                            }
                                        }
                                    },
                                    {
                                        dataField: 'isCompany',
                                        elementAttr: {
                                            id: "isCompany",
                                        }
                                    }
                                    // { dataField: 'sfaCustomerCode' },
                                ]
                            },
                            {
                                title: "SYSTEM",
                                items: ['license', 'taxCode', 'vatName', 'vatAddress']
                            },
                            {
                                title: "ADDRESS",
                                items: ['geoMaster0Id', 'geoMaster1Id', 'geoMaster2Id', 'geoMaster3Id', 'geoMaster4Id', 'street', 'address', 'latitude', 'longitude']
                            },
                            {
                                title: 'ATTRIBUTE',
                                colCount: 2,
                                items: getAttrOptions(),
                            }
                        ]
                    }],
            }
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
            storageKey: 'dgCustomerProfile',
        },
        paging: {
            enabled: true,
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes, // ?? 
            showInfo: true,
            showNavigationButtons: true
        },
        toolbar: {
            items: [
                "groupPanel",
                'addRowButton',
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
                buttons: ['edit'],
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
                //allowEditing: false,
                dataField: 'code',
                caption: l("Code"),
                //allowEditing: false,
                dataType: 'string',
                allowEditing: false,
                //validationRules: [{ type: "required" }]
            },
            {
                dataField: 'name',
                caption: l("Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'phone1',
                caption: l("Phone1"),
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
                dataField: 'phone2',
                caption: l("Phone2"),
                dataType: 'string',
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{10}$',
                        message: l('ValidateError:Phone')
                    }
                ],
                visible: false
            },
            {
                dataField: 'erpCode',
                caption: l("ERPCode"),
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
                ],
            },
            {
                dataField: 'license',
                caption: l("License"),
                dataType: 'string',
                visible: false,
            },
            {
                dataField: 'taxCode',
                caption: l("TaxCode"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'vatName',
                caption: l("VatName"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'vatAddress',
                caption: l("VatAddress"),
                dataType: 'string',
                visible: false
            },
            // {
            //     dataField: 'sfaCustomerCode',
            //     caption: l("SfaCustomerCode"),
            //     dataType: 'string',
            //     //validationRules: [{ type: "required" }]
            // },
            {
                dataField: 'active',
                caption: l("Active"),
                //allowEditing: false,
                width: 110,
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
                caption: l("EffectiveDate"),
                dataType: 'date',
                editorOptions: {
                    displayFormat: 'dd/MM/yyyy',
                },
                format: 'dd/MM/yyyy',
                visible: false,
                validationRules: [{ type: "required" }],
            },
            {
                dataField: 'endDate',
                caption: l("EndDate"),
                visible: false,
                dataType: 'date',
                editorOptions: {
                    displayFormat: 'dd/MM/yyyy',
                },
                format: 'dd/MM/yyyy',
            },
            {
                dataField: 'isCompany',
                caption: l("IsCompany"),
                dataType: 'boolean',
                width: 110,
                alignment: 'center',
                visible: false,
                setCellValue(rowData, value) {
                    rowData.isCompany = value;
                    if (!value)
                        rowData.linkedCompanyId = null;
                }
            },
            {
                dataField: 'creditLimit',
                caption: l("CreditLimit"),
                dataType: 'number',
                visible: false,
                editorOptions: {
                    min: 0,
                    format: '#'
                }
            },
            {
                dataField: 'linkedCompanyId',
                caption: l("LinkedCompany"),
                lookup: {
                    dataSource: {
                        store: companiesLookup,
                        paginate: true,
                        pageSize
                    },
                    valueExpr: "id",
                    displayExpr: "code",
                },
                editorOptions: {
                    showClearButton: true,
                }
            },
            {
                dataField: 'lastOrderDate',
                caption: l("LastOrderDate"),
                dataType: 'date',
                visible: false
            },
            {
                dataField: 'priceListId',
                caption: l("PriceList"),
                dataType: 'string',
                visible: false,
                lookup: {
                    dataSource: {
                        store: priceListStore,
                        paginate: true,
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            },
            {
                dataField: "geoMaster0Id",
                caption: l1("GeoLevel0Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoMaster0 || rowData.geoMaster0 === null) return "";
                    return rowData.geoMaster0.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: ['level', '=', 0],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster0Id = value;
                    rowData.geoMaster1Id = null;
                    rowData.geoMaster2Id = null;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
            },
            {
                dataField: "geoMaster1Id",
                caption: l1("GeoLevel1Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoMaster1 || rowData.geoMaster1 === null) return "";
                    return rowData.geoMaster1.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 1], 'and', ['parentId', '=', options.data.geoMaster0Id]] : ['level', '=', 1],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster1Id = value;
                    rowData.geoMaster2Id = null;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
            },
            {
                dataField: "geoMaster2Id",
                caption: l1("GeoLevel2Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoMaster2 || rowData.geoMaster2 === null) return "";
                    return rowData.geoMaster2.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 2], 'and', ['parentId', '=', options.data.geoMaster1Id]] : ['level', '=', 2],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster2Id = value;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
            },
            {
                dataField: "geoMaster3Id",
                caption: l1("GeoLevel3Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoMaster3 || rowData.geoMaster3 === null) return "";
                    return rowData.geoMaster3.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 3], 'and', ['parentId', '=', options.data.geoMaster2Id]] : ['level', '=', 3],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster3Id = value;
                    rowData.geoMaster4Id = null;
                },
            },
            {
                dataField: "geoMaster4Id",
                caption: l1("GeoLevel4Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoMaster4 || rowData.geoMaster4 === null) return "";
                    return rowData.geoMaster4.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 4], 'and', ['parentId', '=', options.data.geoMaster3Id]] : ['level', '=', 4],
                            paginate: true,
                            pageSize
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster4Id = value;
                },
            },
            {
                dataField: 'street',
                caption: l("Street"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'address',
                caption: l("Address"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'latitude',
                caption: l("Latitude"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'longitude',
                caption: l("Longitude"),
                dataType: 'string',
                visible: false
            },
            ...await genCustomerAttrColumn()
        ],
        onInitNewRow: function (e) {
            e.data.effectiveDate = new Date().toISOString();
            e.data.active = true;
        },
    }).dxDataGrid("instance");

    initImportPopup('api/mdm-service/customers', 'Customers_Template', 'dgCustomers');

    function dsAttrValue(n) {
        return {
            store: getCusAttrValue,
            filter: ['customerAttribute.attrNo', '=', n],
        };
    }

    //var listAttrValue = [];
    function renderUserImage(data, itemElement) {
        // change in future versions
        function getuserImage(userId) {
            var d = new $.Deferred();
            /// Get avatar src attribute value here 
            Promise.resolve(d.resolve(null))
            return d.promise();
        }

        getuserImage("Customer Id Go Here").done(dataUrl => {
            itemElement.addClass("d-flex flex-column justify-content-center align-items-center");
            itemElement.append($("<img>").attr({
                id: "img-avatar",
                // https://source.unsplash.com/random/ for testing image size
                // /images/default-avatar-image.jpg for default image size
                src: dataUrl || "/images/default-avatar-image.jpg",
                style: "object-fit:contain;object-position:center center;max-height:200px;max-width:200px;cursor:pointer;border-radius:50%",
            }))
            itemElement.append($("<div>").addClass('mt-3 w-100').attr("id", "file-uploader").dxFileUploader({
                accept: 'image/*',
                uploadMode: 'instantly',
                uploadUrl: 'API_URL_POST', // Upload Image Endpoint Go Here
                selectButtonText: "Choose Image",
                onValueChanged(e) {
                    const files = e.value;
                    if (files.length > 0) {
                        $('#selected-files .selected-item').remove();
                        $.each(files, (i, file) => {
                            const $selectedItem = $('<div />').addClass('selected-item');
                            $selectedItem.append(
                                $('<span />').html(`Name: ${file.name}<br/>`),
                                $('<span />').html(`Size ${file.size} bytes<br/>`),
                                $('<span />').html(`Type ${file.type}<br/>`),
                                $('<span />').html(`Last Modified Date: ${file.lastModifiedDate}`),
                            );
                            $selectedItem.appendTo($('#selected-files'));
                        });
                        $('#selected-files').show();
                    } else {
                        $('#selected-files').hide();
                    }
                },
            }))
        })
    }
    function genCustomerAttrColumn() {
        return cusAttrStore.then(({ data }) =>
            data.map(({ attrNo, attrName }) => {
                return {
                    dataField: 'attr' + attrNo + 'Id',
                    caption: attrName,
                    lookup: {
                        valueExpr: "id",
                        displayExpr: "attrValName",
                        dataSource: {
                            store: getCusAttrValue,
                            filter: ['customerAttribute.attrNo', '=', attrNo],
                        }
                    }
                }
            })
        )
    }
    function getAttrOptions() {
        let res = []
        cusAttrStore.then(({ data }) => {
            data.forEach(e => { res.push(generateAttrOptions(e)) })
        })
        return res
    }
    function generateAttrOptions(attr) {
        return {
            dataField: 'attr' + attr.attrNo + 'Id',
            label: {
                text: attr.attrName
            },
            editorOptions: {
                dataSource: dsAttrValue(attr.attrNo), //listAttrValue.filter(x => x.itemAttributeId == attr.id),
                valueExpr: 'id',
                displayExpr: 'attrValName'
            }
        }
    }
});
