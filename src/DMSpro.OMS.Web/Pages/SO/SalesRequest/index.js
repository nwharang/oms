// Search "Fix Late" to find where to fix
let startTime = Date.now();
let startTimeLoger = false
$(async function () {
    var l = abp.localization.getResource("OMS");
    // Store
    // Local variables
    console.clear()
    let { salesRequestsHeaderStore, docTypeStore, docStatusStore, docSourceStore, discountTypeStore } = store()
    const InfoSO = await store().getInfoSO()
    const { renderPopup } = helper(InfoSO)
    console.log("API and Store done load", Date.now() - startTime, "ms");

    let gridSalesRequests = $('#dgSalesRequestHeader').dxDataGrid({
        dataSource: { store: salesRequestsHeaderStore },
        // editing: {
        //     mode: 'popup',
        //     allowAdding: true, // Fix Late
        //     allowUpdating: true, // Fix Late
        //     useIcons: true,
        //     texts: {
        //         editRow: l("Edit"),
        //     },
        //     popup: {
        //         title: 'Sale Request',
        //         showTitle: true,
        //         height: '95%',
        //         width: '95%',
        //         hideOnOutsideClick: true,
        //         dragEnabled: false,
        //         toolbarItems: [
        //             {
        //                 widget: "dxButton",
        //                 location: "center",
        //                 toolbar: "bottom",
        //                 options: {
        //                     icon: "chevronprev",
        //                     disabled: Boolean(currentHeaderData.id),
        //                     onClick: function (e) {
        //                         salesRequestsHeaderService.getPrevDoc(currentHeaderData.id)
        //                     }
        //                 }
        //             },
        //             {
        //                 widget: "dxButton",
        //                 location: "center",
        //                 toolbar: "bottom",
        //                 options: {
        //                     icon: "chevronnext",
        //                     disabled: Boolean(currentHeaderData.id),
        //                     onClick: function (e) {
        //                         salesRequestsHeaderService.getNextDoc(currentHeaderData.id)
        //                     }
        //                 }
        //             },
        //             {
        //                 widget: "dxDropDownButton",
        //                 location: "after",
        //                 toolbar: "bottom",
        //                 items: [
        //                     {
        //                         badge: "Approve",
        //                     },
        //                     {
        //                         badge: "Disapprove",
        //                     }
        //                 ]
        //             },
        //             {
        //                 widget: 'dxButton',
        //                 location: "after",
        //                 toolbar: "bottom",
        //                 options: {
        //                     disabled: false, // Condition here
        //                     text: 'Save',
        //                     onClick() {
        //                         detailsDataGrids.saveEditData()
        //                     }
        //                 }
        //             },
        //             {
        //                 widget: "dxButton",
        //                 location: "after",
        //                 toolbar: "bottom",
        //                 options: {
        //                     text: "Cancel",
        //                     onClick: function (e) {
        //                         gridSalesRequests.cancelEditData()
        //                     }
        //                 },
        //             },
        //         ],
        //     },
        // form: {
        //     labelMode: "floatting",
        //     colCount: 3,
        //     onFieldDataChanged: () => {
        //         console.log("fieldDataChanged");
        //     },
        //     items: [
        //         {
        //             itemType: "group",
        //             caption: 'Documentation',
        //             items: [{
        //                 dataField: "docNbr",
        //                 dataType: 'string'
        //             }, "docType", "docSource", "remark", "businessPartnerId", "requestDate"]
        //         },
        //         {
        //             itemType: "group",
        //             caption: 'Alternative Minimum Tax',
        //             items: ["docTotalLineDiscountAmt", "docTotalLineAmt", "docTotalLineAmtAfterTax", "docTotalAmt", "docTotalAmtAfterTax"]
        //         },
        //         {
        //             itemType: "group",
        //             caption: 'Discount Information',
        //             items: ["docDiscountType", "docDiscountPerc", "docDiscountAmt"]
        //         },
        //         {
        //             itemType: "group",
        //             colSpan: 3,
        //             template: (data, itemElement) => {
        //                 // If don't have partner ID => Not render
        //                 let store = currentHeaderData.id ? salesRequestsHeaderService.getDoc(currentHeaderData.id) : null
        //                 if (store)
        //                     store.done(({ header, details }) => {
        //                         renderDetailForm(details, itemElement, header)
        //                     })
        //                 else
        //                     renderDetailForm(null, itemElement, detailsHeaderData)
        //             }
        //         }
        //     ]
        // }

        // },
        showRowLines: true,
        showBorders: true,
        // cacheEnabled: true,
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
            // formats: ['excel','pdf'],
            allowExportSelectedData: true,
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
        onContentReady: () => {
            !startTimeLoger ? console.log("First grid ready in", Date.now() - startTime, "ms") : "";
            startTimeLoger = true;
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgSalesRequestHeader',
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.SalesRequest")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                    onClick(e) {
                        renderPopup()
                    },
                },
                {
                    location: 'after',
                    template: '<div><button type="button" class="btn btn-light btn-sm dropdown-toggle waves-effect waves-themed hvr-icon-pop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height:36px"> <i class="fa fa-gear hvr-icon"></i> <span class="">Action</span>  </button><div class="dropdown-menu fadeindown"> <button class="dropdown-item" type="button">Approve</button></div></div>'
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
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
                        onClick: function (e) {
                            // create Popup
                            renderPopup(e.row.data.id)
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
                validationRules: [{ type: 'required' }],
                lookup: {
                    dataSource: InfoSO.salesOrderStore.customerList,
                    displayExpr: 'name',
                    valueExpr: 'id',
                },
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:RequestDate'),
                dataField: 'requestDate',
                dataType: 'datetime',
                format: 'M/d/yyyy, HH:mm',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                dataField: 'docDate',
                dataType: 'datetime',
                format: 'M/d/yyyy, HH:mm',
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
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt'),
                dataField: 'docTotalLineDiscountAmt',
                dataType: 'number',
                width: 100,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt'),
                dataField: 'docTotalLineAmt',
                dataType: 'number',
                visible: true,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax'),
                dataField: 'docTotalLineAmtAfterTax',
                dataType: 'number',
                width: 100,
                visible: true,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt'),
                dataField: 'docTotalAmt',
                dataType: 'number',
                visible: true,
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
                dataField: 'docTotalAmtAfterTax',
                dataType: 'number',
                visible: true,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType'),
                dataField: 'docDiscountType',
                dataType: 'string',
                lookup: {
                    dataSource: discountTypeStore,
                    valueExpr: "id",
                    displayExpr: "text",
                },
                validationRules: [{ type: 'required' }],
                visible: true,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc'),
                dataField: 'docDiscountPerc',
                dataType: 'number',
                validationRules: [{ type: 'required' }],
                format: '#0.00 %',
                width: 100,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt'),
                dataField: 'docDiscountAmt',
                dataType: 'number',
                validationRules: [{ type: 'required' }],
                width: 100,
            },

        ],
        summary: {
            totalItems: [{
                column: 'docTotalLineAmt',
                summaryType: 'sum',
                valueFormat: ",##0.###",
            }, {
                column: 'docTotalLineAmtAfterTax',
                summaryType: 'sum',
                valueFormat: ",##0.###",
            }],
        }
    }).dxDataGrid("instance");
    initImportPopup('', 'SalesRequest_Template', 'dgSalesRequestHeader');
});