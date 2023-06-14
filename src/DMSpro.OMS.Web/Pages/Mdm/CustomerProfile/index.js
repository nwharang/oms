$(async function () {
    let l = abp.localization.getResource("OMS");
    let customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    let cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.customerAttributeValues.customerAttributeValue;
    let cusAttrService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
    let customerImageService = window.dMSpro.oMS.mdmService.controllers.customerImages.customerImage;
    let geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
    let priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    let companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;

    let gridInfo = {}, endDateRowData;
    let cusAttrStore = cusAttrService.getListDevextremes({ filter: JSON.stringify(['active', "=", true]) })

    let loadingPanel = $('<div class"fixed"/>').dxPopup({
        height: 100,
        width: 100,
        showTitle: false,
        animation: null,
        contentTemplate: (e) => $('<div/>').dxLoadIndicator({
            height: 60,
            width: 60,
        })
    })
        .appendTo('body')
        .dxPopup('instance')
    loadingPanel.registerKeyHandler('escape', () => loadingPanel.hide())

    let dialog = ({ header, body }, callBackIfTrue, callBackIfFalse) => {
        DevExpress.ui.dialog.confirm(`<i>${body}</i>`, header)
            .done((e) => {
                if (e) {
                    callBackIfTrue()
                }
                else {
                    callBackIfFalse()
                }
            })
    }


    let endDatePopup = $('<div/>').dxPopup({
        showTitle: false,
        width: 400,
        height: 150,
        onShowing: () => {
            $('#inactive-dateBox').dxDateBox('instance').option('value', moment().add(1, 'd').format('YYYY-MM-DD[T00:00:00Z]'))
            // Reset Date Box Data Value to today + 1 
        },
        toolbarItems: [
            {
                widget: "dxButton",
                location: "after",
                toolbar: "bottom",
                options: {
                    text: l('Button.Inactive.Customer'),
                    onClick: () => {
                        // Localize This
                        dialog({ header: l("Dialog:MDMService:Customer:Inactive.Header"), body: l("Dialog:MDMService:Customer:Inactive.Body").replace('{0}', endDateRowData.name) },
                            () => {
                                customerService.inactive(endDateRowData.id, moment($('#inactive-dateBox').dxDateBox('instance').option('value')).format('YYYY-MM-DD[T00:00:00Z]')).then(() => {
                                    gridCustomers.refresh()
                                    endDatePopup.hide()
                                })
                            },
                            () => {
                                endDateRowData = undefined
                                endDatePopup.hide()
                            }
                        )
                    }
                },
            },
            {
                widget: "dxButton",
                location: "after",
                toolbar: "bottom",
                options: {
                    text: l("Button.Cancel"),
                    onClick: () => endDatePopup.hide()
                },
            },
        ],
        contentTemplate: () => {
            return $('<div id="inactive-dateBox">').dxDateBox({
                value: moment().add(1, 'd').format('YYYY-MM-DD[T00:00:00Z]'),
                min: moment().add(1, 'd').format('YYYY-MM-DD[T00:00:00Z]'),
                format: 'dd-MM-yyyy',
            })
        }
    }).appendTo('body').dxPopup('instance')


    let companiesLookup = new DevExpress.data.CustomStore({
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
                onHiding: (e) => {
                    gridInfo.editingRowId = null;
                    gridInfo.currentData = null;
                    gridInfo.imageContent = null;
                    gridInfo.generalContent = null;
                    gridInfo.form = null
                },
            },
            form: {
                labelMode: "outside",
                colCount: 2,
                elementAttr: {
                    id: "customerForm",
                },
                items: [
                    {
                        itemType: "group",
                        template: renderItemImage
                    },
                    {
                        itemType: "group",
                        items: ["code", 'name', 'phone1', 'phone2', 'erpCode', 'priceListId'],
                    },
                    {
                        itemType: "tabbed",
                        colSpan: 2,
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
                                        dataField: 'paymentTermId'
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
                                items: ['license', 'taxCode', 'vatName', 'vatAddress', { itemType: 'empty' }]
                            },
                            {
                                title: "ADDRESS",
                                items: ['geoMaster0Id', 'geoMaster1Id', 'geoMaster2Id', 'geoMaster3Id', 'geoMaster4Id', 'street', 'address', 'latitude', 'longitude', { itemType: 'empty' }]
                            },
                            {
                                title: 'ATTRIBUTE',
                                colCount: 2,
                                items: [...await getAttrOptions(), { itemType: 'empty' }, { itemType: 'empty' }],
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
            allowedPageSizes,
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
                alignment: 'left',
                buttons: [
                    {
                        name: 'edit',
                        onClick: (e) => {
                            gridInfo.editingRowId = e.row.data.id;
                            gridCustomers.editRow(e.row.rowIndex);
                        }
                    },
                    , 'delete', {
                        name: 'inactive',
                        text: l("EntityFieldValue:MDMService:Customer:Active:False"),
                        icon: 'close',
                        visible: (e) => e.row.data.active,
                        onClick: (e) => {
                            endDateRowData = e.row.data
                            endDatePopup.show()
                        },
                    }],
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
                caption: l("Code"),
                dataType: 'string',
                allowEditing: false,
            },
            {
                dataField: 'name',
                caption: l("Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }],
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
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{10,50}$',
                        message: l('ValidateError:License')
                    }
                ],
            },
            {
                dataField: 'taxCode',
                caption: l("TaxCode"),
                dataType: 'string',
                visible: false,
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{1,13}$',
                        message: l('ValidateError:TaxCode')
                    }
                ],
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
                visible: false,
                validationRules: [
                    {
                        type: "stringLength",
                        max: 200,
                        message: l('WarnMessage.FieldLength').replace("{0}", 200)
                    }
                ]
            },
            // {
            //     dataField: 'sfaCustomerCode',
            //     caption: l("SfaCustomerCode"),
            //     dataType: 'string',
            //     //validationRules: [{ type: "required" }]
            // },
            // {
            //     dataField: 'active',
            //     caption: l("Active"),
            //     width: 110,
            //     alignment: 'center',
            //     dataType: 'boolean',
            //     cellTemplate(container, options) {
            //         $('<div>')
            //             .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
            //             .appendTo(container);
            //     },
            // },
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
                dataField: 'paymentTermId',
                caption: l("PaymentTerm"),
                dataType: 'string',
                visible: false,
                allowEditing: false,
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
                caption: l("GeoLevel0Name"),
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
                caption: l("GeoLevel1Name"),
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
                caption: l("GeoLevel2Name"),
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
                caption: l("GeoLevel3Name"),
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
                caption: l("GeoLevel4Name"),
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
                visible: false,
                validationRules: [
                    {
                        type: "stringLength",
                        max: 200,
                        message: l('WarnMessage.FieldLength').replace("{0}", 200)
                    }
                ]
            },
            {
                dataField: 'address',
                caption: l("Address"),
                dataType: 'string',
                visible: false,
                validationRules: [
                    {
                        type: "stringLength",
                        max: 200,
                        message: l('WarnMessage.FieldLength').replace("{0}", 200)
                    }
                ]
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
        onEditorPreparing: (e) => {
            if (e.row?.rowType != 'data') return
            console.log(new Date());
            // ReadOnly when editing , allow when creating a new row
            if (e.dataField == 'endDate' && !e.row.isNewRow)
                e.editorOptions.readOnly = true
            if (e.row?.data?.endDate && moment(e.row.data.endDate).isBefore(moment())) {
                e.editorOptions.readOnly = true
            }
        },
        onSaved: (e) => {
            if (gridInfo.fileinput) gridInfo.fileinput(e);
        }
    }).dxDataGrid("instance");

    initImportPopup('api/mdm-service/customers', 'Customers_Template', 'dgCustomers');

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
        return cusAttrStore.then(({ data }) => data.map(({ attrNo }) => 'attr' + attrNo + 'Id'))
    }

    async function renderItemImage(e, itemElement) {
        let fileId = await customerImageService.getListDevextremes({ filter: JSON.stringify([['customerId', '=', gridInfo.editingRowId], 'and', ['isAvatar', '=', true]]) }).then(({ data }) => data[0]?.fileId)
        editingRowId = gridInfo.editingRowId
        if (fileId) var imgURL = await customerImageService.getFile(fileId, {
            dataType: 'binary',
            xhrFields: {
                'responseType': 'blob'
            },
        }).then((blob) => URL.createObjectURL(blob))
        itemElement.addClass('d-flex flex-column justify-content-center align-items-center').css('height', '300px');
        gridInfo.form = $('<div class="flex-column"/>').css({ 'height': '250px', 'display': 'flex' })
        let imgContainer = $('<div/>').css({ 'min-height': '250px', 'min-width': "250px" }).appendTo(itemElement);
        let img = $('<img class="w-100 h-100"/>').attr('src', imgURL || '/images/default-avatar-image.jpg').css({ 'object-fit': 'contain', 'object-position': 'center' }).appendTo(imgContainer)
        let fileinput = $('<input class="form-control mt-2" type="file" id="avatar" name="avatar" accept="image/*">').appendTo(gridInfo.form)
        fileinput.on('change', () => {
            if (fileinput.prop('files')[0].size > 1.5e7) return abp.message.error(l('ValidateError:UploadFileSize'), 500)
            img.attr('src', URL.createObjectURL(fileinput.prop('files')[0]))
            gridInfo.fileinput = (e) => {
                let file = fileinput.prop('files')[0]
                let form = new FormData();
                form.append('inputFile', file, file.name);
                let description = JSON.stringify({ name: file.name, size: file.size, type: file.type })
                loadingPanel.show()
                customerImageService[fileId ? 'updateAvatar' : 'createAvatar'](editingRowId || e.changes[0]?.data?.id, file, description,
                    {
                        contentType: false,
                        processData: false,
                        data: form,
                        async: true,
                    }).then(() => {
                        loadingPanel.hide()
                    })
                gridInfo.fileinput = null
            }
        })
        gridInfo.form.appendTo(itemElement)
    }
});
