$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMS");

    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
    var cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.cusAttributeValues.cusAttributeValue;
    var cusAttrService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;

    var geoMasterStore = new DevExpress.data.CustomStore({
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
                    //console.log('data:', result)
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

    var cusProfile = {};

    var gridCustomers = $('#dgCustomers').dxDataGrid({
        dataSource: customStore,
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
            //popup: {
            //    title: l("Page.Title.Customers"),
            //    showTitle: true,
            //    width: '95%',
            //    height: '90%',
            //},
            //form: {
            //    elementAttr: {
            //        id: 'formEditing',
            //        class: 'formEditing'
            //    },
            //    labelMode: 'floating',
            //    colCount: 10,
            //    items: [
            //        {
            //            itemType: 'group',
            //            colCount: 2,
            //            colSpan: 8,
            //            items: [
            //                {
            //                    itemType: 'group',
            //                    caption: 'General',
            //                    colSpan: 4,
            //                    items: [
            //                        {
            //                            dataField: 'code'
            //                        },
            //                        {
            //                            dataField: 'name'
            //                        },
            //                        {
            //                            dataField: 'phone1'
            //                        },
            //                        {
            //                            dataField: 'phone2'
            //                        },
            //                        {
            //                            dataField: 'erpCode'
            //                        },
            //                        {
            //                            dataField: 'active',
            //                            //colSpan: 2
            //                        }
            //                    ]
            //                },
            //                {
            //                    itemType: 'group',
            //                    caption: 'System Information',
            //                    colCount: 2,
            //                    colSpan: 4,
            //                    items: [
            //                        {
            //                            itemType: 'group',
            //                            items: [
            //                                {
            //                                    dataField: 'priceListId'
            //                                },
            //                                //{
            //                                //    dataField: 'warehouseId'
            //                                //},
            //                                {
            //                                    dataField: 'license'
            //                                },
            //                                {
            //                                    dataField: 'taxCode'
            //                                },
            //                                {
            //                                    dataField: 'vatName'
            //                                },
            //                                {
            //                                    dataField: 'vatAddress'
            //                                }
            //                            ]
            //                        },
            //                        {
            //                            itemType: 'group',
            //                            items: [
            //                                {
            //                                    dataField: 'effectiveDate',
            //                                    editorType: "dxDateBox"
            //                                },
            //                                {
            //                                    dataField: 'endDate',
            //                                    editorType: "dxDateBox"
            //                                },
            //                                {
            //                                    dataField: 'lastOrderDate',
            //                                    editorType: "dxDateBox"
            //                                },
            //                                {
            //                                    dataField: 'creditLimit'
            //                                },
            //                                {
            //                                    dataField: 'paymentTermId'
            //                                },
            //                                {
            //                                    dataField: 'linkedCompanyId'
            //                                },
            //                                {
            //                                    dataField: 'sfaCustomerCode'
            //                                },
            //                                {
            //                                    dataField: 'isCompany'
            //                                }
            //                            ]
            //                        }
            //                    ]
            //                },
            //            ]
            //        },
            //        {
            //            itemType: 'group',
            //            caption: 'DMS Attribute',
            //            colSpan: 2,
            //            items: getAttrOptions()
            //        },
            //        //{
            //        //    itemType: 'group',
            //        //    caption: '',
            //        //    items: [{
            //        //        itemType: 'tabbed',
            //        //        tabPanelOptions: {
            //        //            deferRendering: false,
            //        //            height: 440
            //        //        },
            //        //        tabs: [{
            //        //            title: 'IMAGE',
            //        //            colCount: 3,
            //        //            items: [
            //        //                {
            //        //                    itemType: "group",
            //        //                    colSpan: 2,
            //        //                    colCount: 1,
            //        //                    items: [{
            //        //                        dataField: "url",
            //        //                        caption: "",
            //        //                        label: {
            //        //                            text: "",
            //        //                        },
            //        //                        template: function (data, itemElement) {
            //        //                            itemElement.append("<img style='width: 300px; height: 280px' src='" + data.editorOptions.value + "'>");
            //        //                        }
            //        //                    }]
            //        //                },
            //        //                {
            //        //                    itemType: "group",
            //        //                    colSpan: 1,
            //        //                    items: ["active", "isAvatar", {
            //        //                        dataField: "creationTime",
            //        //                        editorType: "dxDateBox",
            //        //                    }]
            //        //                }]
            //        //        }, {
            //        //            title: 'ADDRESS',
            //        //            colCount: 2,
            //        //            items: [
            //        //                {
            //        //                    itemType: "group",
            //        //                    items: ["geoMaster0Id", "geoMaster1Id", "geoMaster2Id", "geoMaster3Id", "geoMaster4Id",
            //        //                        "street", "address", "latitude", "longitude"]
            //        //                },
            //        //                {
            //        //                    itemType: "group",
            //        //                    items: [{
            //        //                        template: function (data, itemElement) {
            //        //                            const mapsDiv = $("<div style='padding:15px; min-height: 320px;'>")
            //        //                            mapsDiv.dxMap({
            //        //                                center: { lat: cusProfile.latitude, lng: cusProfile.longitude },
            //        //                                controls: true,
            //        //                                zoom: 14,
            //        //                                height: 380,
            //        //                                width: '100%',
            //        //                                provider: 'google',
            //        //                                apiKey: {
            //        //                                    // Specify your API keys for each map provider:
            //        //                                    // bing: "YOUR_BING_MAPS_API_KEY",
            //        //                                    // google: "YOUR_GOOGLE_MAPS_API_KEY",
            //        //                                    // googleStatic: "YOUR_GOOGLE_STATIC_MAPS_API_KEY"
            //        //                                },
            //        //                            });
            //        //                            mapsDiv.appendTo(itemElement);
            //        //                        }
            //        //                    }]
            //        //                }],
            //        //        },
            //        //        //{
            //        //        //    title: 'ATTRIBUTE',
            //        //        //    colCount: 4,
            //        //        //    items: ["attribute0Id", "attribute1Id", "attribute2Id", "attribute3Id", "attribute4Id", "attribute5Id", "attribute6Id", "attribute7Id", "attribute8Id", "attribute9Id",
            //        //        //        "attribute10Id", "attribute11Id", "attribute12Id", "attribute13Id", "attribute14Id", "attribute15Id", "attribute16Id", "attribute17Id", "attribute18Id", "attribute19Id"]
            //        //        //},
            //        //        {
            //        //            title: 'CONTACT',
            //        //            template: function (itemData, itemIndex, element) {
            //        //                const gridDiv = $("<div style='padding:15px; min-height: 320px;'>")
            //        //                var cusContactGrid = gridDiv.dxDataGrid({
            //        //                    dataSource: cusContactStore,
            //        //                    //keyExpr: "id",
            //        //                    editing: {
            //        //                        mode: "row",
            //        //                        allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
            //        //                        allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
            //        //                        allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
            //        //                        useIcons: true,
            //        //                        texts: {
            //        //                            editRow: l("Edit"),
            //        //                            deleteRow: l("Delete"),
            //        //                            confirmDeleteMessage: l("DeleteConfirmationMessage")
            //        //                        }
            //        //                    },
            //        //                    remoteOperations: true,
            //        //                    showRowLines: true,
            //        //                    showBorders: true,
            //        //                    cacheEnabled: true,
            //        //                    allowColumnReordering: true,
            //        //                    rowAlternationEnabled: true,
            //        //                    allowColumnResizing: true,
            //        //                    columnResizingMode: 'widget',
            //        //                    columnAutoWidth: true,
            //        //                    filterRow: {
            //        //                        visible: true
            //        //                    },
            //        //                    groupPanel: {
            //        //                        visible: true,
            //        //                    },
            //        //                    searchPanel: {
            //        //                        visible: true
            //        //                    },
            //        //                    columnMinWidth: 50,
            //        //                    columnChooser: {
            //        //                        enabled: true,
            //        //                        mode: "select"
            //        //                    },
            //        //                    columnFixing: {
            //        //                        enabled: true,
            //        //                    },
            //        //                    export: {
            //        //                        enabled: true,
            //        //                    },
            //        //                    onExporting(e) {
            //        //                        const workbook = new ExcelJS.Workbook();
            //        //                        const worksheet = workbook.addWorksheet('Data');

            //        //                        DevExpress.excelExporter.exportDataGrid({
            //        //                            component: e.component,
            //        //                            worksheet,
            //        //                            autoFilterEnabled: true,
            //        //                        }).then(() => {
            //        //                            workbook.xlsx.writeBuffer().then((buffer) => {
            //        //                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Contact.xlsx');
            //        //                            });
            //        //                        });
            //        //                        e.cancel = true;
            //        //                    },
            //        //                    headerFilter: {
            //        //                        visible: true,
            //        //                    },
            //        //                    stateStoring: {
            //        //                        enabled: true,
            //        //                        type: 'localStorage',
            //        //                        storageKey: 'gridContact',
            //        //                    },
            //        //                    paging: {
            //        //                        enabled: true,
            //        //                        pageSize: pageSize
            //        //                    },
            //        //                    pager: {
            //        //                        visible: true,
            //        //                        showPageSizeSelector: true,
            //        //                        allowedPageSizes: allowedPageSizes,
            //        //                        showInfo: true,
            //        //                        showNavigationButtons: true
            //        //                    },
            //        //                    onRowInserting: function (e) {
            //        //                        e.data.customerId = cusProfile.id;
            //        //                    },
            //        //                    onRowUpdating: function (e) {
            //        //                        e.newData = Object.assign({}, e.oldData, e.newData);
            //        //                    },
            //        //                    toolbar: {
            //        //                        items: [
            //        //                            "groupPanel",
            //        //                            {
            //        //                                location: 'after',
            //        //                                template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
            //        //                                onClick() {
            //        //                                    cusContactGrid.addRow();
            //        //                                },
            //        //                            },
            //        //                            'columnChooserButton',
            //        //                            "exportButton",
            //        //                            {
            //        //                                location: 'after',
            //        //                                template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
            //        //                                onClick() {
            //        //                                    //todo
            //        //                                },
            //        //                            },
            //        //                            "searchPanel"
            //        //                        ],
            //        //                    },
            //        //                    columns: [
            //        //                        {
            //        //                            type: 'buttons',
            //        //                            caption: l("Actions"),
            //        //                            width: 110,
            //        //                            buttons: ['edit', 'delete'],
            //        //                            fixedPosition: 'left'
            //        //                        },
            //        //                        {
            //        //                            dataField: 'customerId',
            //        //                            caption: l("CustomerId"),
            //        //                            dataType: 'string',
            //        //                            visible: false
            //        //                        },
            //        //                        {
            //        //                            dataField: 'firstName',
            //        //                            caption: l1("FirstName"),
            //        //                            dataType: 'string',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'lastName',
            //        //                            caption: l1("LastName"),
            //        //                            dataType: 'string',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'gender',
            //        //                            caption: l1("Gender"),
            //        //                            dataType: 'string',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'phone',
            //        //                            caption: l1("Phone"),
            //        //                            dataType: 'string',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'email',
            //        //                            caption: l1("Email"),
            //        //                            dataType: 'string',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'address',
            //        //                            caption: l1("Address"),
            //        //                            dataType: 'string',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'identityNumber',
            //        //                            caption: l1("IdentityNumber"),
            //        //                        },
            //        //                        {
            //        //                            dataField: 'bankName',
            //        //                            caption: l1("BankName"),
            //        //                        },
            //        //                        {
            //        //                            dataField: 'bankAccName',
            //        //                            caption: l1("BankAccName"),
            //        //                        },
            //        //                        {
            //        //                            dataField: 'bankAccNumber',
            //        //                            caption: l1("BankAccNumber"),
            //        //                        },
            //        //                    ],
            //        //                }).dxDataGrid("instance");
            //        //                gridDiv.appendTo(element);
            //        //            }
            //        //        }, {
            //        //            title: 'ATTACHMENT',
            //        //            template: function (itemData, itemIndex, element) {
            //        //                const gridDiv = $("<div style='padding:15px; min-height: 320px;'>")
            //        //                var cusAttachGrid = gridDiv.dxDataGrid({
            //        //                    dataSource: cusAttachStore,
            //        //                    keyExpr: "id",
            //        //                    editing: {
            //        //                        mode: "row",
            //        //                        allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
            //        //                        allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
            //        //                        allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
            //        //                        useIcons: true,
            //        //                        texts: {
            //        //                            editRow: l("Edit"),
            //        //                            deleteRow: l("Delete"),
            //        //                            confirmDeleteMessage: l("DeleteConfirmationMessage")
            //        //                        }
            //        //                    },
            //        //                    remoteOperations: true,
            //        //                    showRowLines: true,
            //        //                    showBorders: true,
            //        //                    cacheEnabled: true,
            //        //                    allowColumnReordering: true,
            //        //                    rowAlternationEnabled: true,
            //        //                    allowColumnResizing: true,
            //        //                    columnResizingMode: 'widget',
            //        //                    columnAutoWidth: true,
            //        //                    filterRow: {
            //        //                        visible: true
            //        //                    },
            //        //                    groupPanel: {
            //        //                        visible: true,
            //        //                    },
            //        //                    searchPanel: {
            //        //                        visible: true
            //        //                    },
            //        //                    columnMinWidth: 50,
            //        //                    columnChooser: {
            //        //                        enabled: true,
            //        //                        mode: "select"
            //        //                    },
            //        //                    columnFixing: {
            //        //                        enabled: true,
            //        //                    },
            //        //                    export: {
            //        //                        enabled: true,
            //        //                    },
            //        //                    onExporting(e) {
            //        //                        const workbook = new ExcelJS.Workbook();
            //        //                        const worksheet = workbook.addWorksheet('Data');

            //        //                        DevExpress.excelExporter.exportDataGrid({
            //        //                            component: e.component,
            //        //                            worksheet,
            //        //                            autoFilterEnabled: true,
            //        //                        }).then(() => {
            //        //                            workbook.xlsx.writeBuffer().then((buffer) => {
            //        //                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Attachment.xlsx');
            //        //                            });
            //        //                        });
            //        //                        e.cancel = true;
            //        //                    },
            //        //                    headerFilter: {
            //        //                        visible: true,
            //        //                    },
            //        //                    stateStoring: {
            //        //                        enabled: true,
            //        //                        type: 'localStorage',
            //        //                        storageKey: 'gridAttachment',
            //        //                    },
            //        //                    paging: {
            //        //                        enabled: true,
            //        //                        pageSize: pageSize
            //        //                    },
            //        //                    pager: {
            //        //                        visible: true,
            //        //                        showPageSizeSelector: true,
            //        //                        allowedPageSizes: allowedPageSizes,
            //        //                        showInfo: true,
            //        //                        showNavigationButtons: true
            //        //                    },
            //        //                    onRowInserting: function (e) {
            //        //                        e.data.customerId = cusProfile.id;
            //        //                    },
            //        //                    onRowUpdating: function (e) {
            //        //                        e.newData = Object.assign({}, e.oldData, e.newData);
            //        //                    },
            //        //                    toolbar: {
            //        //                        items: [
            //        //                            "groupPanel",
            //        //                            {
            //        //                                location: 'after',
            //        //                                template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
            //        //                                onClick() {
            //        //                                    cusAttachGrid.addRow();
            //        //                                },
            //        //                            },
            //        //                            'columnChooserButton',
            //        //                            "exportButton",
            //        //                            {
            //        //                                location: 'after',
            //        //                                template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
            //        //                                onClick() {
            //        //                                    //todo
            //        //                                },
            //        //                            },
            //        //                            "searchPanel"
            //        //                        ],
            //        //                    },
            //        //                    columns: [
            //        //                        {
            //        //                            type: 'buttons',
            //        //                            caption: l("Actions"),
            //        //                            width: 110,
            //        //                            buttons: ['edit', 'delete'],
            //        //                            fixedPosition: 'left'
            //        //                        },
            //        //                        {
            //        //                            dataField: 'customerId',
            //        //                            caption: l("CustomerId"),
            //        //                            dataType: 'string',
            //        //                            visible: false
            //        //                        },
            //        //                        {
            //        //                            dataField: 'description',
            //        //                            caption: l("Description"),
            //        //                            dataType: 'string',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'url',
            //        //                            caption: l("Url"),
            //        //                            dataType: 'string',
            //        //                            cellTemplate: function (element, info) {
            //        //                                element.append("<a href='#'>" + info.text + "</a>")
            //        //                                    .css("color", "blue");
            //        //                            }
            //        //                        },
            //        //                        {
            //        //                            dataField: 'creationTime',
            //        //                            caption: l1("CreationTime"),
            //        //                            width: 150,
            //        //                            dataType: 'date',
            //        //                        },
            //        //                        {
            //        //                            dataField: 'active',
            //        //                            caption: l("Active"),
            //        //                            width: 120,
            //        //                            alignment: 'center',
            //        //                            dataType: 'boolean',
            //        //                            cellTemplate(container, options) {
            //        //                                $('<div>')
            //        //                                    .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
            //        //                                    .appendTo(container);
            //        //                            },
            //        //                        }
            //        //                    ],
            //        //                }).dxDataGrid("instance");
            //        //                gridDiv.appendTo(element);
            //        //            }
            //        //        }],
            //        //    }],
            //        //}
            //    ]
            //}

            //form: {
            //    labelMode: 'floating',
            //    colCount: 10,
            //    items: [{
            //        //itemType: 'group',
            //        //colCount: 3,
            //        //caption: '',
            //        //items: ['code', 'name', 'priceListId', 'phone1', 'phone2', 'active', {
            //        //    dataField: 'effectiveDate',
            //        //    editorType: "dxDateBox",
            //        //}, {
            //        //    dataField: 'endDate',
            //        //    editorType: "dxDateBox",
            //        //}, 'paymentTermId', 'creditLimit', 'taxCode', 'license', 'sfaCustomerCode'],

            //        itemType: 'group',
            //        cssClass: 'first-group',
            //        colCount: 2,
            //        colSpan: 8,
            //        items: [
            //            {
            //                itemType: 'group',
            //                caption: 'General',
            //                colSpan: 4,
            //                items: [
            //                    {
            //                        dataField: 'code'
            //                    },
            //                    {
            //                        dataField: 'name'
            //                    },
            //                    {
            //                        dataField: 'phone1'
            //                    },
            //                    {
            //                        dataField: 'phone2'
            //                    },
            //                    {
            //                        dataField: 'erpCode'
            //                    },
            //                    {
            //                        dataField: 'active',
            //                        colSpan: 2
            //                    }
            //                ]
            //            },
            //            {
            //                itemType: 'group',
            //                caption: 'System Information',
            //                colSpan: 4,
            //                colCount: 2,
            //                items: [
            //                    {
            //                        itemType: 'group',
            //                        items: [
            //                            {
            //                                dataField: 'priceListId'
            //                            },
            //                            {
            //                                dataField: 'warehouseId'
            //                            },
            //                            {
            //                                dataField: 'license'
            //                            },
            //                            {
            //                                dataField: 'taxCode'
            //                            },
            //                            {
            //                                dataField: 'vatName'
            //                            },
            //                            {
            //                                dataField: 'vatAddress'
            //                            },
            //                        ]
            //                    },
            //                    {
            //                        itemType: 'group',
            //                        items: [
            //                            {
            //                                dataField: 'effectiveDate',
            //                                editorType: "dxDateBox"
            //                            },
            //                            {
            //                                dataField: 'endDate',
            //                                editorType: "dxDateBox"
            //                            },
            //                            {
            //                                dataField: 'lastOrderDate',
            //                                editorType: "dxDateBox"
            //                            },
            //                            {
            //                                dataField: 'creditLimit'
            //                            },
            //                            {
            //                                dataField: 'paymentTermId'
            //                            },
            //                            {
            //                                dataField: 'linkedCompanyId'
            //                            },
            //                            {
            //                                dataField: 'isCompany'
            //                            }
            //                        ]
            //                    }
            //                ]
            //            },
            //            {
            //                itemType: 'group',
            //                cssClass: 'second-group',
            //                caption: 'DMS Attribute',
            //                colSpan: 2,
            //                items: getAttrOptions()
            //            }
            //        ]
            //    },
            //        {
            //        itemType: 'group',
            //        caption: '',
            //        items: [{
            //            itemType: 'tabbed',
            //            tabPanelOptions: {
            //                deferRendering: false,
            //                height: 440
            //            },
            //            tabs: [{
            //                title: 'IMAGE',
            //                colCount: 3,
            //                items: [
            //                    {
            //                        itemType: "group",
            //                        colSpan: 2,
            //                        colCount: 1,
            //                        items: [{
            //                            dataField: "url",
            //                            caption: "",
            //                            label: {
            //                                text: "",
            //                            },
            //                            template: function (data, itemElement) {
            //                                itemElement.append("<img style='width: 300px; height: 280px' src='" + data.editorOptions.value + "'>");
            //                            }
            //                        }]
            //                    },
            //                    {
            //                        itemType: "group",
            //                        colSpan: 1,
            //                        items: ["active", "isAvatar", {
            //                            dataField: "creationTime",
            //                            editorType: "dxDateBox",
            //                        }]
            //                    }]
            //            }, {
            //                title: 'ADDRESS',
            //                colCount: 2,
            //                items: [
            //                    {
            //                        itemType: "group",
            //                        items: ["geoMaster0Id", "geoMaster1Id", "geoMaster2Id", "geoMaster3Id", "geoMaster4Id",
            //                            "street", "address", "latitude", "longitude"]
            //                    },
            //                    {
            //                        itemType: "group",
            //                        items: [{
            //                            template: function (data, itemElement) {
            //                                const mapsDiv = $("<div style='padding:15px; min-height: 320px;'>")
            //                                mapsDiv.dxMap({
            //                                    center: { lat: cusProfile.latitude, lng: cusProfile.longitude },
            //                                    controls: true,
            //                                    zoom: 14,
            //                                    height: 380,
            //                                    width: '100%',
            //                                    provider: 'google',
            //                                    apiKey: {
            //                                        // Specify your API keys for each map provider:
            //                                        // bing: "YOUR_BING_MAPS_API_KEY",
            //                                        // google: "YOUR_GOOGLE_MAPS_API_KEY",
            //                                        // googleStatic: "YOUR_GOOGLE_STATIC_MAPS_API_KEY"
            //                                    },
            //                                });
            //                                mapsDiv.appendTo(itemElement);
            //                            }
            //                        }]
            //                    }],
            //            }, {
            //                title: 'ATTRIBUTE',
            //                colCount: 4,
            //                items: ["attribute0Id", "attribute1Id", "attribute2Id", "attribute3Id", "attribute4Id", "attribute5Id", "attribute6Id", "attribute7Id", "attribute8Id", "attribute9Id",
            //                    "attribute10Id", "attribute11Id", "attribute12Id", "attribute13Id", "attribute14Id", "attribute15Id", "attribute16Id", "attribute17Id", "attribute18Id", "attribute19Id"]
            //            }, {
            //                title: 'CONTACT',
            //                template: function (itemData, itemIndex, element) {
            //                    //const btnAddCusContact = $("<button type='button' class='btn btn-sm btn-outline-default waves-effect waves-themed'>")
            //                    const gridDiv = $("<div style='padding:15px; min-height: 320px;'>")
            //                    var cusContactGrid = gridDiv.dxDataGrid({
            //                        dataSource: cusContactStore,
            //                        //keyExpr: "id",
            //                        editing: {
            //                            mode: "row",
            //                            allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
            //                            allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
            //                            allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
            //                            useIcons: true,
            //                            texts: {
            //                                editRow: l("Edit"),
            //                                deleteRow: l("Delete"),
            //                                confirmDeleteMessage: l("DeleteConfirmationMessage")
            //                            }
            //                        },
            //                        remoteOperations: true,
            //                        showRowLines: true,
            //                        showBorders: true,
            //                        cacheEnabled: true,
            //                        allowColumnReordering: true,
            //                        rowAlternationEnabled: true,
            //                        allowColumnResizing: true,
            //                        columnResizingMode: 'widget',
            //                        columnAutoWidth: true,
            //                        filterRow: {
            //                            visible: true
            //                        },
            //                        groupPanel: {
            //                            visible: true,
            //                        },
            //                        searchPanel: {
            //                            visible: true
            //                        },
            //                        columnMinWidth: 50,
            //                        columnChooser: {
            //                            enabled: true,
            //                            mode: "select"
            //                        },
            //                        columnFixing: {
            //                            enabled: true,
            //                        },
            //                        export: {
            //                            enabled: true,
            //                        },
            //                        onExporting(e) {
            //                            const workbook = new ExcelJS.Workbook();
            //                            const worksheet = workbook.addWorksheet('Data');

            //                            DevExpress.excelExporter.exportDataGrid({
            //                                component: e.component,
            //                                worksheet,
            //                                autoFilterEnabled: true,
            //                            }).then(() => {
            //                                workbook.xlsx.writeBuffer().then((buffer) => {
            //                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Contact.xlsx');
            //                                });
            //                            });
            //                            e.cancel = true;
            //                        },
            //                        headerFilter: {
            //                            visible: true,
            //                        },
            //                        stateStoring: {
            //                            enabled: true,
            //                            type: 'localStorage',
            //                            storageKey: 'gridContact',
            //                        },
            //                        paging: {
            //                            enabled: true,
            //                            pageSize: pageSize
            //                        },
            //                        pager: {
            //                            visible: true,
            //                            showPageSizeSelector: true,
            //                            allowedPageSizes: allowedPageSizes,
            //                            showInfo: true,
            //                            showNavigationButtons: true
            //                        },
            //                        onRowInserting: function (e) {
            //                            e.data.customerId = cusProfile.id;
            //                        },
            //                        onRowUpdating: function (e) {
            //                            e.newData = Object.assign({}, e.oldData, e.newData);
            //                        },
            //                        toolbar: {
            //                            items: [
            //                                "groupPanel",
            //                                {
            //                                    location: 'after',
            //                                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
            //                                    onClick() {
            //                                        cusContactGrid.addRow();
            //                                    },
            //                                },
            //                                'columnChooserButton',
            //                                "exportButton",
            //                                {
            //                                    location: 'after',
            //                                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
            //                                    onClick() {
            //                                        //todo
            //                                    },
            //                                },
            //                                "searchPanel"
            //                            ],
            //                        },
            //                        columns: [
            //                            {
            //                                type: 'buttons',
            //                                caption: l("Actions"),
            //                                width: 110,
            //                                buttons: ['edit', 'delete'],
            //                                fixedPosition: 'left'
            //                            },
            //                            {
            //                                dataField: 'customerId',
            //                                caption: l("CustomerId"),
            //                                dataType: 'string',
            //                                visible: false
            //                            },
            //                            {
            //                                dataField: 'firstName',
            //                                caption: l1("FirstName"),
            //                                dataType: 'string',
            //                            },
            //                            {
            //                                dataField: 'lastName',
            //                                caption: l1("LastName"),
            //                                dataType: 'string',
            //                            },
            //                            {
            //                                dataField: 'gender',
            //                                caption: l1("Gender"),
            //                                dataType: 'string',
            //                            },
            //                            {
            //                                dataField: 'phone',
            //                                caption: l1("Phone"),
            //                                dataType: 'string',
            //                            },
            //                            {
            //                                dataField: 'email',
            //                                caption: l1("Email"),
            //                                dataType: 'string',
            //                            },
            //                            {
            //                                dataField: 'address',
            //                                caption: l1("Address"),
            //                                dataType: 'string',
            //                            },
            //                            {
            //                                dataField: 'identityNumber',
            //                                caption: l1("IdentityNumber"),
            //                            },
            //                            {
            //                                dataField: 'bankName',
            //                                caption: l1("BankName"),
            //                            },
            //                            {
            //                                dataField: 'bankAccName',
            //                                caption: l1("BankAccName"),
            //                            },
            //                            {
            //                                dataField: 'bankAccNumber',
            //                                caption: l1("BankAccNumber"),
            //                            },
            //                        ],
            //                    }).dxDataGrid("instance");
            //                    //btnAddCusContact.dxButton({
            //                    //    stylingMode: 'contained',
            //                    //    icon: 'plus',
            //                    //    text: l1("Button.New.CustomerContact"),
            //                    //    type: 'normal',
            //                    //    cssClass: 'btn btn-sm btn-outline-default waves-effect waves-themed',
            //                    //    onClick() {
            //                    //        cusContactGrid.addRow();
            //                    //    },
            //                    //});
            //                    //btnAddCusContact.appendTo(element);
            //                    gridDiv.appendTo(element);
            //                }
            //            }, {
            //                title: 'ATTACHMENT',
            //                template: function (itemData, itemIndex, element) {
            //                    //const btnAddCusAttach = $("<button type='button' class='btn btn-sm btn-outline-default waves-effect waves-themed'>")
            //                    const gridDiv = $("<div style='padding:15px; min-height: 320px;'>")
            //                    var cusAttachGrid = gridDiv.dxDataGrid({
            //                        dataSource: cusAttachStore,
            //                        keyExpr: "id",
            //                        editing: {
            //                            mode: "row",
            //                            allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
            //                            allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
            //                            allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
            //                            useIcons: true,
            //                            texts: {
            //                                editRow: l("Edit"),
            //                                deleteRow: l("Delete"),
            //                                confirmDeleteMessage: l("DeleteConfirmationMessage")
            //                            }
            //                        },
            //                        remoteOperations: true,
            //                        showRowLines: true,
            //                        showBorders: true,
            //                        cacheEnabled: true,
            //                        allowColumnReordering: true,
            //                        rowAlternationEnabled: true,
            //                        allowColumnResizing: true,
            //                        columnResizingMode: 'widget',
            //                        columnAutoWidth: true,
            //                        filterRow: {
            //                            visible: true
            //                        },
            //                        groupPanel: {
            //                            visible: true,
            //                        },
            //                        searchPanel: {
            //                            visible: true
            //                        },
            //                        columnMinWidth: 50,
            //                        columnChooser: {
            //                            enabled: true,
            //                            mode: "select"
            //                        },
            //                        columnFixing: {
            //                            enabled: true,
            //                        },
            //                        export: {
            //                            enabled: true,
            //                        },
            //                        onExporting(e) {
            //                            const workbook = new ExcelJS.Workbook();
            //                            const worksheet = workbook.addWorksheet('Data');

            //                            DevExpress.excelExporter.exportDataGrid({
            //                                component: e.component,
            //                                worksheet,
            //                                autoFilterEnabled: true,
            //                            }).then(() => {
            //                                workbook.xlsx.writeBuffer().then((buffer) => {
            //                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Attachment.xlsx');
            //                                });
            //                            });
            //                            e.cancel = true;
            //                        },
            //                        headerFilter: {
            //                            visible: true,
            //                        },
            //                        stateStoring: {
            //                            enabled: true,
            //                            type: 'localStorage',
            //                            storageKey: 'gridAttachment',
            //                        },
            //                        paging: {
            //                            enabled: true,
            //                            pageSize: pageSize
            //                        },
            //                        pager: {
            //                            visible: true,
            //                            showPageSizeSelector: true,
            //                            allowedPageSizes: allowedPageSizes,
            //                            showInfo: true,
            //                            showNavigationButtons: true
            //                        },
            //                        onRowInserting: function (e) {
            //                            e.data.customerId = cusProfile.id;
            //                        },
            //                        onRowUpdating: function (e) {
            //                            e.newData = Object.assign({}, e.oldData, e.newData);
            //                        },
            //                        toolbar: {
            //                            items: [
            //                                "groupPanel",
            //                                {
            //                                    location: 'after',
            //                                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
            //                                    onClick() {
            //                                        cusAttachGrid.addRow();
            //                                    },
            //                                },
            //                                'columnChooserButton',
            //                                "exportButton",
            //                                {
            //                                    location: 'after',
            //                                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
            //                                    onClick() {
            //                                        //todo
            //                                    },
            //                                },
            //                                "searchPanel"
            //                            ],
            //                        },
            //                        columns: [
            //                            {
            //                                type: 'buttons',
            //                                caption: l("Actions"),
            //                                width: 110,
            //                                buttons: ['edit', 'delete'],
            //                                fixedPosition: 'left'
            //                            },
            //                            {
            //                                dataField: 'customerId',
            //                                caption: l("CustomerId"),
            //                                dataType: 'string',
            //                                visible: false
            //                            },
            //                            {
            //                                dataField: 'description',
            //                                caption: l("Description"),
            //                                dataType: 'string',
            //                            },
            //                            {
            //                                dataField: 'url',
            //                                caption: l("Url"),
            //                                dataType: 'string',
            //                                cellTemplate: function (element, info) {
            //                                    element.append("<a href='#'>" + info.text + "</a>")
            //                                        .css("color", "blue");
            //                                }
            //                            },
            //                            {
            //                                dataField: 'creationTime',
            //                                caption: l1("CreationTime"),
            //                                width: 150,
            //                                dataType: 'date',
            //                            },
            //                            {
            //                                dataField: 'active',
            //                                caption: l("Active"),
            //                                width: 120,
            //                                alignment: 'center',
            //                                dataType: 'boolean',
            //                                cellTemplate(container, options) {
            //                                    $('<div>')
            //                                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
            //                                        .appendTo(container);
            //                                },
            //                            }
            //                        ],
            //                    }).dxDataGrid("instance");
            //                    //btnAddCusAttach.dxButton({
            //                    //    stylingMode: 'contained',
            //                    //    icon: 'plus',
            //                    //    text: l1("Button.New.CustomerAttachment"),
            //                    //    type: 'normal',
            //                    //    cssClass:'btn btn-sm btn-outline-default waves-effect waves-themed',
            //                    //    onClick() {
            //                    //        cusAttachGrid.addRow();
            //                    //    },
            //                    //});
            //                    //btnAddCusAttach.appendTo(element);
            //                    gridDiv.appendTo(element);
            //                }
            //            }],
            //        }],
            //        }
            //    ]
            //}
        },
        onEditingStart(e) {
            e.data.url = "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_960_720.jpg";
            cusProfile = e.data;
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
                        //gridCustomers.addRow();
                        var w = window.open('/Mdm/CustomerProfile/Details', '_blank');
                        w.sessionStorage.setItem("customerProfile", null);
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
                            id: "import-excel",
                            class: "import-excel",
                        },
                        onClick() {
                            //console.log(popup);
                            popup_m.option({
                                contentTemplate: () => popupContentTemplate(),
                                'position.of': `#import-excel`,
                            });
                            popup_m.show();
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
                buttons: [{
                    text: "Edit",
                    icon: "edit",
                    hint: "Edit",
                    visible: function (e) {
                        return !e.row.isNewRow;
                    },
                    onClick: function (e) {
                        var w = window.open('/Mdm/CustomerProfile/Details', '_blank');
                        w.sessionStorage.setItem("customerProfile", JSON.stringify(e.row.data));
                    }
                }],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("Code"),
                //allowEditing: false,
                dataType: 'string',
                validationRules: [{ type: "required" }]
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
            },
            {
                dataField: 'phone2',
                caption: l("Phone2"),
                dataType: 'string',
            },
            {
                dataField: 'erpCode',
                caption: l("ERPCode"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'license',
                caption: l("License"),
                dataType: 'string',
            },
            {
                dataField: 'taxCode',
                caption: l("TaxCode"),
                dataType: 'string',
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
            {
                dataField: 'sfaCustomerCode',
                caption: l("SfaCustomerCode"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
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
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'endDate',
                caption: l("EndDate"),
                dataType: 'date',
            },
            {
                dataField: 'creationTime',
                caption: l("CreationTime"),
                dataType: 'date',
                visible: false
            },
            {
                dataField: 'isCompany',
                caption: l("IsCompany"),
                dataType: 'boolean',
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
                dataField: 'creditLimit',
                caption: l("CreditLimit"),
                dataType: 'number',
                visible: false
            },
            {
                dataField: 'paymentTermId',
                caption: l("PaymentTerm"),
                dataType: 'string',
                visible: false,
                //lookup: {
                //    dataSource: {
                //        store: systemDataLookup,
                //        paginate: true,
                //        pageSize: pageSizeForLookup
                //    },
                //    valueExpr: "id",
                //    displayExpr: function (e) {
                //        return e.code + ' - ' + e.valueCode
                //    }
                //}
            },
            {
                dataField: 'linkedCompanyId',
                caption: l("LinkedCompany"),
                //dataType: 'string',
                //lookup: {
                //    dataSource: {
                //        store: companyData,
                //        paginate: true,
                //        pageSize: pageSizeForLookup
                //    },
                //    valueExpr: "id",
                //    displayExpr: "code"
                //},
                visible: false
            },
            {
                dataField: 'warehouseId',
                caption: l("Warehouse"),
                dataType: 'string',
                visible: false
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
                validationRules: [{ type: "required" }],
                //lookup: {
                //    dataSource: {
                //        store: pricelistLookup,
                //        paginate: true,
                //        pageSize: pageSizeForLookup
                //    },
                //    valueExpr: "id",
                //    displayExpr: "code"
                //}
            },
            {
                dataField: "geoMaster0Id",
                caption: l1("GeoLevel0Name"),
                width: 110,
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
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['level', '=', 1] : null,
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
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['level', '=', 2] : null,
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
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ['level', '=', 3] : null,
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
                            filter: options.data ? ['level', '=', 4] : null,
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
            {
                dataField: "attribute0Id",
                caption: l1("Attribute0Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(0)
                    }
                }
            },
            {
                dataField: "attribute1Id",
                caption: l1("Attribute1Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(1)
                    },
                }
            },
            {
                dataField: "attribute2Id",
                caption: l1("Attribute2Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(2)
                    },
                }
            },
            {
                dataField: "attribute3Id",
                caption: l1("Attribute3Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(3)
                    },
                }
            },
            {
                dataField: "attribute4Id",
                caption: l1("Attribute4Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(4)
                    },
                }
            },
            {
                dataField: "attribute5Id",
                caption: l1("Attribute5Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(5)
                    },
                }
            },
            {
                dataField: "attribute6Id",
                caption: l1("Attribute6Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(6)
                    },
                }
            },
            {
                dataField: "attribute7Id",
                caption: l1("Attribute7Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(7)
                    },
                }
            },
            {
                dataField: "attribute8Id",
                caption: l1("Attribute8Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(8)
                    },
                }
            },
            {
                dataField: "attribute9Id",
                caption: l1("Attribute9Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(9)
                    },
                }
            },
            {
                dataField: "attribute10Id",
                caption: l1("Attribute10Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(10)
                    },
                }
            },
            {
                dataField: "attribute11Id",
                caption: l1("Attribute11Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(11)
                    },
                }
            },
            {
                dataField: "attribute12Id",
                caption: l1("Attribute12Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(12)
                    },
                }
            },
            {
                dataField: "attribute13Id",
                caption: l1("Attribute13Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(13)
                    },
                }
            },
            {
                dataField: "attribute14Id",
                caption: l1("Attribute14Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(14)
                    },
                }
            },
            {
                dataField: "attribute15Id",
                caption: l1("Attribute15Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(15)
                    },
                }
            },
            {
                dataField: "attribute16Id",
                caption: l1("Attribute16Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(16)
                    },
                }
            },
            {
                dataField: "attribute17Id",
                caption: l1("Attribute17Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(17)
                    },
                }
            },
            {
                dataField: "attribute18Id",
                caption: l1("Attribute18Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(18)
                    },
                }
            },
            {
                dataField: "attribute19Id",
                caption: l1("Attribute19Name"),
                visible: false,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(19)
                    },
                }
            },
        ],
        onInitNewRow: function (e) {
            e.data.sfaCustomerCode = "sfaCode";
            e.data.effectiveDate = Date.now();
            e.data.active = true;
        },
    }).dxDataGrid("instance");

    const dsAttrValue = function (n) {
        return {
            store: getCusAttrValue,
            filter: ['customerAttribute.attrNo', '=', n],
        };
    }

    //var listAttrValue = [];

    function getAttrOptions() {
        const options = [];

        const deferred = $.Deferred();
        cusAttrService.getListDevextremes({})
            .done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });
        deferred.promise().then(u => {
            var listAttrActive = u.filter(x => x.active == true);
            listAttrActive.forEach((i) => {
                options.push(generateAttrOptions(i))
            });
        });
        return options;
    }

    function generateAttrOptions(attr) {
        return {
            dataField: 'attribute' + attr.attrNo + 'Id',
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
