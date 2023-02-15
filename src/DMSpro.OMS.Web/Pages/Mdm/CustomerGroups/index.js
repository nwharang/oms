$(function () {
    var l = abp.localization.getResource("MdmService");
    var customerGroupService = window.dMSpro.oMS.mdmService.controllers.customerGroups.customerGroup;

    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
    var GroupModes = [
        {
            id: "ATTRIBUTE",
            displayName: "By Attribute"
        },
        {
            id: "LIST",
            displayName: "By List"
        },
        {
            id: "GEO",
            displayName: "By Geo"
        }
    ];

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
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
            customerGroupService.getListDevextremes(args)
                .done(result => {
                    console.log('data ne: ', result);
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
            customerGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return customerGroupService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerGroupService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerGroupService.delete(key);
        }
    });

    var gridCusGroups = $('#dgCusGroups').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.CustomerGroups.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerGroups.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerGroups.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
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
            storageKey: 'dgCustomerGroups',
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
        onEditorPreparing(e) {
        },
        onRowInserting: function (e) {
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridCusGroups.addRow();
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
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Code"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Name"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Active"),
                width: 70,
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
                caption: l("EntityFieldName:MDMService:CustomerGroup:EffectiveDate"),
                dataType: 'date',
            },
            {
                dataField: 'groupBy',
                caption: l("EntityFieldName:MDMService:CustomerGroup:GroupBy"),
                lookup: {
                    dataSource: GroupModes,
                    valueExpr: "id",
                    displayExpr: "displayName"
                }
            }
        ],
    }).dxDataGrid("instance");

    //$("input#Search").on("input", function () {
    //    gridCusGroups.searchByText($(this).val());
    //});

    //$("#btnNewCusGroup").click(function (e) {
    //    gridCusGroups.addRow();
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    customerGroupService.getDownloadToken().then(
    //        function (result) {
    //            var url = abp.appPath + 'api/mdm-service/customer-groups/as-excel-file' +
    //                abp.utils.buildQueryString([
    //                    { name: 'downloadToken', value: result.token }
    //                ]);

    //            var downloadWindow = window.open(url, '_blank');
    //            downloadWindow.focus();
    //        }
    //    )
    //});


    var outletInfos = [{
        code: "KH001_S1",
        name: "KH 01",
    }, {
        code: "KH002_S2",
        name: "KH 02",
    }, {
        code: "KH003_S3",
        name: "KH 03",
    }]
    var cusInfo = {
        code: "CEO",
        name: "John Heart",
        shortname: "JHeart",
        pricelist: 901,
        phone1: "0905111222",
        phone2: "01234567890",
        isActive: true,
        createDate: new Date(2022, 4, 13),
        effDate: new Date(2022, 4, 13),
        endDate: new Date(),
        outletType: "",
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
        geolevel0: "VN",
        geolevel1: "QN",
        geolevel2: "DB",
        geolevel3: "DNT",
        geolevel4: "QLB",
        street: "Dien Bien Phu",
        address: "quang lang B",
        latitude: 82.2333,
        longitude: 932.23,
    };
    var cusAddress = {
        geolevel0: "VN",
        geolevel1: "QN",
        geolevel2: "DB",
        geolevel3: "DNT",
        geolevel4: "QLB",
        street: "Dien Bien Phu",
        address: "quang lang B",
        latitude: 82.2333,
        longitude: 932.23,
    }
    var geoMaster = [
        {
            code: "VN",
            name: "Viet Nam"
        },
        {
            code: "QN",
            name: "Quang Nam"
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
    var cusAttributes = [{
        attribute00: "attr00",
        attribute01: "attr01",
        attribute02: "attr02",
        attribute03: "attr03",
        attribute04: "attr04",
        attribute05: "attr05",
        attribute06: "attr06",
        attribute07: "attr07",
        attribute08: "attr08",
        attribute09: "attr09"
    }];
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
            attachment: "D:\abc.txt",
            createDate: new Date(),
            isActive: false
        },
        {
            id: 2,
            name: "Thông tin đại lý bán hàng",
            attachment: "D:\daily.txt",
            createDate: new Date(),
            isActive: true
        }
    ];

    $("#frmCusGroup").dxForm({
        formData: {
            code: "CUS001",
            description: "KH tạp hoá",
            customerType: "Outlet",
            status: "Released",
            isActive: true,
            groupByMode: "List/Group",
        },
        colCount: 2,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        dataField: "code",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "description",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "customerType",
                        cssClass: "pr-5"
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: "status",
                        cssClass: "pl-5"
                    },
                    {
                        dataField: "isActive",
                        cssClass: "pl-5"
                    },
                    {
                        dataField: "groupByMode",
                        cssClass: "pl-5"
                    }
                ]
            }
        ]
    });

    $("#tabPanel").dxTabPanel({
        items: [{
            title: "By Attribute",
            template: function (itemData, itemIndex, element) {
                const gridDiv = $("<div style='padding:15px'>")
                gridDiv.dxDataGrid({
                    dataSource: cusAttributes,
                    keyExpr: "attribute00",
                    showBorders: true,
                    //filterRow: {
                    //    visible: true
                    //},
                    searchPanel: {
                        visible: true
                    },
                    scrolling: {
                        mode: 'standard'
                    },
                    allowColumnReordering: false,
                    rowAlternationEnabled: true,
                    //headerFilter: {
                    //    visible: true,
                    //},
                    //paging:
                    //{
                    //    pageSize: 10,
                    //},
                    //pager: {
                    //    visible: false,
                    //    allowedPageSizes: [10, 20, 'all'],
                    //    showPageSizeSelector: false,
                    //    showInfo: false,
                    //    showNavigationButtons: false,
                    //},
                    columns: ["attribute00", "attribute01", "attribute02", "attribute03", "attribute04", "attribute05", "attribute06", "attribute07", "attribute08", "attribute09"],
                });
                gridDiv.appendTo(element);
            }
            //}, {
            //    title: "By Attrinute",
            //    template: function (itemData, itemIndex, element) {
            //        const formDiv = $("<div style='padding:15px'>")
            //        formDiv.dxForm({
            //            formData: cusAttributes,
            //            colCount: 2,
            //            items: ["attribute00", "attribute01", "attribute02", "attribute03", "attribute04", "attribute05", "attribute06", "attribute07", "attribute08", "attribute09"]
            //        });
            //        formDiv.appendTo(element);
            //    }
        }, {
            title: "By List",
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
                                template: function (data, itemElement) {
                                    itemElement.append("<img style='width: 300px; height: 250px' src='" + data.editorOptions.value + "'>");
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
            title: "By GEO",
            template: function (itemData, itemIndex, element) {
                const formDiv = $("<div style='padding:15px'>")
                formDiv.dxForm({
                    formData: cusContact,
                    colCount: 2,
                    items: [
                        {
                            itemType: "group",
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
                            items: ["firstName", "lastName", "gender", "dateOfBirth", "email", "phone", "address", "identityNumber", "bankName", "accountName", "accountNumber"]
                        }
                    ]
                });
                formDiv.appendTo(element);
            }
        }]
    });


});
