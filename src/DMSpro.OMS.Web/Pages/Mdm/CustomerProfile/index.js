$(function () {
    var l = abp.localization.getResource("MdmService");

    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
    var pricelistLookup = [];
    var systenDataLookup = [];

    var urlPriceList = abp.appPath + 'api/mdm-service/customers/price-list-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    var urlSystemData = abp.appPath + 'api/mdm-service/customers/system-data-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);

    $.ajax({
        url: `${urlPriceList}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call pricelistLookup ajax: ', data);
            pricelistLookup = data.items;
        }
    });
    $.ajax({
        url: `${urlSystemData}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call urlSystemData ajax: ', data);
            systenDataLookup = data.items;
        }
    });
    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            [
                'skip',
                'take',
                'requireTotalCount',
                'requireGroupCount',
                'sort',
                'filter',
                'totalSummary',
                'group',
                'groupSummary',
            ].forEach((i) => {
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
                title: l("Page.Title.CustomerProfiles"),
                showTitle: true,
                height: 760
            },
            form: {
                colCount: 1,
                items: [{
                    itemType: 'group',
                    colCount: 3,
                    caption: '',
                    items: ['code', 'name', 'priceListId', 'phone1', 'phone2', 'active', 'effectiveDate', 'endDate', 'paymentTermId', 'creditLimit', 'taxCode', 'license', 'sfaCustomerCode'],
                }, {
                    itemType: 'group',
                    caption: '',
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            deferRendering: false,
                        },
                        tabs: [{
                            title: 'IMAGE',
                            template: function (itemData, itemIndex, element) {
                                const formDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                formDiv.dxForm({
                                    formData: {
                                        isActive: true,
                                        isAvatar: false,
                                        url: "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_960_720.jpg",
                                        createDate: new Date()
                                    },
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
                                            items: ["isActive", "isAvatar", "createDate"]
                                        }]
                                });
                                formDiv.appendTo(element);
                            }
                        }, {
                            title: 'ADDRESS',
                            template: function (itemData, itemIndex, element) {
                                const formDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                formDiv.dxForm({
                                    formData: {
                                        GeoMaster0Id: 'VN',
                                        GeoMaster1Id: 'MT',
                                        GeoMaster2Id: 'QN',
                                        GeoMaster3Id: 'DB',
                                        GeoMaster4Id: 'DNT',
                                        street: '897 Trần Thủ Độ',
                                        address: '897',
                                        latitude: '',
                                        longitude: ''
                                    },
                                    colCount: 2,
                                    items: [
                                        {
                                            itemType: "group",
                                            items: [{
                                                dataField: "GeoMaster0Id",
                                                label: { text: "Country" },
                                                editorType: "dxSelectBox",
                                                editorOptions: {
                                                    dataSource: geoMaster,
                                                    displayExpr: "name",
                                                    valueExpr: "code",
                                                }
                                            }, {
                                                dataField: "GeoMaster1Id",
                                                label: { text: "Area" },
                                                editorType: "dxSelectBox",
                                                editorOptions: {
                                                    dataSource: geoMaster,
                                                    displayExpr: "name",
                                                    valueExpr: "code",
                                                }
                                            }, {
                                                dataField: "GeoMaster2Id",
                                                label: { text: "Province" },
                                                editorType: "dxSelectBox",
                                                editorOptions: {
                                                    dataSource: geoMaster,
                                                    displayExpr: "name",
                                                    valueExpr: "code",
                                                }
                                            }, {
                                                dataField: "GeoMaster3Id",
                                                label: {
                                                    text: "District"
                                                },
                                                editorType: "dxSelectBox",
                                                editorOptions: {
                                                    dataSource: geoMaster,
                                                    displayExpr: "name",
                                                    valueExpr: "code",
                                                }
                                            }, {
                                                dataField: "GeoMaster4Id",
                                                label: {
                                                    text: "Ward"
                                                },
                                                editorType: "dxSelectBox",
                                                editorOptions: {
                                                    dataSource: geoMaster,
                                                    displayExpr: "name",
                                                    valueExpr: "code",
                                                }
                                            }, "street", "address", "latitude", "longitude"]
                                        },
                                        {
                                            itemType: "group",
                                            items: [{
                                                template: function (data, itemElement) {
                                                    const mapsDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                                    mapsDiv.dxMap({
                                                        center: { lat: cusAddress.latitude, lng: cusAddress.longitude },
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
                                });
                                formDiv.appendTo(element);
                            },
                        }, {
                            title: 'ATTRIBUTE',
                            colCount: 2,
                            cssClass: 'cusTab',
                            items: ["attribute00", "attribute01", "attribute02", "attribute03", "attribute04", "attribute05", "attribute06", "attribute07", "attribute08", "attribute09"]
                        }, {
                            title: 'CONTACT',
                            template: function (itemData, itemIndex, element) {
                                const formDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                formDiv.dxForm({
                                    formData: cusContact,
                                    colCount: 5,
                                    items: [
                                        {
                                            itemType: "group",
                                            colSpan: 1,
                                            items: [{
                                                itemType: "button",
                                                buttonOptions: {
                                                    text: "Contact 1",
                                                    type: "success",
                                                    onClick: function () {
                                                        cusContact.firstName = "Tran";
                                                        cusContact.lastName = "Bo";
                                                    }
                                                }
                                            }, {
                                                itemType: "button",
                                                buttonOptions: {
                                                    text: "Contact 2",
                                                    type: "success",
                                                    onClick: function () {
                                                        cusContact.firstName = "Quynh";
                                                        cusContact.lastName = "Han";
                                                    }
                                                }
                                            }]
                                        },
                                        {
                                            itemType: "group",
                                            colSpan: 4,
                                            colCount: 2,
                                            items: ["firstName", "lastName", "gender", "dateOfBirth", "email", "phone", "address", "identityNumber", "bankName", "accountName", "accountNumber"]
                                        }
                                    ]
                                });
                                formDiv.appendTo(element);
                            }
                        }, {
                            title: 'ATTACHMENT',
                            template: function (itemData, itemIndex, element) {
                                const gridDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                gridDiv.dxDataGrid({
                                    dataSource: cusAssigments,
                                    keyExpr: "id",
                                    remoteOperations: true,
                                    showBorders: true,
                                    autoExpandAll: true,
                                    focusedRowEnabled: true,
                                    allowColumnReordering: false,
                                    rowAlternationEnabled: true,
                                    columnAutoWidth: true,
                                    columnHidingEnabled: true,
                                    errorRowEnabled: false,
                                    //filterRow: {
                                    //    visible: true
                                    //},
                                    //searchPanel: {
                                    //    visible: true
                                    //},
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
                                    columns: [
                                        {
                                            dataField: 'name',
                                            caption: l("Name"),
                                            dataType: 'string',
                                        },
                                        {
                                            dataField: 'attachment',
                                            caption: l("Attachment"),
                                            dataType: 'string',
                                            cellTemplate: function (element, info) {
                                                element.append("<a href='#'>" + info.text + "</a>")
                                                    .css("color", "blue");
                                            }
                                        },
                                        {
                                            dataField: 'createDate',
                                            caption: l("Create Date"),
                                            width: 150,
                                            dataType: 'date',
                                        },
                                        {
                                            dataField: 'isActive',
                                            caption: l("Active"),
                                            width: 120,
                                            alignment: 'center',
                                            cellTemplate(container, options) {
                                                $('<div>')
                                                    .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                                    .appendTo(container);
                                            },
                                        }
                                    ],
                                });
                                gridDiv.appendTo(element);
                            }
                        }],
                    }],
                }],
            },
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
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
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 90,
                buttons: ['edit'],
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
                caption: l("phone1"),
                dataType: 'string',
            },
            {
                dataField: 'phone2',
                caption: l("phone2"),
                dataType: 'string',
            },
            {
                dataField: 'erpCode',
                caption: l("erpCode"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'license',
                caption: l("license"),
                dataType: 'string',
            },
            {
                dataField: 'taxCode',
                caption: l("taxCode"),
                dataType: 'string',
            },
            {
                dataField: 'vatName',
                caption: l("vatName"),
                dataType: 'string',
            },
            {
                dataField: 'vatAddress',
                caption: l("vatAddress"),
                dataType: 'string',
            },
            {
                dataField: 'sfaCustomerCode',
                caption: l("sfaCustomerCode"),
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
                caption: l("effectiveDate"),
                dataType: 'date',
            },
            {
                dataField: 'endDate',
                caption: l("endDate"),
                dataType: 'date',
            },
            {
                dataField: 'isCompany',
                caption: l("isCompany"),
                dataType: 'boolean',
            },
            {
                dataField: 'creditLimit',
                caption: l("creditLimit"),
                dataType: 'number',
                visible: false
            },
            {
                dataField: 'paymentTermId',
                caption: l("paymentTermId"),
                dataType: 'string',
                visible: false,
                lookup: {
                    dataSource: systenDataLookup,
                    valueExpr: "id",
                    displayExpr: "displayName"
                }
            },
            {
                dataField: 'linkedCompanyId',
                caption: l("linkedCompanyId"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'warehouseId',
                caption: l("warehouseId"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'priceListId',
                caption: l("priceListId"),
                dataType: 'string',
                visible: false,
                lookup: {
                    dataSource: pricelistLookup,
                    valueExpr: "id",
                    displayExpr: "displayName"
                }
            },
            {
                dataField: 'geoMaster0Id',
                caption: l("geoMaster0Id"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'geoMaster1Id',
                caption: l("geoMaster1Id"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'geoMaster2Id',
                caption: l("geoMaster2Id"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'geoMaster3Id',
                caption: l("geoMaster3Id"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'geoMaster4Id',
                caption: l("geoMaster4Id"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'street',
                caption: l("street"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'address',
                caption: l("address"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'latitude',
                caption: l("latitude"),
                dataType: 'string',
                visible: false
            },
            {
                dataField: 'longitude',
                caption: l("longitude"),
                dataType: 'string',
                visible: false
            },
        ],
    }).dxDataGrid("instance");


    $("#frmCusProfile").dxForm({
        formData: {
            code: "CEO",
            name: "John Heart",
            shortname: "JHeart",
            pricelist: 901,
            phone1: "0905111222",
            phone2: "01234567890",
            isActive: true,
            createDate: new Date(2022, 4, 13),
            endDate: new Date(),
            type: "1",
            paymentCode: "JS13343JDD3",
            creditLimit: "400",
            paymentTerm: "JS as3999",
            taxCode: "JB893",
            license: "AH2002",
            linkedCompany: "ABC bcx",
            WHId: "CE2342O",
            contactID: "20",
            VATName: "VAT name",
            VATAddress: "Binh Duong, Thang Binh",
        },
        colCount: 3,
        items: ["code", "name", "shortname", "pricelist", "phone1", "phone2", "createDate", "endDate", "isActive",
            "type", "paymentCode", "creditLimit", "paymentTerm", "taxCode", "license", "VATName", "VATAddress", "linkedCompany", "WHId", "contactID"]
    });

    $("#tabPanel").dxTabPanel({
        items: [{
            title: "Image",
            template: function (itemData, itemIndex, element) {
                const formDiv = $("<div style='padding:15px'>")
                formDiv.dxForm({
                    formData: {
                        isActive: true,
                        isAvatar: false,
                        url: "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_960_720.jpg",
                        createDate: new Date()
                    },
                    colCount: 2,
                    items: [
                        {
                            itemType: "group",
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
                            items: ["isActive", "isAvatar", "createDate"]
                        }]
                });
                formDiv.appendTo(element);
            }
        }, {
            title: "Address",
            template: function (itemData, itemIndex, element) {
                const formDiv = $("<div style='padding:15px'>")
                formDiv.dxForm({
                    formData: cusAddress,
                    colCount: 2,
                    colSpan: 2,
                    items: [
                        {
                            itemType: "group",
                            items: [{
                                dataField: "geolevel0",
                                label: { text: "Country" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: geoMaster,
                                    displayExpr: "name",
                                    valueExpr: "code",
                                }
                            }, {
                                dataField: "geolevel1",
                                label: { text: "Province" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: geoMaster,
                                    displayExpr: "name",
                                    valueExpr: "code",
                                }
                            }, {
                                dataField: "geolevel2",
                                label: {
                                    text: "District"
                                },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: geoMaster,
                                    displayExpr: "name",
                                    valueExpr: "code",
                                }
                            }, {
                                dataField: "geolevel3",
                                label: {
                                    text: "Ward"
                                },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: geoMaster,
                                    displayExpr: "name",
                                    valueExpr: "code",
                                }
                            }, "street", "address", "latitude", "longitude"]
                        },
                        {
                            itemType: "group",
                            items: [{
                                template: function (data, itemElement) {
                                    const mapsDiv = $("<div style='padding:15px'>")
                                    mapsDiv.dxMap({
                                        center: { lat: cusAddress.latitude, lng: cusAddress.longitude },
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

                });
                formDiv.appendTo(element);
            }
        }, {
            title: "Attribute",
            template: function (itemData, itemIndex, element) {
                const formDiv = $("<div style='padding:15px'>")
                formDiv.dxForm({
                    formData: cusAttributes,
                    colCount: 2,
                    items: ["attribute00", "attribute01", "attribute02", "attribute03", "attribute04", "attribute05", "attribute06", "attribute07", "attribute08", "attribute09"]
                });
                formDiv.appendTo(element);
            }
        }, {
            title: "Contact",
            template: function (itemData, itemIndex, element) {
                const formDiv = $("<div style='padding:15px'>")
                formDiv.dxForm({
                    formData: cusContact,
                    colCount: 5,
                    items: [
                        {
                            itemType: "group",
                            colSpan: 1,
                            items: [{
                                itemType: "button",
                                buttonOptions: {
                                    text: "Contact 1",
                                    type: "success",
                                    onClick: function () {
                                        cusContact.firstName = "Tran";
                                        cusContact.lastName = "Bo";
                                    }
                                }
                            }, {
                                itemType: "button",
                                buttonOptions: {
                                    text: "Contact 2",
                                    type: "success",
                                    onClick: function () {
                                        cusContact.firstName = "Quynh";
                                        cusContact.lastName = "Han";
                                    }
                                }
                            }]
                        },
                        {
                            itemType: "group",
                            colSpan: 4,
                            colCount: 2,
                            items: ["firstName", "lastName", "gender", "dateOfBirth", "email", "phone", "address", "identityNumber", "bankName", "accountName", "accountNumber"]
                        }
                    ]
                });
                formDiv.appendTo(element);
            }
        }, {
            title: "Attachment",
            template: function (itemData, itemIndex, element) {
                const gridDiv = $("<div style='padding:15px'>")
                gridDiv.dxDataGrid({
                    dataSource: cusAssigments,
                    keyExpr: "id",
                    remoteOperations: true,
                    showBorders: true,
                    autoExpandAll: true,
                    focusedRowEnabled: true,
                    allowColumnReordering: false,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columnHidingEnabled: true,
                    errorRowEnabled: false,
                    //filterRow: {
                    //    visible: true
                    //},
                    //searchPanel: {
                    //    visible: true
                    //},
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
                    columns: [
                        {
                            dataField: 'name',
                            caption: l("Name"),
                            dataType: 'string',
                        },
                        {
                            dataField: 'attachment',
                            caption: l("Attachment"),
                            dataType: 'string',
                            cellTemplate: function (element, info) {
                                element.append("<a href='#'>" + info.text + "</a>")
                                    .css("color", "blue");
                            }
                        },
                        {
                            dataField: 'createDate',
                            caption: l("Create Date"),
                            width: 150,
                            dataType: 'date',
                        },
                        {
                            dataField: 'isActive',
                            caption: l("Active"),
                            width: 120,
                            alignment: 'center',
                            cellTemplate(container, options) {
                                $('<div>')
                                    .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                    .appendTo(container);
                            },
                        }
                    ],
                });
                gridDiv.appendTo(element);
            }
        }]
    });

    var cusInfo = {
        code: "CEO",
        name: "John Heart",
        shortname: "JHeart",
        pricelist: 901,
        phone1: "0905111222",
        phone2: "01234567890",
        isActive: true,
        createDate: new Date(2022, 4, 13),
        endDate: new Date(),
        type: "1",
        paymentCode: "JS13343JDD3",
        creditLimit: "400",
        paymentTerm: "JS as3999",
        taxCode: "JB893",
        license: "AH2002",
        linkedCompany: "ABC bcx",
        WHId: "CE2342O",
        contactID: "20",
        VATName: "VAT name",
        VATAddress: "Binh Duong, Thang Binh",
    };
    var cusAddress = {
        geolevel0: "VN",
        geolevel1: "QN",
        geolevel2: "DB",
        geolevel3: "DNT",
        geolevel4: "QLB",
        street: "Dien Bien Phu",
        address: "quang lang B",
        latitude: 16.047079,
        longitude: 108.206230,
    }
    var geoMaster = [
        {
            code: "VN",
            name: "Việt Nam"
        },
        {
            code: "MT",
            name: "Miền Trung"
        },
        {
            code: "QN",
            name: "Quảng Nam"
        },
        {
            code: "DB",
            name: "Dien Ban"
        },
        {
            code: "DNT",
            name: "Dien Nam Trung"
        },
        {
            code: "QLB",
            name: "Quang Lang B"
        }
    ];
    var cusImage = {
        isActive: true,
        isAvatar: false,
        url: "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_960_720.jpg",
        createDate: new Date()
    };
    var cusAttributes = {
        attribute00: "",
        attribute01: "",
        attribute02: "",
        attribute03: "",
        attribute04: "",
        attribute05: "",
        attribute06: "",
        attribute07: "",
        attribute08: "",
        attribute09: ""
    };
    var cusContact = {
        firstName: "Tran",
        lastName: "Bo",
        gender: "Nam",
        dateOfBirth: new Date(),
        email: "abc@gmail.com",
        phone: "",
        address: "",
        identityNumber: "",
        bankName: "",
        accountName: "",
        accountNumber: ""
    }
    var cusAssigments = [
        {
            id: 1,
            name: "Thông tin hợp đồng điểm bán",
            attachment: "D:\\abc.txt",
            createDate: new Date(),
            isActive: false
        },
        {
            id: 2,
            name: "Thông tin đại lý bán hàng",
            attachment: "D:\\daily.txt",
            createDate: new Date(),
            isActive: true
        }
    ];

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
