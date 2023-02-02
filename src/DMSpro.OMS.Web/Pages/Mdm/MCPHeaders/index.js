var l = abp.localization.getResource("MdmService");
$(function () {

    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    $("#top-section").dxForm({
        formData: {
            // Docdate: currentDate(),
            // PostingDate: currentDate()
        },
        labelMode: 'floating',
        colCount: 4,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'RefMCP',
                    },
                    {
                        dataField: 'EffectiveDate',
                        editorType: 'dxDateBox',
                    }, {
                        dataField: 'OutletQuantity',
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Description',
                    },
                    {
                        dataField: 'Route',

                    }, {
                        dataField: 'Enddate',
                        editorType: 'dxDateBox'
                    }]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'EmployeeName',
                    }]
            }
        ]
    });

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    var gridMCPHeaders = $('#gridMCPHeaders')
        .dxDataGrid({
            dataSource: dataSource,
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
                pageSize: 10
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
                mode: "select" // or "select"
            },
            //columnFixing: {
            //    enabled: true
            //},
            pager: {
                visible: true,
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50, 100],
                showInfo: true,
                showNavigationButtons: true
            },
            toolbar: {
                items: [{
                    location: 'before',
                    widget: 'dxButton',
                    options: {
                        icon: 'fa fa-plus',
                        text: 'Add Row',
                        onClick() {
                            gridMCPHeaders.addRow();
                        },
                    },
                },
                    'columnChooserButton',
                    'exportButton',
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: 'fa fa-upload',
                        onClick() {
                            //dataGridContainer.refresh();
                        },
                    },
                }, "searchPanel"
                ],
            },
            export: {
                enabled: true,
                // formats: ['excel','pdf'],
                allowExportSelectedData: true,
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
                                paging: { enabled: true, pageSize: 10 },
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
                    buttons: ['edit', 'delete'],
                    //fixed: true,
                },
                {
                    caption: "outlet Id",
                    dataField: "outletId",
                },
                {
                    caption: "outlet Name",
                    dataField: "outletName",
                },
                {
                    caption: "Address",
                    dataField: "address"
                },
                {
                    caption: "Effective Date",
                    dataField: "effectiveDate"
                }, {

                    caption: "EndDate",
                    dataField: "endDate"
                }, {

                    caption: "Distance",
                    dataField: "distance"
                }, {

                    caption: "Monday",
                    dataField: "Monday",
                    dataType: "boolean",
                }
                , {

                    caption: "Tuesday",
                    dataField: "Tuesday",
                    dataType: "boolean",
                }, {

                    caption: "Wednesday",
                    dataField: "Wednesday",
                    dataType: "boolean",
                }, {

                    caption: "Thursday",
                    dataField: "Thursday",
                    dataType: "boolean",
                }, {

                    caption: "Friday",
                    dataField: "Friday",
                    dataType: "boolean",
                }, {

                    caption: "Saturday",
                    dataField: "Saturday",
                    dataType: "boolean",
                }, {

                    caption: "Sunday",
                    dataField: "Sunday",
                    dataType: "boolean",
                }, {

                    caption: "Week1",
                    dataField: "Week1",
                    dataType: "boolean",
                }, {

                    caption: "Week2",
                    dataField: "Week2",
                    dataType: "boolean",
                }, {

                    caption: "Week3",
                    dataField: "Week3",
                    dataType: "boolean",
                }, {

                    caption: "Week4",
                    dataField: "Week4",
                    dataType: "boolean",
                }
            ],
        })
});

var dataSource = [
    {
        id: 1,
        outletId: "C001",
        outletName: "Cửa hàng A2",
        address: "Quận 2, Hồ Chí Minh",
        effectiveDate: "01/01/2023",
        endDate: "02/11/2023",
        distance: 100,
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true,
        Week1: true,
        Week2: true,
        Week3: true,
        Week4: true,
    },
    {
        id: 2,
        outletId: "C002",
        outletName: "Cửa hàng A2",
        address: "Quận 2, Hồ Chí Minh",
        effectiveDate: "10/01/2023",
        endDate: "12/11/2023",
        distance: 100,
        Monday: true,
        Tuesday: true,
        Wednesday: false,
        Thursday: false,
        Friday: true,
        Saturday: true,
        Sunday: true,
        Week1: true,
        Week2: false,
        Week3: false,
        Week4: true,
    },
    {
        id: 3,
        outletId: "C003",
        outletName: "Cửa hàng A3",
        address: "Quận 4, Hồ Chí Minh",
        effectiveDate: "15/01/2023",
        endDate: "15/11/2023",
        distance: 400,
        Monday: false,
        Tuesday: false,
        Wednesday: true,
        Thursday: true,
        Friday: false,
        Saturday: false,
        Sunday: false,
        Week1: true,
        Week2: false,
        Week3: false,
        Week4: false,
    }
];