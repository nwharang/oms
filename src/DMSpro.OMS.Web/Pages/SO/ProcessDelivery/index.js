$(function () {
    // language texts
    var l = abp.localization.getResource("MdmService");

    const dataForm = {
        fromDate: new Date(),
        toDate: new Date()
    }

    $("#frmProcessDelivery").dxForm({
        colCount: 2,
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
            docDate: new Date('2022/11/22'),
            doNbr: 32324,
            salesMan: 'LE VAN A',
            customerName: 'CHI 4',
            address: 'Address - Ward - Dis',
            amount: '30,230,203',
            discount: 0,
            check: true
        },
        {
            id: 2,
            docDate: new Date('2022/11/22'),
            doNbr: 32325,
            salesMan: 'LE VAN A',
            customerName: 'CHI 5',
            address: 'Address - Ward - Dis',
            amount: '30,230,203',
            discount: 0,
            check: false
        },
        {
            id: 3,
            docDate: new Date('2022/11/22'),
            doNbr: 32326,
            salesMan: 'LE VAN A',
            customerName: 'CHI 6',
            address: 'Address - Ward - Dis',
            amount: '30,230,203',
            discount: 0,
            check: true
        },
        {
            id: 4,
            docDate: new Date('2022/11/22'),
            doNbr: 32327,
            salesMan: 'LE VAN A',
            customerName: 'CHI 7',
            address: 'Address - Ward - Dis',
            amount: '30,230,203',
            discount: 0,
            check: false
        },
        {
            id: 5,
            docDate: new Date('2022/11/22'),
            doNbr: 32328,
            salesMan: 'PHAN VAN B',
            customerName: 'CHI 8',
            address: 'Address - Ward - Dis',
            amount: '30,230,203',
            discount: 2332,
            check: false
        },
        {
            id: 6,
            docDate: new Date('2022/11/22'),
            doNbr: 32329,
            salesMan: 'PHAN VAN B',
            customerName: 'CHI 9',
            address: 'Address - Ward - Dis',
            amount: '30,230,203',
            discount: '3,424,234',
            check: true
        },
        {
            id: 7,
            docDate: new Date('2022/11/22'),
            doNbr: 32330,
            salesMan: 'PHAN VAN B',
            customerName: 'CHI 10',
            address: 'Address - Ward - Dis',
            amount: '30,230,203',
            discount: 32,
            check: false
        }
    ]

    var gridProcessDelivery = $('#gridProcessDelivery').dxDataGrid({
        dataSource: data,
        keyExpr: "id",
        showBorders: true,
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        paging:
        {
            pageSize: 10,
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
                dataField: 'doNbr',
                caption: 'DO Nbr',
                width: 100,
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
                type: 'buttons',
                caption: 'Actions',
                buttons: [
                    {
                        hint: 'Delivery Fail',
                        icon: 'fa fa-times'
                    }, {
                        hint: 'Confirm',
                        icon: 'fa fa-check-square-o'
                    }
                ]
            }
        ],
    }).dxDataGrid("instance");
});