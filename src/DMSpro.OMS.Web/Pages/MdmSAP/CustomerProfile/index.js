$(async function () {

    // let cusAttrStore = await rpcService.cusAttrService.getListDevextremes({ filter: JSON.stringify(['active', "=", true]) }).then(({ data }) => {
    //     gridInfo.itemAttr = {
    //         flat: data.filter(e => e.hierarchyLevel == null).sort((a, b) => a.attrNo - b.attrNo),
    //     }
    // })

    gridInfo.instance.mainGrid = $('#dgCustomers').dxDataGrid({
        dataSource: store.customStore,
        repaintChangesOnly: true,
        editing: {
            mode: "row",
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
        },
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
        columnMinWidth: 50,
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Customer.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'dgCustomerProfile',
        // },
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
                'addRowButton',
                'columnChooserButton',
                "exportButton",
                "searchPanel"
            ],
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                alignment: 'left',
                buttons: [
                    {
                        icon: "fieldchooser",
                        text: l('Button.ViewDetail'),
                        onClick: (e) => {
                            gridInfo.data = e.row.data
                            renderPopup()
                        }
                    },
                    'delete'
                ],
                fixed: true,
                fixedPosition: "left",
                showInColumnChooser: false,
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                visible: false,
                formItem: {
                    visible: false
                },
            },
            {
                dataField: 'code',
                caption: l("MdmSAPService.Entity.Code"),
                dataType: 'string',
                showInColumnChooser: false,
            },
            {
                dataField: 'name',
                caption: l("MdmSAPService.Entity.Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }],
                showInColumnChooser: false,
            },
            {
                dataField: 'foreignName',
                caption: l('MdmSAPService.Entity.ForeignName'), // Localize
                dataType: 'string',
            },
            {
                dataField: 'phone1',
                caption: l("MdmSAPService.Entity.Phone1"),
                dataType: 'string',
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{10}$',
                        message: l('ValidateError:Phone')
                    }
                ]
            },
            {
                dataField: 'phone2',
                caption: l("MdmSAPService.Entity.Phone2"),
                dataType: 'string',
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{10}$',
                        message: l('ValidateError:Phone')
                    }
                ],
            },
            {
                dataField: 'paymentGroup',
                caption: l("MdmSAPService.Entity.PaymentGroup"),
                dataType: 'string',
            },
            {
                dataField: 'fedTaxID',
                caption: l("MdmSAPService.Entity.FedTaxID"),
                dataType: 'string',
            },
            {
                dataField: 'contactPerson',
                caption: l("MdmSAPService.Entity.ContactPerson"),
                dataType: 'string',
                showInColumnChooser: false,
            },
            {
                dataField: 'parentCode',
                caption: l("MdmSAPService.Entity.ParentCode"),
                dataType: 'string',
                showInColumnChooser: false,
            },
            {
                dataField: 'erpCusCode',
                caption: l("MdmSAPService.Entity.ERPCusCode"),
                dataType: 'string',
            },
            {
                dataField: 'priceListCode',
                caption: l("MdmSAPService.Entity.PriceListCode"),
                dataType: 'string',
                // calculateDisplayValue: (e) => e.priceList?.name || null,
            },
            {
                dataField: 'taxGroupCode',
                caption: l('MdmSAPService.Entity.TaxGroupCode'),
                dataType: 'string',
            },
            {
                dataField: 'creditLimit',
                caption: l("MdmSAPService.Entity.CreditLimit"),
                dataType: 'number',
                editorOptions: {
                    min: 0,
                    format: '#'
                }
            },
            {
                dataField: 'active',
                caption: l("MdmSAPService.Entity.Active"),
                width: 110,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.data.active == "Y" ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
        ],
    }).dxDataGrid("instance");

    initImportPopup('api/mdm-service/customers', 'Customers_Template', 'dgCustomers');
});
