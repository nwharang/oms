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
    var gridPurchaseRequests = $('#gridPurchaseRequests').dxDataGrid({
        dataSource: [{
            Vendor: "IDP",
            DocNbr: "RP001",
            CreatedUser: "Phượng Nguyễn",
            DocDate: "02/03/2023",
            RequestDate: "05/01/2023",
            PostingDate: "07/01/2023",
            Status: "Open",
            Remark: "Giao sau 14h",
            DocTotalAmt: 112456000,
            DocTotalAmtAfterTax: 112456000
        },
        {
            Vendor: "IDP",
            DocNbr: "RP002",
            CreatedUser: "Minh Lien",
            DocDate: "01/03/2023",
            RequestDate: "02/01/2023",
            PostingDate: "05/01/2023",
            Status: "Approved",
            Remark: "Ok, cho đi ngay",
            DocTotalAmt: 66321000,
            DocTotalAmtAfterTax: 66000000
        },
        {
            Vendor: "IDP",
            DocNbr: "RP003",
            CreatedUser: "Nguyễn Hiệp",
            DocDate: "01/03/2023",
            RequestDate: "01/01/2023",
            PostingDate: "10/01/2023",
            Status: "Rejected",
            Remark: "Không giao đi",
            DocTotalAmt: 56789000,
            DocTotalAmtAfterTax: 56111000
        }],
        // keyExpr: "id",
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'storage',
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
                "addRowButton",
                {
                    location: 'after',
                    template: '<div><button type="button" class="btn btn-light btn-sm dropdown-toggle waves-effect waves-themed hvr-icon-pop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height:36px"> <i class="fa fa-gear hvr-icon"></i> <span class="">Action</span>  </button><div class="dropdown-menu fadeindown"> <button class="dropdown-item" type="button">Confirmed</button> <button class="dropdown-item" type="button">Rejected</button></div></div>'
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
                            popupImport.option({
                                contentTemplate: () => popupImportContentTemplate(),
                                'position.of': `#import-excel`,
                            });
                            popupImport.show();
                        },
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
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('PurchaseRequest');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PurchaseRequest.xlsx');
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('PurchaseRequest.pdf');
                });
            }
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
                            var w = window.open('/POs/PurchaseRequests/Details', '_blank');
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
                caption: "RequestDate",
                dataField: "RequestDate",
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

    var files = [];
    var url = `${abp.appPath}api/mdm-service/companies/insert-from-excel`;

    const popupImportContentTemplate = function () { 
        const content = $('<div />');
        content.append(
            $('<div>').dxSelectBox({
                dataSource: [
                    { name: l('Insert from Excel'), value: 'I' },
                    { name: l('Update from Excel'), value: 'U' },
                ],
                valueExpr: 'value',
                displayExpr: 'name',
                value: 'I',
                onValueChanged(e) {
                    if (e.value == 'I') {
                        url = `${abp.appPath}api/mdm-service/companies/insert-from-excel`;
                    } else url = `${abp.appPath}api/mdm-service/companies/update-from-excel`
                },
            }));
        content.append(
            $('<div>').dxFileUploader({
                selectButtonText: l('Select a file'),
                icon: 'import',
                //labelText: '',
                multiple: false,
                uploadMode: 'useForm',
                allowedFileExtensions: ['.xlsx', '.xls'],
                onValueChanged(e) {
                    files = e.value;
                }
            }));
        return content;
    };
    const popupImport = $('#popupImport').dxPopup({
        width: 400,
        height: 300,
        //container: '#import-excel',
        showTitle: true,
        title: l('Import Excel'),
        visible: false,
        dragEnabled: true,
        hideOnOutsideClick: true,
        showCloseButton: true,
        position: {
            my: 'top',
            at: 'center',
            //collision: 'fit',
        },
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'before',
            options: {
                icon: 'download',
                text: l('Download Template'),
                onClick() {
                    return;

                    const url = '/api/mdm-service/companies/get-excel-template';
                    fetch(url)
                        // Retrieve its body as ReadableStream
                        .then((response) => {
                            console.log(response);
                            const reader = response.body.getReader();
                            console.log(reader);
                            return new ReadableStream({
                                start(controller) {
                                    return pump();
                                    function pump() {
                                        return reader.read().then(({ done, value }) => {
                                            // When no more data needs to be consumed, close the stream
                                            if (done) {
                                                controller.close();
                                                return;
                                            }
                                            // Enqueue the next data chunk into our target stream
                                            controller.enqueue(value);
                                            return pump();
                                        });
                                    }
                                }
                            })
                        })
                        // Create a new response out of the stream
                        .then((stream) => new Response(stream))
                        // Create an object URL for the response
                        .then((response) => response.blob())
                        .then((blob) => URL.createObjectURL(blob))
                        .then((href) => {
                            const a = document.createElement("a");
                            document.body.appendChild(a);
                            a.style = "display: none";
                            a.href = href;
                            a.download = 'PurchaseRequests_Template.xlsx';
                            a.click();

                        });

                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                icon: 'upload',
                text: l('Import'),
                onClick(e) {
                    if (files.length > 0) {
                        var formData = new FormData();
                        formData.append("file", files[0]);

                        $.ajax({
                            type: "POST",
                            url: url,
                            async: true,
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            //timeout: 60000,
                            success: function (data) {
                                popup.hide();
                                gridCompanies.refresh();
                            },
                            error: function (msg) {
                                // handle error
                                console.log(msg.responseText.error);
                            },

                        });

                    }
                },
            },
        },
        ],
    }).dxPopup('instance');
});
