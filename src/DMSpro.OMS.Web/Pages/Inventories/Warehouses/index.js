$(function () {
    var l = abp.localization.getResource("MdmService");

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: wareHouseDatas,
        keyExpr: "id",
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        focusedRowEnabled: true,
        searchPanel: {
            visible: true
        },
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        filterRow: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
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
            storageKey: 'gridSystemDatas',
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
                //{
                //    name: "searchPanel",
                //    location: 'after'
                //}
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        dataGridContainer.addRow();
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
            ]
        },
        columns: [
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