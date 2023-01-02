$(function () {
    // language texts
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    //var sellingZoneService = window.dMSpro.oMS.mdmService.controllers.sellingZones.sellingZone;

    $("#form").dxForm({
        colCount: 2,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        caption: "Code",
                        dataField: 'code',
                        editorOptions: {
                            width: '300px',
                        }
                    },
                    {
                        caption: "Description",
                        dataField: 'dest',
                        editorOptions: {
                            width: '300px',
                        }
                    },
                    {
                        caption: "Sale Org",
                        dataField: "saleorg"
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        caption: "Area",
                        dataField: 'area',
                        editorOptions: {
                            width: '300px',
                        }
                    },
                    {
                        caption: "Is Active",
                        dataField: 'isactive',
                        editorType: "dxCheckBox",
                        editorOptions: {
                            width: '300px',
                        }
                    }
                ]
            }
        ]
    });

    $("#tabPanel").dxTabPanel({
        items: [
            {
                title: 'SupperVisor History',
                template: createSupperVisorTabTemplate(),
            },
            {
                title: 'Company Assgin',
                template: createCompanyAssginabTemplate(),
            },
            {
                title: 'OUTLET Assgin',
                template: createOUTLETAssginTabTemplate(),
            },
            {
                title: 'Employee',
                template: createEmployeeTabTemplate(),
            }
        ]
    });

    function createSupperVisorTabTemplate() {
        return function () {
            return $('<div>')
                .dxDataGrid({
                    dataSource: supperVisorData,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        {
                            caption: "SupperVisor",
                            dataField: "code"
                        },
                        {
                            caption: "SupperVisor Name",
                            dataField: "name"
                        },
                        {
                            caption: "Effective Date",
                            dataField: "effectivedate"
                        },
                        {
                            caption: "End Date",
                            dataField: "enddate"
                        }
                    ]
                });
        };
    }

    function createCompanyAssginabTemplate() {
        return function () {
            return $('<div>')
                .dxDataGrid({
                    dataSource: companyAssginData,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        {
                            caption: "Company Code",
                            dataField: "code"
                        },
                        {
                            caption: "Company Name",
                            dataField: "name"
                        },
                        {
                            caption: "Effective Date",
                            dataField: "effectivedate"
                        },
                        {
                            caption: "End Date",
                            dataField: "enddate"
                        }
                    ]
                });
        };
    }

    function createOUTLETAssginTabTemplate() {
        return function () {
            return $('<div>')
                .dxDataGrid({
                    dataSource: customerAssginData,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        {
                            caption: "OutletId",
                            dataField: "code"
                        },
                        {
                            caption: "OutletId Name",
                            dataField: "name"
                        },
                        {
                            caption: "Effective Date",
                            dataField: "effectivedate"
                        },
                        {
                            caption: "End Date",
                            dataField: "enddate"
                        }
                    ]
                });
        };
    }

    function createEmployeeTabTemplate() {
        return function () {
            return $('<div>')
                .dxDataGrid({
                    dataSource: employeeData,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        {
                            caption: "Employee Code",
                            dataField: "code"
                        },
                        {
                            caption: "Employee Name",
                            dataField: "name"
                        },
                        {
                            caption: "Employee Type",
                            dataField: "type"
                        },
                        {
                            caption: "Effective Date",
                            dataField: "effectivedate"
                        },
                        {
                            caption: "End Date",
                            dataField: "enddate"
                        }
                    ]
                });
        };
    }

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        sellingZoneService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/selling-zones/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });
});

var supperVisorData = [
    {
        id: 1,
        code: "SS01",
        name: "Le Van A",
        effectivedate: "01/01/2022",
        enddate: "10/10/2022"
    },
    {
        id: 2,
        code: "SS02",
        name: "Le Van B",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    }
];

var companyAssginData = [
    {
        id: 1,
        code: "NPP01",
        name: "NPP01",
        effectivedate: "01/01/2022",
        enddate: "10/10/2022"
    },
    {
        id: 2,
        code: "NPP02",
        name: "NPP02",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    }
];

var customerAssginData = [
    {
        id: 1,
        code: "Outlet01",
        name: "Cus01",
        effectivedate: "01/01/2022",
        enddate: "10/10/2022"
    },
    {
        id: 2,
        code: "Outlet02",
        name: "Cus02",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    },
    {
        id: 3,
        code: "Outlet03",
        name: "Cus03",
        effectivedate: "01/01/2022",
        enddate: "10/10/2022"
    },
    {
        id: 4,
        code: "Outlet04",
        name: "Cus04",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    },
    {
        id: 5,
        code: "Outlet05",
        name: "Cus05",
        effectivedate: "01/01/2022",
        enddate: "10/10/2022"
    },
    {
        id: 6,
        code: "Outlet06",
        name: "Cus06",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    }
];

var employeeData = [
    {
        id: 1,
        code: "NV01",
        name: "Nguyen Van A 1",
        type: "NVBV",
        effectivedate: "01/01/2022",
        enddate: "10/10/2022"
    },
    {
        id: 2,
        code: "NV02",
        name: "Nguyen Van A 2",
        type: "NVBV",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    },
    {
        id: 3,
        code: "NV03",
        name: "Nguyen Van A 3",
        type: "NVVP",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    },
    {
        id: 4,
        code: "NV04",
        name: "Nguyen Van A 4",
        type: "VNKT",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    },
    {
        id: 5,
        code: "NV05",
        name: "Nguyen Van A 5",
        type: "NVQC",
        effectivedate: "01/11/2022",
        enddate: "10/02/2023"
    }
];

//$(function () {
//    var l = abp.localization.getResource("MdmService");
//	var sellingZoneService = window.dMSpro.oMS.mdmService.controllers.sellingZones.sellingZone;



//    var createModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "SellingZones/CreateModal",
//        scriptUrl: "/Pages/SellingZones/createModal.js",
//        modalClass: "sellingZoneCreate"
//    });

//	var editModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "SellingZones/EditModal",
//        scriptUrl: "/Pages/SellingZones/editModal.js",
//        modalClass: "sellingZoneEdit"
//    });

//	var getFilter = function() {
//        return {
//            filterText: $("#FilterText").val(),
//            code: $("#CodeFilter").val(),
//			description: $("#DescriptionFilter").val(),
//			salesOrgId: $("#SalesOrgIdFilter").val(),
//			salesOrgValueId: $("#SalesOrgValueIdFilter").val(),
//            active: (function () {
//                var value = $("#ActiveFilter").val();
//                if (value === undefined || value === null || value === '') {
//                    return '';
//                }
//                return value === 'true';
//            })()
//        };
//    };

//    var dataTable = $("#SellingZonesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
//        processing: true,
//        serverSide: true,
//        paging: true,
//        searching: false,
//        scrollX: true,
//        autoWidth: true,
//        scrollCollapse: true,
//        order: [[1, "asc"]],
//        ajax: abp.libs.datatables.createAjax(sellingZoneService.getList, getFilter),
//        columnDefs: [
//            {
//                rowAction: {
//                    items:
//                        [
//                            {
//                                text: l("Edit"),
//                                visible: abp.auth.isGranted('MdmService.SellingZones.Edit'),
//                                action: function (data) {
//                                    editModal.open({
//                                     id: data.record.id
//                                     });
//                                }
//                            },
//                            {
//                                text: l("Delete"),
//                                visible: abp.auth.isGranted('MdmService.SellingZones.Delete'),
//                                confirmMessage: function () {
//                                    return l("DeleteConfirmationMessage");
//                                },
//                                action: function (data) {
//                                    sellingZoneService.delete(data.record.id)
//                                        .then(function () {
//                                            abp.notify.info(l("SuccessfullyDeleted"));
//                                            dataTable.ajax.reload();
//                                        });
//                                }
//                            }
//                        ]
//                }
//            },
//			{ data: "code" },
//			{ data: "description" },
//			{ data: "salesOrgId" },
//			{ data: "salesOrgValueId" },
//            {
//                data: "active",
//                render: function (active) {
//                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
//                }
//            }
//        ]
//    }));

//    createModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    editModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    $("#NewSellingZoneButton").click(function (e) {
//        e.preventDefault();
//        createModal.open();
//    });

//	$("#SearchForm").submit(function (e) {
//        e.preventDefault();
//        dataTable.ajax.reload();
//    });

//    $("#ExportToExcelButton").click(function (e) {
//        e.preventDefault();

//        sellingZoneService.getDownloadToken().then(
//            function(result){
//                    var input = getFilter();
//                    var url =  abp.appPath + 'api/mdm-service/selling-zones/as-excel-file' +
//                        abp.utils.buildQueryString([
//                            { name: 'downloadToken', value: result.token },
//                            { name: 'filterText', value: input.filterText },
//                            { name: 'code', value: input.code },
//                            { name: 'description', value: input.description },
//                            { name: 'salesOrgId', value: input.salesOrgId },
//                            { name: 'salesOrgValueId', value: input.salesOrgValueId },
//                            { name: 'active', value: input.active }
//                            ]);

//                    var downloadWindow = window.open(url, '_blank');
//                    downloadWindow.focus();
//            }
//        )
//    });

//    $('#AdvancedFilterSectionToggler').on('click', function (e) {
//        $('#AdvancedFilterSection').toggle();
//    });

//    $('#AdvancedFilterSection').on('keypress', function (e) {
//        if (e.which === 13) {
//            dataTable.ajax.reload();
//        }
//    });

//    $('#AdvancedFilterSection select').change(function() {
//        dataTable.ajax.reload();
//    });


//});
