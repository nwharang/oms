$(function () {
    // language texts
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    //var salesOrgService = window.dMSpro.oMS.mdmService.controllers.salesOrgs.salesOrg;
    //var salesOrgValueService = window.dMSpro.oMS.mdmService.controllers.salesOrgValues.salesOrgValue;
    //var salesOrgEmpAssignmentService = window.dMSpro.oMS.mdmService.controllers.salesOrgEmpAssignments.salesOrgEmpAssignment;

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
                        caption: "Name",
                        dataField: 'name',
                        editorOptions: {
                            width: '300px',
                        }
                    },
                    {
                        caption: "IsActive",
                        dataField: "active",
                        editorType: "dxCheckBox",
                        editorOptions: {
                            width: '300px',
                        }
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        caption: "Channel",
                        dataField: 'channel',
                        editorOptions: {
                            width: '300px',
                        }
                    },
                    {
                        caption: "Product Category",
                        dataField: 'productcategory',
                        editorOptions: {
                            width: '300px',
                        }
                    },
                    {
                        caption: "Sales Employee",
                        dataField: 'salesemployee',
                        editorOptions: {
                            width: '300px',
                        }
                    }
                ]
            }
        ]
    });

    $("#dataTreeListContainer").dxTreeView({
        items: salesOrgValueDatas,
        dataStructure: 'plain',
        parentIdExpr: 'parentId',
        keyExpr: 'id',
        displayExpr: 'name',
        onItemClick(e) {
            const item = e.itemData;
            if (item.id) {
                dataGridContainer.filter(['salesorgvaluecode', '=', item.id]);
            } else {
                dataGridContainer.filter(['salesorgvaluecode', '=', 0]);
            }
        },
    }).dxTreeView('instance');

    var dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: employeeDatas,
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
        columns: [
            {
                caption: "Employee Code",
                dataField: "employeecode",
            },
            {
                caption: "Name",
                dataField: "name"
            },
            {
                caption: "Base",
                dataField: "base"
            },
            {
                caption: "Effective Date",
                dataField: "effectivedate"
            },
            {
                caption: "End Date",
                dataField: "enddate"
            },
            {
                dataField: "salesorgvaluecode",
                visible: false
            }
        ],
    }).dxDataGrid("instance");

    dataGridContainer.filter(['salesorgvaluecode', '=', 0]);
});

var salesOrgValueDatas = [
    {
        id: 1,
        parentId: null,
        name: "GT",
        islastelevel: true
    },
    {
        id: 2,
        parentId: 1,
        name: "MD",
        islastelevel: true
    },
    {
        id: 3,
        parentId: 2,
        name: "MB1",
        islastelevel: false
    },
    {
        id: 4,
        parentId: 2,
        name: "MB2",
        islastelevel: false
    },
    {
        id: 5,
        parentId: 3,
        name: "Hà Nội",
        islastelevel: false
    },
    {
        id: 6,
        parentId: 3,
        name: "Quảng Ninh",
        islastelevel: false
    }
];

var employeeDatas = [
    {
        id: 1,
        employeecode: "RSM 01",
        name: "Le Van A",
        Base: true,
        effectivedate: "10/12/2022",
        enddate: "10/01/2023",
        salesorgvaluecode: 5
    },
    {
        id: 2,
        employeecode: "RSM 02",
        name: "Nguyen Van B",
        Base: false,
        effectivedate: "14/11/2021",
        enddate: "13/11/2025",
        salesorgvaluecode: 4
    },
    {
        id: 3,
        employeecode: "Admin 01",
        name: "Admin 1",
        Base: true,
        effectivedate: "10/12/2022",
        enddate: "10/01/2023",
        salesorgvaluecode: 3
    },
    {
        id: 4,
        employeecode: "Admin 02",
        name: "Admin 2",
        Base: false,
        effectivedate: "10/12/2022",
        enddate: "10/01/2023",
        salesorgvaluecode: 2
    },
    {
        id: 5,
        employeecode: "RSM 03",
        name: "Nguyen Ngoc C",
        Base: false,
        effectivedate: "03/02/2022",
        enddate: "28/01/2023",
        salesorgvaluecode: 1
    },
    {
        id: 6,
        employeecode: "Admin 02",
        name: "Admin 2",
        Base: false,
        effectivedate: "10/12/2022",
        enddate: "10/01/2023",
        salesorgvaluecode: 3
    },
    {
        id: 7,
        employeecode: "NV01",
        name: "Tran Van Ti",
        Base: false,
        effectivedate: "10/12/2022",
        enddate: "10/01/2023",
        salesorgvaluecode: 3
    },
];

//$(function () {
//    var l = abp.localization.getResource("MdmService");
//	var salesOrgService = window.dMSpro.oMS.mdmService.controllers.salesOrgs.salesOrg;



//    var createModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "SalesOrgs/CreateModal",
//        scriptUrl: "/Pages/SalesOrgs/createModal.js",
//        modalClass: "salesOrgCreate"
//    });

//	var editModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "SalesOrgs/EditModal",
//        scriptUrl: "/Pages/SalesOrgs/editModal.js",
//        modalClass: "salesOrgEdit"
//    });

//	var getFilter = function() {
//        return {
//            filterText: $("#FilterText").val(),
//            code: $("#CodeFilter").val(),
//			name: $("#NameFilter").val(),
//			channelId: $("#ChannelIdFilter").val(),
//			productCategoryId: $("#ProductCategoryIdFilter").val(),
//            active: (function () {
//                var value = $("#ActiveFilter").val();
//                if (value === undefined || value === null || value === '') {
//                    return '';
//                }
//                return value === 'true';
//            })(),
//			employeeId: $("#EmployeeIdFilter").val()
//        };
//    };

//    var dataTable = $("#SalesOrgsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
//        processing: true,
//        serverSide: true,
//        paging: true,
//        searching: false,
//        scrollX: true,
//        autoWidth: true,
//        scrollCollapse: true,
//        order: [[1, "asc"]],
//        ajax: abp.libs.datatables.createAjax(salesOrgService.getList, getFilter),
//        columnDefs: [
//            {
//                rowAction: {
//                    items:
//                        [
//                            {
//                                text: l("Edit"),
//                                visible: abp.auth.isGranted('MdmService.SalesOrgs.Edit'),
//                                action: function (data) {
//                                    editModal.open({
//                                     id: data.record.id
//                                     });
//                                }
//                            },
//                            {
//                                text: l("Delete"),
//                                visible: abp.auth.isGranted('MdmService.SalesOrgs.Delete'),
//                                confirmMessage: function () {
//                                    return l("DeleteConfirmationMessage");
//                                },
//                                action: function (data) {
//                                    salesOrgService.delete(data.record.id)
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
//			{ data: "name" },
//			{ data: "channelId" },
//			{ data: "productCategoryId" },
//            {
//                data: "active",
//                render: function (active) {
//                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
//                }
//            },
//			{ data: "employeeId" }
//        ]
//    }));

//    createModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    editModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    $("#NewSalesOrgButton").click(function (e) {
//        e.preventDefault();
//        createModal.open();
//    });

//	$("#SearchForm").submit(function (e) {
//        e.preventDefault();
//        dataTable.ajax.reload();
//    });

//    $("#ExportToExcelButton").click(function (e) {
//        e.preventDefault();

//        salesOrgService.getDownloadToken().then(
//            function(result){
//                    var input = getFilter();
//                    var url =  abp.appPath + 'api/mdm-service/sales-orgs/as-excel-file' +
//                        abp.utils.buildQueryString([
//                            { name: 'downloadToken', value: result.token },
//                            { name: 'filterText', value: input.filterText },
//                            { name: 'code', value: input.code },
//                            { name: 'name', value: input.name },
//                            { name: 'channelId', value: input.channelId },
//                            { name: 'productCategoryId', value: input.productCategoryId },
//                            { name: 'active', value: input.active },
//                            { name: 'employeeId', value: input.employeeId }
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
