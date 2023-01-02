$(function () {
    var l = abp.localization.getResource("MdmService");
	var customerGroupService = window.dMSpro.oMS.mdmService.controllers.customerGroups.customerGroup;
	

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
