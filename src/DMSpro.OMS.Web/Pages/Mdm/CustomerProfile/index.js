$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");

    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
    var cusAttachService = window.dMSpro.oMS.mdmService.controllers.customerAttachments.customerAttachment;
    var cusContactService = window.dMSpro.oMS.mdmService.controllers.customerContacts.customerContact;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
    var cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.cusAttributeValues.cusAttributeValue;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
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

    var pricelistLookup = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceListService.getListDevextremes(args)
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
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var systemDataLookup = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            systemDataService.getListDevextremes(args)
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
            systemDataService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var cusAttrLookup = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            cusAttributeValueService.getListDevextremes(args)
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
            cusAttributeValueService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });
    
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
                    console.log('data:', result)
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
    var cusAttachStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            args.filter = JSON.stringify(['customerId', '=', cusProfile.id])

            cusAttachService.getListDevextremes(args)
                .done(result => {
                    console.log('data CusAttachments:', result)
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            return key == 0 ? cusAttachService.get(key) : null;
        },
        insert(values) {
            return cusAttachService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return cusAttachService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return cusAttachService.delete(key);
        }
    });

    var cusContactStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            args.filter = JSON.stringify(['customerId', '=', cusProfile.id])

            cusContactService.getListDevextremes(args)
                .done(result => {
                    console.log('data cusContactService:', result)
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            return key == 0 ? cusContactService.get(key) : null;
        },
        insert(values) {
            return cusContactService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return cusContactService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return cusContactService.delete(key);
        }
    });


    var cusProfile = {};

    var gridCustomers = $('#dgCustomers').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
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
                title: l("Page.Title.Customers"),
                showTitle: true,
                height: 800
            },
            form: {
                colCount: 1,
                items: [{
                    itemType: 'group',
                    colCount: 3,
                    caption: '',
                    items: ['code', 'name', 'priceListId', 'phone1', 'phone2', 'active', {
                        dataField: 'effectiveDate',
                        editorType: "dxDateBox",
                    }, {
                        dataField: 'endDate',
                        editorType: "dxDateBox",
                    }, 'paymentTermId', 'creditLimit', 'taxCode', 'license', 'sfaCustomerCode'],
                }, {
                    itemType: 'group',
                    caption: '',
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            deferRendering: false,
                            height: 440
                        },
                        tabs: [{
                            title: 'IMAGE',
                            colCount: 3,
                            items: [
                                {
                                    itemType: "group",
                                    colSpan: 2,
                                    colCount: 1,
                                    items: [{
                                        dataField: "url",
                                        caption: "",
                                        label: {
                                            text: "",
                                        },
                                        template: function (data, itemElement) {
                                            itemElement.append("<img style='width: 300px; height: 280px' src='" + data.editorOptions.value + "'>");
                                        }
                                    }]
                                },
                                {
                                    itemType: "group",
                                    colSpan: 1,
                                    items: ["active", "isAvatar", {
                                        dataField: "creationTime",
                                        editorType: "dxDateBox",
                                    }]
                                }]
                        }, {
                            title: 'ADDRESS',
                            colCount: 2,
                            items: [
                                {
                                    itemType: "group",
                                    items: ["geoMaster0Id", "geoMaster1Id", "geoMaster2Id", "geoMaster3Id", "geoMaster4Id",
                                        "street", "address", "latitude", "longitude"]
                                },
                                {
                                    itemType: "group",
                                    items: [{
                                        template: function (data, itemElement) {
                                            const mapsDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                            mapsDiv.dxMap({
                                                center: { lat: cusProfile.latitude, lng: cusProfile.longitude },
                                                controls: true,
                                                zoom: 14,
                                                height: 380,
                                                width: '100%',
                                                provider: 'google',
                                                apiKey: {
                                                    // Specify your API keys for each map provider:
                                                    // bing: "YOUR_BING_MAPS_API_KEY",
                                                    // google: "YOUR_GOOGLE_MAPS_API_KEY",
                                                    // googleStatic: "YOUR_GOOGLE_STATIC_MAPS_API_KEY"
                                                },
                                            });
                                            mapsDiv.appendTo(itemElement);
                                        }
                                    }]
                                }],
                        }, {
                            title: 'ATTRIBUTE',
                            colCount: 4,
                            items: ["attribute0Id", "attribute1Id", "attribute2Id", "attribute3Id", "attribute4Id", "attribute5Id", "attribute6Id", "attribute7Id", "attribute8Id", "attribute9Id",
                                "attribute10Id", "attribute11Id", "attribute12Id", "attribute13Id", "attribute14Id", "attribute15Id", "attribute16Id", "attribute17Id", "attribute18Id", "attribute19Id"]
                        }, {
                            title: 'CONTACT',
                            template: function (itemData, itemIndex, element) {
                                const btnAddCusContact = $("<button type='button' class='btn btn-sm btn-outline-default waves-effect waves-themed'>")
                                const gridDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                var cusContactGrid = gridDiv.dxDataGrid({
                                    dataSource: cusContactStore,
                                    keyExpr: "id",
                                    editing: {
                                        mode: "row",
                                        allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
                                        allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
                                        allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
                                        useIcons: true,
                                        texts: {
                                            editRow: l("Edit"),
                                            deleteRow: l("Delete"),
                                            confirmDeleteMessage: l("DeleteConfirmationMessage")
                                        }
                                    },
                                    remoteOperations: true,
                                    showBorders: true,
                                    focusedRowEnabled: true,
                                    allowColumnReordering: false,
                                    rowAlternationEnabled: true,
                                    columnAutoWidth: true,
                                    columnHidingEnabled: true,
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
                                    onRowInserting: function (e) {
                                        e.data.customerId = cusProfile.id;
                                    },
                                    onRowUpdating: function (e) {
                                        e.newData = Object.assign({}, e.oldData, e.newData);
                                    },
                                    columns: [
                                        {
                                            type: 'buttons',
                                            caption: l("Actions"),
                                            width: 110,
                                            buttons: ['add', 'edit', 'delete'],
                                        },
                                        {
                                            dataField: 'customerId',
                                            caption: l("CustomerId"),
                                            dataType: 'string',
                                            visible: false
                                        },
                                        {
                                            dataField: 'firstName',
                                            caption: l1("FirstName"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'lastName',
                                            caption: l1("LastName"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'gender',
                                            caption: l1("Gender"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'phone',
                                            caption: l1("Phone"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'email',
                                            caption: l1("Email"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'address ',
                                            caption: l1("Address"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'identityNumber',
                                            caption: l1("IdentityNumber"),
                                        },
                                        {
                                            dataField: 'bankName',
                                            caption: l1("BankName"),
                                        },
                                        {
                                            dataField: 'bankAccName',
                                            caption: l1("BankAccName"),
                                        },
                                        {
                                            dataField: 'bankAccNumber',
                                            caption: l1("BankAccNumber"),
                                        },
                                    ],
                                }).dxDataGrid("instance");
                                btnAddCusContact.dxButton({
                                    stylingMode: 'contained',
                                    icon: 'plus',
                                    text: l1("Button.New.CustomerContact"),
                                    type: 'normal',
                                    cssClass: 'btn btn-sm btn-outline-default waves-effect waves-themed',
                                    onClick() {
                                        cusContactGrid.addRow();
                                    },
                                });
                                btnAddCusContact.appendTo(element);
                                gridDiv.appendTo(element);
                            }
                        }, {
                            title: 'ATTACHMENT',
                            template: function (itemData, itemIndex, element) {
                                const btnAddCusAttach = $("<button type='button' class='btn btn-sm btn-outline-default waves-effect waves-themed'>")
                                const gridDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                var cusAttachGrid = gridDiv.dxDataGrid({
                                    dataSource: cusAttachStore,
                                    keyExpr: "id",
                                    editing: {
                                        mode: "row",
                                        allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
                                        allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
                                        allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
                                        useIcons: true,
                                        texts: {
                                            editRow: l("Edit"),
                                            deleteRow: l("Delete"),
                                            confirmDeleteMessage: l("DeleteConfirmationMessage")
                                        }
                                    },
                                    remoteOperations: true,
                                    showBorders: true,
                                    focusedRowEnabled: true,
                                    allowColumnReordering: false,
                                    rowAlternationEnabled: true,
                                    columnAutoWidth: true,
                                    columnHidingEnabled: true,
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
                                    onRowInserting: function (e) {
                                        e.data.customerId = cusProfile.id;
                                    },
                                    onRowUpdating: function (e) {
                                        e.newData = Object.assign({}, e.oldData, e.newData);
                                    },
                                    columns: [
                                        {
                                            type: 'buttons',
                                            caption: l("Actions"),
                                            width: 110,
                                            buttons: ['add', 'edit', 'delete'],
                                        },
                                        {
                                            dataField: 'customerId',
                                            caption: l("CustomerId"),
                                            dataType: 'string',
                                            visible: false
                                        },
                                        {
                                            dataField: 'description',
                                            caption: l("Description"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'url',
                                            caption: l("Url"),
                                            dataType: 'string',
                                            cellTemplate: function (element, info) {
                                                element.append("<a href='#'>" + info.text + "</a>")
                                                    .css("color", "blue");
                                            }
                                        },
                                        {
                                            dataField: 'creationTime',
                                            caption: l1("CreationTime"),
                                            width: 150,
                                            dataType: 'date',
                                        },
                                        {
                                            dataField: 'active',
                                            caption: l("Active"),
                                            width: 120,
                                            alignment: 'center',
                                            dataType: 'boolean',
                                            cellTemplate(container, options) {
                                                $('<div>')
                                                    .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                                    .appendTo(container);
                                            },
                                        }
                                    ],
                                }).dxDataGrid("instance");
                                btnAddCusAttach.dxButton({
                                    stylingMode: 'contained',
                                    icon: 'plus',
                                    text: l1("Button.New.CustomerAttachment"),
                                    type: 'normal',
                                    cssClass:'btn btn-sm btn-outline-default waves-effect waves-themed',
                                    onClick() {
                                        cusAttachGrid.addRow();
                                    },
                                });
                                btnAddCusAttach.appendTo(element);
                                gridDiv.appendTo(element);
                            }
                        }],
                    }],
                }],
            },
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
            pageSize: 10
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
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
                        gridCustomers.addRow();
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
                width: 90,
                buttons: ['edit'],
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
                lookup: {
                    dataSource: {
                        store: systemDataLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: "id",
                    displayExpr: "code"
                }
            },
            {
                dataField: 'linkedCompanyId',
                caption: l("LinkedCompany"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'warehouseId',
                caption: l("Warehouse"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'priceListId',
                caption: l("PriceList"),
                dataType: 'string',
                visible: false,
                lookup: {
                    dataSource: {
                        store: pricelistLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: "id",
                    displayExpr: "code"
                }
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
                            pageSize: 10
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
                            pageSize: 10
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
                            pageSize: 10
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
                            pageSize: 10
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
                            pageSize: 10
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
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute1Id",
                caption: l1("Attribute1Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute2Id",
                caption: l1("Attribute2Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute3Id",
                caption: l1("Attribute3Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute4Id",
                caption: l1("Attribute4Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute5Id",
                caption: l1("Attribute5Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute6Id",
                caption: l1("Attribute6Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute7Id",
                caption: l1("Attribute7Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute8Id",
                caption: l1("Attribute8Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute9Id",
                caption: l1("Attribute9Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute10Id",
                caption: l1("Attribute10Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute11Id",
                caption: l1("Attribute11Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute12Id",
                caption: l1("Attribute12Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute13Id",
                caption: l1("Attribute13Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute14Id",
                caption: l1("Attribute14Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute15Id",
                caption: l1("Attribute15Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute16Id",
                caption: l1("Attribute16Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute17Id",
                caption: l1("Attribute17Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute18Id",
                caption: l1("Attribute18Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
            {
                dataField: "attribute19Id",
                caption: l1("Attribute19Name"),
                visible: false,
                lookup: {
                    dataSource: {
                        store: cusAttrLookup,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrValName',
                }
            },
        ],
    }).dxDataGrid("instance");

    var genderStore = [
        {
            id: 1,
            displayName: l1("Male")
        },
        {
            id: 0,
            displayName: l1("Female")
        }
    ]
    $("#btnNewCustomerProfile").click(function (e) {
        gridCustomers.addRow();
    });

    //    $("#ExportToExcelButton").click(function (e) {
    //        e.preventDefault();

    //        customerService.getDownloadToken().then(
    //            function(result){
    //                    var input = getFilter();
    //                    var url =  abp.appPath + 'api/mdm-service/customer-profiles/as-excel-file' + 
    //                        abp.utils.buildQueryString([
    //                            { name: 'downloadToken', value: result.token },
    //                            { name: 'filterText', value: input.filterText }, 
    //                            { name: 'code', value: input.code }, 
    //                            { name: 'name', value: input.name }, 
    //                            { name: 'phone1', value: input.phone1 }, 
    //                            { name: 'phone2', value: input.phone2 }, 
    //                            { name: 'erpCode', value: input.erpCode }, 
    //                            { name: 'license', value: input.license }, 
    //                            { name: 'taxCode', value: input.taxCode }, 
    //                            { name: 'vatName', value: input.vatName }, 
    //                            { name: 'vatAddress', value: input.vatAddress }, 
    //                            { name: 'active', value: input.active },
    //                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
    //                            { name: 'effectiveDateMax', value: input.effectiveDateMax },
    //                            { name: 'endDateMin', value: input.endDateMin },
    //                            { name: 'endDateMax', value: input.endDateMax },
    //                            { name: 'creditLimitMin', value: input.creditLimitMin },
    //                            { name: 'creditLimitMax', value: input.creditLimitMax }, 
    //                            { name: 'isCompany', value: input.isCompany }, 
    //                            { name: 'street', value: input.street }, 
    //                            { name: 'address', value: input.address }, 
    //                            { name: 'latitude', value: input.latitude }, 
    //                            { name: 'longitude', value: input.longitude }, 
    //                            { name: 'sfaCustomerCode', value: input.sfaCustomerCode },
    //                            { name: 'lastOrderDateMin', value: input.lastOrderDateMin },
    //                            { name: 'lastOrderDateMax', value: input.lastOrderDateMax }, 
    //                            { name: 'warehouseId', value: input.warehouseId }, 
    //                            { name: 'paymentTermId', value: input.paymentTermId }
    //, 
    //                            { name: 'linkedCompanyId', value: input.linkedCompanyId }
    //, 
    //                            { name: 'priceListId', value: input.priceListId }
    //, 
    //                            { name: 'geoMaster0Id', value: input.geoMaster0Id }
    //, 
    //                            { name: 'geoMaster1Id', value: input.geoMaster1Id }
    //, 
    //                            { name: 'geoMaster2Id', value: input.geoMaster2Id }
    //, 
    //                            { name: 'geoMaste3rId', value: input.geoMaste3rId }
    //, 
    //                            { name: 'geoMaster4Id', value: input.geoMaster4Id }
    //, 
    //                            { name: 'cusAttributeValue0Id', value: input.cusAttributeValue0Id }
    //, 
    //                            { name: 'cusAttributeValue1Id', value: input.cusAttributeValue1Id }
    //, 
    //                            { name: 'cusAttributeValue2Id', value: input.cusAttributeValue2Id }
    //, 
    //                            { name: 'cusAttributeValue3Id', value: input.cusAttributeValue3Id }
    //, 
    //                            { name: 'cusAttributeValue4Id', value: input.cusAttributeValue4Id }
    //, 
    //                            { name: 'cusAttributeValue5Id', value: input.cusAttributeValue5Id }
    //, 
    //                            { name: 'cusAttributeValue6Id', value: input.cusAttributeValue6Id }
    //, 
    //                            { name: 'cusAttributeValue7Id', value: input.cusAttributeValue7Id }
    //, 
    //                            { name: 'cusAttributeValue8Id', value: input.cusAttributeValue8Id }
    //, 
    //                            { name: 'cusAttributeValue9Id', value: input.cusAttributeValue9Id }
    //, 
    //                            { name: 'cusAttributeValue10Id', value: input.cusAttributeValue10Id }
    //, 
    //                            { name: 'cusAttributeValue11Id', value: input.cusAttributeValue11Id }
    //, 
    //                            { name: 'cusAttributeValue12Id', value: input.cusAttributeValue12Id }
    //, 
    //                            { name: 'cusAttributeValue13Id', value: input.cusAttributeValue13Id }
    //, 
    //                            { name: 'cusAttributeValue14Id', value: input.cusAttributeValue14Id }
    //, 
    //                            { name: 'cusAttributeValue15Id', value: input.cusAttributeValue15Id }
    //, 
    //                            { name: 'cusAttributeValue16Id', value: input.cusAttributeValue16Id }
    //, 
    //                            { name: 'cusAttributeValue17Id', value: input.cusAttributeValue17Id }
    //, 
    //                            { name: 'cusAttributeValue18Id', value: input.cusAttributeValue18Id }
    //, 
    //                            { name: 'cusAttributeValue19Id', value: input.cusAttributeValue19Id }
    //, 
    //                            { name: 'paymentId', value: input.paymentId }
    //                            ]);

    //                    var downloadWindow = window.open(url, '_blank');
    //                    downloadWindow.focus();
    //            }
    //        )
    //    });

});
