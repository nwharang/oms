var popupVenderInformation;
function showDetails() {
    popupVenderInformation.show();
}

var products = [{
    "ID": 1,
    "Name": "Item 1",
    "BarCode": "ABC-abc-1234"
}, {
    "ID": 2,
    "Name": "Item 2",
    "BarCode": "A-0010-Z"
}, {
    "ID": 3,
    "Name": "Item 3",
    "BarCode": "A-0050-Z"
}, {
    "ID": 4,
    "Name": "Item 4",
    "BarCode": "A-0060-Z"
}, {
    "ID": 5,
    "Name": "Item 35",
    "BarCode": "45-0060-Z"
}];

$(function () {
    var l = abp.localization.getResource("MdmService");
    var gridPurchaseOrders = $('#gridPurchaseOrders').dxDataGrid({
        dataSource: [{
            Vendor: "IDP",
            DocNbr: "RP001",
            CreatedUser: "Phượng Nguyễn",
            DocDate: "02/03/2023",
            DeliveryDate: "01/01/2023",
            PostingDate: "07/01/2023",
            Status: "Open",
            Remark: "Giao sau 14h",
            DocTotalAmt: 122456000,
            DocTotalAmtAfterTax: 112155000
        },
        {
            Vendor: "IDP",
            DocNbr: "RP002",
            CreatedUser: "Minh Lien",
            DocDate: "01/03/2023",
            DeliveryDate: "12/02/2023",
            PostingDate: "05/01/2023",
            Status: "Approved",
            Remark: "Ok, cho đi ngay",
            DocTotalAmt: 63371000,
            DocTotalAmtAfterTax: 68700000
        },
        {
            Vendor: "IDP",
            DocNbr: "RP003",
            CreatedUser: "Nguyễn Hiệp",
            DocDate: "01/03/2023",
            DeliveryDate: "01/06/2023",
            PostingDate: "10/01/2023",
            Status: "Rejected",
            Remark: "Không giao đi",
            DocTotalAmt: 5689000,
            DocTotalAmtAfterTax: 56011000
        }],
        // keyExpr: "id",
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridPurchaseOrders',
        },
        showBorders: true,
        columnAutoWidth: true,
        scrolling: {
            columnRenderingMode: 'virtual',
        },
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        allowColumnReordering: true,
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        rowAlternationEnabled: true,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        headerFilter: {
            visible: false,
        },
        columnChooser: {
            enabled: true,
            mode: "select"
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
                    template: '<button  id="AddNewButton" type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick(e) {
                        e.element.closest('div.dx-datagrid.dx-gridbase-container').parent().data('dxDataGrid').addRow();
                    },
                },
                {
                    location: 'after',
                    template: '<div><button type="button" class="btn btn-light btn-sm dropdown-toggle waves-effect waves-themed hvr-icon-pop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height:36px"> <i class="fa fa-gear hvr-icon"></i> <span class="">Action</span>  </button><div class="dropdown-menu fadeindown"> <button class="dropdown-item" type="button">Confirmed</button> <button class="dropdown-item" type="button">Rejected</button></div></div>'
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
        export: {
            enabled: true,
            // formats: ['excel','pdf'],
            allowExportSelectedData: true,
        },
        groupPanel: {
            visible: true,
        },
        selection: {
            mode: 'multiple',
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Data.xlsx');
                });
            });
            e.cancel = true;
        },
        editing: {
            mode: "row",
            //allowAdding: abp.auth.isGranted('MdmService.u-oMs.Create'),
            //allowUpdating: abp.auth.isGranted('MdmService.u-oMs.Edit'),
            //allowDeleting: abp.auth.isGranted('MdmService.u-oMs.Delete'),
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing: function (e) {
            if (e.dataField == "code" && e.parentType == "dataRow") {
                e.editorName = "dxDropDownBox";
                e.editorOptions.dropDownOptions = {
                    //height: 500
                };
                e.editorOptions.contentTemplate = function (args, container) {
                    var value = args.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            width: '100%',
                            dataSource: args.component.option("dataSource"),
                            keyExpr: "ID",
                            columns: [{
                                caption: "Item Code",
                                dataField: "Name"
                            }, "BarCode"],
                            hoverStateEnabled: true,
                            paging: { enabled: true, pageSize: pageSize },
                            filterRow: { visible: true },
                            scrolling: { mode: "infinite" },
                            height: '90%',
                            showRowLines: true,
                            showBorders: true,
                            selection: { mode: "single" },
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                args.component.option("value", keys);
                            }
                        });

                    var dataGrid = $dataGrid.dxDataGrid("instance");

                    args.component.on("valueChanged", function (args) {
                        var value = args.value;

                        dataGrid.selectRows(value, false);
                    });
                    container.append($dataGrid);
                    return container;
                };
            }
        },
        columns: [
            {
                width: 100,
                type: 'buttons',
                caption: l('Actions'),
                buttons: [
                    {
                        text: "View Details",
                        icon: "fieldchooser",
                        hint: "View Details",
                        onClick: function (e) {
                            var w = window.open('/SO/SalesRequest/Details', '_blank');
                            w.sessionStorage.setItem("model", JSON.stringify(e.row.data));
                        }
                    },
                    'edit', 'delete']
            },
            {
                caption: "Vendor",
                dataField: "Vendor",
                cellTemplate: function (element, info) {
                    element.append(`<a href="javascript:showDetails()">${info.text}</a>`);
                },
                alignment: "center",
                cssClass: "increaseFontWeight"
            },
            {
                caption: "DocNbr",
                dataField: "DocNbr",
            },
            {
                caption: "Created User",
                dataField: "CreatedUser",
            },
            {
                caption: "DocDate",
                dataField: "DocDate",
            },
            {
                caption: "Delivery Date",
                dataField: "DeliveryDate",
            },
            {
                caption: "Posting Date",
                dataField: "PostingDate",
                allowFiltering: false
            },
            {
                caption: "Status",
                dataField: "Status",
            },
            {
                caption: "Remark",
                dataField: "Remark",
                allowFiltering: false
            },
            {
                caption: "Doc Total Amt",
                dataField: "DocTotalAmt",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText + "đ";
                },
                allowFiltering: false,
                alignment: 'right',
                format: ",##0.###",
                summaryType: "sum",
            },
            {
                caption: "Doc Total Amt After Tax",
                dataField: "DocTotalAmtAfterTax",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText + "đ";
                },
                allowFiltering: false,
                format: ",##0.###",
                summaryType: "sum",
                alignment: 'right',
            },
        ],
        summary: {
            totalItems: [{
                column: 'DocTotalAmt',
                summaryType: 'sum',
                valueFormat: ",##0.###",
                customizeText: function (data) {
                    return data.valueText + "đ";
                },
            }, {
                column: 'DocTotalAmtAfterTax',
                summaryType: 'sum',
                valueFormat: ",##0.###",
                customizeText: function (data) {
                    return data.valueText + "đ";
                },
            }],
        },
    }).dxDataGrid("instance");

    popupVenderInformation = $("#popupVenderInformation").dxPopup({
        width: 600,
        height: 400,
        showTitle: true,
        container: '.page-content',
        title: 'Vendor Information',
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: true,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
    }).dxPopup('instance');
});

//$(function () {
//    var l = abp.localization.getResource("OMSWeb");
//    var salesRequestsHeaderService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;

//    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

//    /****custom store*****/
//    var salesRequestsHeaderStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            salesRequestsHeaderService.getHeaderListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            salesRequestsHeaderService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        },
//        insert(values) {
//            return salesRequestsHeaderService.create(values, { contentType: "application/json" });
//        },
//        update(key, values) {
//            return salesRequestsHeaderService.update(key, values, { contentType: "application/json" });
//        },
//        remove(key) {
//            return salesRequestsHeaderService.delete(key);
//        }
//    });

//    /****control*****/
//    const salesRequestHeaderContainer = $('#salesRequestHeaderContainer').dxDataGrid({
//        dataSource: salesRequestsHeaderStore,
//        remoteOperations: false,
//        cacheEnabled: true,
//        export: {
//            enabled: true,
//            // allowExportSelectedData: true,
//        },
//        onExporting(e) {
//            const workbook = new ExcelJS.Workbook();
//            const worksheet = workbook.addWorksheet('SalesRequestHeader');

//            DevExpress.excelExporter.exportDataGrid({
//                component: e.component,
//                worksheet,
//                autoFilterEnabled: true,
//            }).then(() => {
//                workbook.xlsx.writeBuffer().then((buffer) => {
//                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'SalesRequestHeader.xlsx');
//                });
//            });
//            e.cancel = true;
//        },
//        showRowLines: true,
//        showBorders: true,
//        focusedRowEnabled: true,
//        allowColumnReordering: true,
//        allowColumnResizing: true,
//        columnResizingMode: 'widget',
//        columnMinWidth: 50,
//        columnAutoWidth: true,
//        columnChooser: {
//            enabled: true,
//            mode: "select"
//        },
//        columnFixing: {
//            enabled: true,
//        },
//        filterRow: {
//            visible: true,
//        },
//        groupPanel: {
//            visible: true,
//        },
//        headerFilter: {
//            visible: true,
//        },
//        rowAlternationEnabled: true,
//        searchPanel: {
//            visible: true
//        },
//        //scrolling: {
//        //    mode: 'standard'
//        //},
//        stateStoring: { //save state in localStorage
//            enabled: true,
//            type: 'localStorage',
//            storageKey: 'salesRequestHeaderContainer',
//        },
//        paging: {
//            enabled: true,
//            pageSize: pageSize
//        },
//        pager: {
//            visible: true,
//            showPageSizeSelector: true,
//            allowedPageSizes: [10, 20, 50, 100],
//            showInfo: true,
//            showNavigationButtons: true
//        },
//        toolbar: {
//            items: [
//                "groupPanel",
//                {
//                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.SalesRequest")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
//                    onClick() {
//                        var newtab = window.open('/SO/SalesRequest/Details', '_blank');
//                        newtab.sessionStorage.setItem("SalesRequest", null);
//                    },
//                },
//                'columnChooserButton',
//                "exportButton",
//                {
//                    location: 'after',
//                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
//                    onClick() {
//                        //todo
//                    },
//                },
//                "searchPanel"
//            ],
//        },
//        columns: [
//            {
//                caption: l("Actions"),
//                type: 'buttons',
//                buttons: [
//                    {
//                        text: l('Button.ViewDetail'),
//                        icon: "fieldchooser",
//                        onClick: function (e) {
//                            var newtab = window.open('/SO/SalesRequest/Details', '_blank');
//                            newtab.sessionStorage.setItem("SalesRequest", JSON.stringify(e.row.data));
//                        }
//                    }
//                ],
//                fixed: true,
//                fixedPosition: "left",
//                allowExporting: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocNbr'),
//                dataField: 'docNbr',
//                dataType: 'string'
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:Company'),
//                dataField: 'companyId',
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocType'),
//                dataField: 'docType',
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
//                dataField: 'docDate',
//                dataType: 'datetime'
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DeliveryDate'),
//                //dataField: 'deliveryDate',
//                dataType: 'date'
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:PostingDate'),
//                //dataField: 'postingDate',
//                dataType: 'datetime'
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:Remark'),
//                dataField: 'remark',
//                dataType: 'string'
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocStatus'),
//                dataField: 'docStatus',
//                dataType: 'string',
//            },

//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner'),
//                dataField: 'businessPartnerDisplay',
//                dataType: 'string',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:Route'),
//                dataField: 'routeDisplay',
//                dataType: 'string',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:Employee'),
//                dataField: 'employeeDisplay',
//                dataType: 'string',
//                visible: false,
//            },

//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:LinkedDoc'),
//                //dataField: 'linkedDoc',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:LinkedSFA'),
//                dataField: 'linkedSFAId',
//                visible: false,
//            },

//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt'),
//                dataField: 'docTotalLineDiscountAmt',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt'),
//                dataField: 'docTotalLineAmt',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax'),
//                dataField: 'docTotalLineAmtAfterTax',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType'),
//                dataField: 'docDiscountType',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc'),
//                dataField: 'docDiscountPerc',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt'),
//                dataField: 'docDiscountAmt',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt'),
//                dataField: 'docTotalAmt',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
//                dataField: 'docTotalAmtAfterTax',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocBaseType'),
//                dataField: 'docBaseType',
//                dataType: 'number',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:BaseDoc'),
//                dataField: 'baseDocId',
//                dataType: 'string',
//                visible: false,
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequest:DocSource'),
//                dataField: 'docSource',
//                dataType: 'number',
//                visible: false,
//            },
//        ]
//    }).dxDataGrid("instance");

//    /****button*****/

//    /****function*****/
//    function isNotEmpty(value) {
//        return value !== undefined && value !== null && value !== '';
//    }
//});