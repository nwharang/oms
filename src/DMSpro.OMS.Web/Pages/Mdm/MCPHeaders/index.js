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
                        dataField: 'Route',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            placeholder: ''
                        }
                    },
                    {
                        dataField: 'ItemGroup',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            placeholder: ''
                        }
                    },
                    {
                        dataField: 'Company',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            placeholder: ''
                        }
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Code',
                    },
                    {
                        dataField: 'Name',
                    } , {
                        dataField: 'IsGPSLocked',
                        editorType: 'dxCheckBox'
                    }]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'EffectiveDate',
                        editorType: 'dxDateBox',
                    }, {
                        dataField: 'EndDate',
                        editorType: 'dxDateBox',
                    }]
            }
        ]
    });

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    var dgMCP = $('#dgMCP')
        .dxDataGrid({
            dataSource: dataSource,
            editing: {
                mode: "row",
                allowAdding: abp.auth.isGranted('MdmService.MCPHeaders.Create'),
                allowUpdating: abp.auth.isGranted('MdmService.MCPHeaders.Delete'),
                allowDeleting: abp.auth.isGranted('MdmService.MCPHeaders.Delete'),
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                    deleteRow: l("Delete"),
                    confirmDeleteMessage: l("DeleteConfirmationMessage")
                }
            },
            remoteOperations: true,
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
            showRowLines: true,
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnResizingMode: 'widget',
            columnMinWidth: 50,
            columnAutoWidth: true,
            columnChooser: {
                enabled: true,
                mode: "select"
            },
            columnFixing: {
                enabled: true,
            },
            filterRow: {
                visible: true,
            },
            groupPanel: {
                visible: true,
            },
            headerFilter: {
                visible: true,
            },
            rowAlternationEnabled: true,
            searchPanel: {
                visible: true
            },
            stateStoring: { //save state in localStorage
                enabled: true,
                type: 'localStorage',
                storageKey: 'dgMCP',
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
            toolbar: {
                items: [
                    "groupPanel",
                    {
                        location: 'after',
                        template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                        onClick() {
                            dgMCP.addRow();
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
                    width: 110,
                    buttons: ['edit', 'delete'],
                    fixedPosition: "left",
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