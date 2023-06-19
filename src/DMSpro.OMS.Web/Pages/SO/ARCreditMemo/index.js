﻿$(async function () {
    var l = abp.localization.getResource("OMS");
    let { mainStore, docTypeStore, docStatusStore, docSourceStore, discountTypeStore, render } = store()
    let currentSelectedDoc = new Map();
    let mainGrid = $('#dgSOHeader').dxDataGrid({
        dataSource: { store: mainStore },
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        columnAutoWidth: true,
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        columnResizingMode: 'widget',
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },

        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        groupPanel: {
            visible: true,
        },
        export: {
            enabled: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('PurchaseRequests');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PurchaseRequests.xlsx');
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
            storageKey: `dg${render.permissionGroup}Header`,
        },
        paging: {
            enabled: true,
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    widget: "dxButton",
                    options: {
                        icon: 'add',
                    },
                    onClick: (e) => {
                        loadingPanel.show()
                        preLoad.then((data) => helper(data, () => loadingPanel.hide()))
                    }
                },
                'columnChooserButton',
                "exportButton",
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                buttons: [
                    {
                        text: l('Button.ViewDetail'),
                        icon: "fieldchooser",
                        onClick: (e) => {
                            loadingPanel.show()
                            preLoad.then((data) => helper(data, () => loadingPanel.hide(), { docId: e.row.data.id }))
                        }
                    }
                ],
                fixed: true,
                fixedPosition: "left",
                allowExporting: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocNbr'),
                dataField: 'docNbr',
                dataType: 'string',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:BaseDoc'),
                dataField: 'baseDoc',
                dataType: 'string',
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:Route'),
                dataField: 'routeId',
                calculateDisplayValue: "routeDisplay",
                lookup: {
                    store: "routeDisplay",
                    displayExpr: "name",
                    valueExpr: 'id'
                },
                dataType: 'string',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:Employee'),
                dataField: 'employeeId',
                calculateDisplayValue: "employeeDisplay",
                lookup: {
                    store: "employeeDisplay",
                    displayExpr: "name",
                    valueExpr: 'id'
                },
                dataType: 'string',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocType'),
                dataField: 'docType',
                lookup: {
                    dataSource: docTypeStore,
                    displayExpr: "text",
                    valueExpr: "id"
                },
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocSource'),
                dataField: 'docSource',
                dataType: 'string',
                lookup: {
                    dataSource: docSourceStore,
                    displayExpr: "text",
                    valueExpr: "id"
                },
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:Remark'),
                dataField: 'remark',
                dataType: 'string'
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner'),
                editorType: 'dxSelectBox',
                dataField: 'businessPartnerId',
                lookup: {
                    store: "businessPartnerId",
                    displayExpr: "name",
                    valueExpr: 'id'
                },
                validationRules: [{ type: 'required' }],
                calculateDisplayValue: "businessPartnerDisplay"
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:RequestDate'),
                dataField: 'requestDate',
                dataType: 'date',
                format: 'dd/MM/yyyy',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                dataField: 'docDate',
                dataType: 'date',
                format: 'dd/MM/yyyy',
                validationRules: [{ type: 'required' }],
                visible: false,

            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocStatus'),
                dataField: 'docStatus',
                dataType: 'string',
                lookup: {
                    dataSource: docStatusStore,
                    valueExpr: "id",
                    displayExpr: "text",
                },
                visible: true,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt'),
                dataField: 'docTotalAmt',
                dataType: 'number',
                format: ",##0.###",
                visible: true,
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
                dataField: 'docTotalAmtAfterTax',
                dataType: 'number',
                format: ",##0.###",
                visible: true,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
        ],
        summary: {
            totalItems: [
                {
                    column: 'docTotalLineDiscountAmt',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
                {
                    column: 'docTotalAmt',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
                {
                    column: 'docTotalAmtAfterTax',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
                {
                    column: 'docDiscountAmt',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
            ],
        },
        onContentReady: (e) => {
            currentSelectedDoc.clear()
            $('.disabledActionCheckboxFormControl').each(function () {
                let id = $(this).attr('id')
                currentSelectedDoc.set(id, false)
            })
            $('.actionCheckboxFormControl').each(function () {
                let id = $(this).attr('id')
                currentSelectedDoc.set(id, false)
            })
        },
    }).dxDataGrid("instance");
    $('body').append('<div id=popup>')
})
