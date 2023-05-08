$(function () {
    /****control*****/
    //Grid Price Update
    mainGridInstance = $('#priceUpdateContainer').dxDataGrid({
        dataSource: store.priceUpdateStore,
        remoteOperations: true,
        cacheEnabled: true,
        ...genaralConfig('PriceUpdate'),
        showRowLines: true,
        showBorders: true,
        focusedRowEnabled: true,
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
        stateStoring: { 
            enabled: true,
            type: 'localStorage',
            storageKey: 'priceUpdateContainer',
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.PriceUpdate")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                    onClick() {
                        renderPopup({})
                        // let newtab = window.open('/Mdm/PriceUpdates/Details', '_blank');
                        // newtab.sessionStorage.removeItem('PriceUpdateId');
                    },
                    visible: abp.auth.isGranted('MdmService.PriceUpdates.Create')
                },
                'columnChooserButton',
                "exportButton",
                // {
                //     location: 'after',
                //     widget: 'dxButton',
                //     options: {
                //         icon: "import",
                //         elementAttr: {
                //             class: "import-excel",
                //         },
                //         onClick(e) {
                //             var gridControl = e.element.closest('div.dx-datagrid').parent();
                //             var gridName = gridControl.attr('id');
                //             var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //             if (popup) popup.show();
                //         },
                //     }
                // },
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
                            renderPopup(e.row.data)
                            // var newtab = window.open('/Mdm/PriceUpdates/Details', '_blank');
                            // newtab.sessionStorage.setItem("PriceUpdateId", e.row.data.id);
                        }
                    }
                ],
                fixed: true,
                fixedPosition: "left",
                allowExporting: false,
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:Code'),
                dataField: 'code',
                dataType: 'string',
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateingCodeField')
                    }
                ]
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:Description'),
                dataField: 'description',
                dataType: 'string'
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:PriceList'),
                dataField: 'priceListId',
                calculateDisplayValue: "priceList.name",
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: {
                        store: store.priceListStore,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            // {
            //     caption: l('EntityFieldName:MDMService:PriceUpdate:EffectiveDate'),
            //     dataField: 'effectiveDate',
            //     dataType: 'datetime'
            // },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdate:Status'),
                dataField: 'status',
                lookup: {
                    dataSource: store.status,
                    displayExpr: 'text',
                    valueExpr: 'id'
                },
                allowEditing: false
            }
        ]
    }).dxDataGrid("instance");

    // initImportPopup('api/mdm-service/price-updates', 'PriceUpdateSchedules_Template', 'priceUpdateContainer');
});