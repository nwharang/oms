$(function () {
    // language texts
    var l = abp.localization.getResource("MdmService");

    const dataForm = {
        fromDate: new Date(),
        toDate: new Date()
    }

    $("#frmProcessSalesOrders").dxForm({
        colCount: 2,
        labelMode: 'floating',
        formData: dataForm,
        items: [
            {
                itemType: 'group',
                caption: 'Filter by date',
                items: [
                    {
                        itemType: 'group',
                        items: ['fromDate', 'toDate']
                    }
                ]
            },
            {
                itemType: 'group',
                caption: 'NVBH',
                items: [
                    {

                        itemType: 'simple',
                        editorType: 'dxCheckBox',
                        editorOptions: {
                            text: 'LE VAN A',
                            value: true
                        },
                    }, {
                        itemType: 'simple',
                        editorType: 'dxCheckBox',
                        editorOptions: {
                            text: 'PHAN THI B',
                            value: true
                        }
                    }
                ]
            }]
    });

    const data = [
        {
            id: 1,
            docDate: new Date('2022/11/01'),
            soNbr: 234,
            status: 'Shipping',
            salesMan: 'LE VAN A',
            customerName: 'KH 1',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 0,
            message: 'Item IT0032 out of stock',
            check: true
        },
        {
            id: 2,
            docDate: new Date('2022/11/01'),
            soNbr: 235,
            status: 'Open',
            salesMan: 'LE VAN A',
            customerName: 'Chi 4',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 0,
            message: 'Item IT0032, item IT9999 out of stock',
            check: true
        },
        {
            id: 3,
            docDate: new Date('2022/11/01'),
            soNbr: 236,
            status: 'Open',
            salesMan: 'LE VAN A',
            customerName: 'Chi 5',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 0,
            message: 'Item IT0032 out of stock',
            check: true
        },
        {
            id: 4,
            docDate: new Date('2022/11/01'),
            soNbr: 237,
            status: 'Open',
            salesMan: 'LE VAN A',
            customerName: 'Chi 6',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 0,
            message: 'Item IT0032 out of stock',
            check: true
        },
        {
            id: 5,
            docDate: new Date('2022/11/01'),
            soNbr: 238,
            status: 'Open',
            salesMan: 'LE VAN A',
            customerName: 'Chi 7',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 0,
            message: 'Item IT0032 out of stock',
            check: true
        },
        {
            id: 6,
            docDate: new Date('2022/11/01'),
            soNbr: 239,
            status: 'Open',
            salesMan: 'PHAN THI B',
            customerName: 'Chi 8',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 0,
            message: 'You must assgin LOT/BAT cho SP IT9999',
            check: true
        },
        {
            id: 7,
            docDate: new Date('2022/11/01'),
            soNbr: 240,
            status: 'Open',
            salesMan: 'PHAN THI B',
            customerName: 'Chi 9',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 0,
            message: '',
            check: true
        },
        {
            id: 8,
            docDate: new Date('2022/11/01'),
            soNbr: 241,
            status: 'Open',
            salesMan: 'PHAN THI B',
            customerName: 'Chi 10',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: 576,
            message: '',
            check: true
        },
        {
            id: 9,
            docDate: new Date('2022/11/22'),
            soNbr: 242,
            status: 'Open',
            salesMan: 'PHAN THI B',
            customerName: 'Chi 11',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: '534,234',
            message: '',
            check: true
        },
        {
            id: 10,
            docDate: new Date('2022/11/22'),
            soNbr: 243,
            status: 'Open',
            salesMan: 'PHAN THI B',
            customerName: 'Chi 12',
            address: 'Address - Ward - Dis',
            amount: '12,032,031',
            discount: '534,234',
            message: '',
            check: true
        }
    ]

    var gridProcessSalesOrder = $('#gridProcessSaleOrder').dxDataGrid({
        dataSource: data,
        keyExpr: "id",
        showBorders: true,
        //filterRow: {
        //    visible: true
        //},
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        //headerFilter: {
        //    visible: true,
        //},
        paging:
        {
            pageSize: pageSize,
        },
        pager: {
            visible: true,
            allowedPageSizes: [10, 20, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        columns: [
            {
                dataField: 'check',
                caption: '',
                width: 50
            },
            {
                dataField: 'id',
                caption: 'No.',
                width: 70,
                alignment: 'center'
            },
            {
                dataField: 'docDate',
                caption: 'DocDate',
                dataType: 'date',
                width: 150,
                alignment: 'center'
            },
            {
                dataField: 'soNbr',
                caption: 'SO Nbr',
                width: 100,
                alignment: 'center'
            },
            {
                dataField: 'status',
                caption: 'Status',
                width: 150,
                alignment: 'center'
            },
            {
                dataField: 'salesMan',
                caption: 'SalesMan',
                width: 200,
                alignment: 'center'
            },
            {
                dataField: 'customerName',
                caption: 'Customer Name',
                width: 200,
                alignment: 'center'
            },
            {
                dataField: 'address',
                caption: 'Address',
                width: 300,
                alignment: 'center'
            },
            {
                dataField: 'amount',
                caption: 'Amount',
                width: 150,
                alignment: 'right'
            },
            {
                dataField: 'discount',
                caption: 'Discount',
                width: 150,
                alignment: 'center'
            },
            {
                dataField: 'message',
                caption: 'Message',
                width: 300,
                alignment: 'left'
            },
            {
                type: 'buttons',
                caption: 'Actions',
                buttons: [
                    {
                        hint: 'Reject',
                        icon: 'fa fa-ban'
                    }, {
                        hint: 'Delivery',
                        icon: 'fa fa-truck'
                    }
                ]
            }
        ],
        summary: {
            totalItems: [
                {
                    name: 'TotalAmount',
                    showInColumn: 'Address',
                    displayFormat: 'Total Amount:',
                    summaryType: 'custom',
                    alignment: 'right'
                },
                {
                    name: 'Amount',
                    showInColumn: 'Amount',
                    displayFormat: '120,320,031',
                    summaryType: 'custom'
                },
                {
                    name: 'Discount',
                    showInColumn: 'Discount',
                    displayFormat: '1,069,044',
                    summaryType: 'custom'
                }
            ],
        },
    }).dxDataGrid("instance");
});