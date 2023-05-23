$(async function () {
    let l = abp.localization.getResource("OMS");
    let customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    let cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.customerAttributeValues.customerAttributeValue;
    let cusAttrService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
    let employeeImageService = window.dMSpro.oMS.mdmService.controllers.customerImages.customerImage;
    let geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
    let priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    let companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;

    let gridInfo = {}
    let cusAttrStore = cusAttrService.getListDevextremes({ filter: JSON.stringify(['active', "=", true]) })

    let store = {
        imageStore: new DevExpress.data.CustomStore({
            key: 'id',
            load: (loadOptions) => {
                const args = {};
                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                return employeeImageService.getListDevextremes(args)
                    .then(({ data }) => Promise.all(data.map(async imageInfo => {
                        return {
                            ...imageInfo,
                            url: await fetch("/api/mdm-service/customer-images/get-file?id=" + imageInfo.fileId)
                                .then(res => res.blob())
                                .then(data => URL.createObjectURL(data))
                        }
                    })))
                    .then(data => data.sort((a, b) => a.displayOrder - b.displayOrder));
            },
        }),
    }

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
                    gridInfo.description = null;
                    gridInfo.imageContent = null;
                    gridInfo.generalContent = null;
                    gridInfo.imageDataSource = null;
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
                        items: ["code", 'name', 'phone1', 'phone2', 'erpCode', 'priceListId', 'active'],
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
                                items: ['license', 'taxCode', 'vatName', 'vatAddress']
                            },
                            {
                                title: "ADDRESS",
                                items: ['geoMaster0Id', 'geoMaster1Id', 'geoMaster2Id', 'geoMaster3Id', 'geoMaster4Id', 'street', 'address', 'latitude', 'longitude']
                            },
                            {
                                title: 'ATTRIBUTE',
                                colCount: 2,
                                items: await getAttrOptions(),
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
                buttons: [
                    {
                        name: 'edit',
                        onClick: (e) => {
                            gridInfo.editingRowId = e.row.data.id;
                            gridCustomers.editRow(e.row.rowIndex);
                        }
                    },
                    , 'delete'],
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
            // ReadOnly when editing , allow when creating a new row
            if (e.dataField == 'endDate' && !e.row.isNewRow)
                e.editorOptions.readOnly = true
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

        itemElement.addClass('d-flex justify-content-center align-items-center').css('height', '300px');


        let loadingImage = $('<div class="justify-content-center align-items-center w-100 h-100 rounded"/>').css({ 'display': 'flex' })
            .append($('<div/>').dxLoadIndicator({
                height: 75,
                width: 75,
            }))
            .appendTo(itemElement);


        gridInfo.form = $('<div class="w-50 flex-column"/>').css({ 'height': '300px', 'display': 'flex' })


        let description = $('<div class="flex-grow-1"/>').dxTextArea({
            value: "",
            width: '100%',
            height: '100%',
            label: l("EntityFieldName:MDMService:EmployeeImage:Description"),
            valueChangeEvent: 'keyup',
            onValueChanged: () => uploadUrl()
        }).appendTo(gridInfo.form).dxTextArea('instance')

        let fileUploader = $('<div/>').dxFileUploader({
            accept: 'image/*',
            labelText: "",
            uploadMode: 'instantly',
            uploadUrl: `/api/mdm-service/customer-images/avatar?customerId=${gridInfo.editingRowId}&description=${description.option('value')}`,
            selectButtonText: l('Button.New.EmployeeImage'),
            name: 'inputFile',
            showFileList: false,
            disabled: !gridInfo.editingRowId,
            onBeforeSend: (e) => {
                if (e.file.size > 1.5e7) {
                    e.component.abortUpload()
                    return abp.message.error(l('ValidateError:UploadFileSize'), '500')
                }
                var fr = new FileReader;
                fr.onload = function () {
                    var img = new Image;
                    img.onload = () => {
                        if (img.width > 1024 || img.height > 1024) {
                            e.component.abortUpload()
                            return abp.message.error(l('ValidateError:UploadImageSize'), '500')
                        }
                    };
                    img.src = fr.result;
                };
                fr.readAsDataURL(e.file)
                e.request.setRequestHeader('RequestVerificationToken', abp.utils.getCookieValue('XSRF-TOKEN'))
            },
            onUploaded: () => {
                gridInfo.imageDataSource.reload()
            },
        })
            .appendTo(gridInfo.form)
            .dxFileUploader('instance')

        function uploadUrl() {
            fileUploader.option('uploadUrl', `/api/mdm-service/customer-images/avatar?customerId=${gridInfo.editingRowId}&description=${description.option('value') || ""}`)
        }

        gridInfo.imageDataSource = new DevExpress.data.DataSource({
            store: store.imageStore,
            filter: ['customerId', '=', gridInfo.editingRowId],
            onLoadingChanged: () => {
                loadingImage?.show()
                gridInfo.form?.hide()
                gridInfo.imageGallery?.element()?.hide()
            },
            onChanged: () => {
                loadingImage.hide()
                gridInfo.form?.show()
                gridInfo.imageGallery?.element()?.show()
                fileUploader?.option('uploadMethod', gridInfo.imageDataSource.items().length > 0 ? "PUT" : "POST")
            }
        })
        await gridInfo.imageDataSource.load({})

        gridInfo.imageGallery = $("<div class='w-50 '>").dxGallery({
            dataSource: gridInfo.imageDataSource,
            height: 300,
            showIndicator: false,
            itemTemplate: (item) => {
                description.option('value', item.description)
                return $('<div class="d-flex p-2">').append($('<img class="rounded"/>').attr('src', item.url).css({ 'object-fit': 'contain', 'object-position': 'top', 'height': '100%', 'width': "100%" }));
            },
        }).appendTo(itemElement).dxGallery('instance')

        gridInfo.form.appendTo(itemElement)
    }

});
