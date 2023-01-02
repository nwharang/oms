$(function () {
    var l = abp.localization.getResource("MdmService");

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: wareHouseDatas,
        keyExpr: "id",
        showBorders: true,
        focusedRowEnabled: true,
        searchPanel: {
            visible: true
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
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
        editing: {
            mode: 'row',
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        toolbar: {
            items: [
                {
                    name: "searchPanel",
                    location: 'after'
                }
            ]
        },
        columns: [
            //{
            //    caption: l("Actions"),
            //    type: 'buttons',
            //    width: 120,
            //    buttons: ['edit', 'delete']
            //},
            {
                caption: "Code",
                dataField: "code",
                validationRules: [{ type: "required" }]
            },
            {
                caption: "Name",
                dataField: "name"
            },
            {
                caption: "Type",
                dataField: "type"
            },
            {
                caption: "IsEnableLocation",
                dataField: "isenablelocation"
            }
        ],
        masterDetail: {
            enabled: true,
            template: masterDetailTemplate,
        }
    }).dxDataGrid("instance");

    function masterDetailTemplate(_, masterDetailOptions) {
        return $('<div>').dxTabPanel({
            items: [
                {
                    title: 'Detail',
                    template: createDetailTabTemplate(masterDetailOptions),
                },
                {
                    title: 'WHLocation',
                    template: createWHLocationTabTemplate(masterDetailOptions),
                }
            ],
        });
    }

    function createDetailTabTemplate(masterDetailData) {
        return function () {
            return $('<div>')
                .dxDataGrid({
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        {
                            caption: "County",
                            dataField: "county"
                        },
                        {
                            caption: "Province",
                            dataField: "province"
                        },
                        {
                            caption: "District",
                            dataField: "district"
                        },
                        {
                            caption: "Ward",
                            dataField: "ward"
                        },
                        {
                            caption: "Street",
                            dataField: "street"
                        },
                        {
                            caption: "Address Desc",
                            dataField: "addressdesc"
                        },
                        {
                            caption: "Address",
                            dataField: "address"
                        },
                        {
                            caption: "Latitude",
                            dataField: "latitude"
                        },
                        {
                            caption: "Longitude",
                            dataField: "longitude"
                        }
                    ],
                    dataSource: new DevExpress.data.DataSource({
                        store: new DevExpress.data.ArrayStore({
                            key: 'id',
                            data: whDetailDatas,
                        }),
                        filter: ['warehouseID', '=', masterDetailData.key],
                    }),
                });
        };
    };

    function createWHLocationTabTemplate(masterDetailData) {
        return function () {
            return $('<div>')
                .dxDataGrid({
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        {
                            caption: "Code",
                            dataField: "code"
                        },
                        {
                            caption: "Name",
                            dataField: "name"
                        },
                        {
                            caption: "InActive",
                            dataField: "inactive"
                        }
                    ],
                    dataSource: new DevExpress.data.DataSource({
                        store: new DevExpress.data.ArrayStore({
                            key: 'id',
                            data: whLocationDatas,
                        }),
                        filter: ['warehouseID', '=', masterDetailData.key]
                    }),
                });
        }
    };

    $("#NewWareHouseButton").click(function () {
        dataGridContainer.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        console.log("ExportToExcelButton is called.");
    });
});

var wareHouseDatas = [
    {
        id: 1,
        code: "Main",
        name: "Kho Chính",
        type: "Main",
        isenablelocation: true
    },
    {
        id: 2,
        code: "Van",
        name: "Kho Nhân Viên",
        type: "Van",
        isenablelocation: false
    },
    {
        id: 3,
        code: "Damage",
        name: "Kho hàng hỏng",
        type: "Damage",
        isenablelocation: false
    },
    {
        id: 4,
        code: "TMK",
        name: "Kho Hàng Khuyến Mãi",
        type: "TMK",
        isenablelocation: false
    }
];

var whDetailDatas = [
    {
        id: 1,
        warehouseID: 1,
        county: "VN",
        province: "Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường 3",
        street: "Cao Thắng",
        addressdesc: "96 Cao Thắng",
        address: "96 Cao Thắng",
        latitude: 0,
        longitude: 0
    },
    {
        id: 2,
        warehouseID: 2,
        county: "VN",
        province: "Đà Nẵng",
        district: "Cẩm Lệ",
        ward: "Phường Hòa Xuân",
        street: "Võ Chí Công",
        addressdesc: "01 Võ Chí Công",
        address: "01 Võ Chí Công",
        latitude: 0,
        longitude: 0
    },
    {
        id: 3,
        warehouseID: 4,
        county: "VN",
        province: "Hà Nội",
        district: "Ba Đình",
        ward: "Phường Trúc Bạch",
        street: "Phạm Hồng Thái",
        addressdesc: "01 Phạm Hồng Thái",
        address: "01 Phạm Hồng Thái",
        latitude: 0,
        longitude: 0
    }
];

var whLocationDatas = [
    {
        id: 1,
        warehouseID: 1,
        code: "Main Location",
        name: "Kho chính NPP",
        inactive: true
    },
    {
        id: 2,
        warehouseID: 1,
        code: "Main2 Location",
        name: "Kho phụ NPP",
        inactive: true
    },
    {
        id: 3,
        warehouseID: 2,
        code: "Main Location",
        name: "Kho chính NPP",
        inactive: true
    },
    {
        id: 4,
        warehouseID: 4,
        code: "Main Location",
        name: "Kho chính NPP",
        inactive: true
    },
    {
        id: 5,
        warehouseID: 4,
        code: "Main2 Location",
        name: "Kho chính NPP",
        inactive: true
    },
    {
        id: 6,
        warehouseID: 4,
        code: "Main3 Location",
        name: "Kho phụ NPP",
        inactive: true
    }
];