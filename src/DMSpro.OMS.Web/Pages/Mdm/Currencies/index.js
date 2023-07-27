$(function () {
    var l = abp.localization.getResource("OMS");
	var currencyService = window.dMSpro.oMS.mdmService.controllers.currencies.currency;
	
    var dataCurrencies = [
        {
            id: 1,
            code: 'VND',
            name: 'Vietnamese Dong',
            rate: 23500
        },
        {
            id: 2,
            code: 'USD',
            name: 'US Dollar',
            rate: 1
        },
        {
            id: 3,
            code: 'MMK',
            name: 'Myamar kyat',
            rate: 2112.99
        },
        {
            id: 4,
            code: 'AUD',
            name: 'Autralian Dollar',
            rate: 1.54
        }
    ]
    var gridCurrencies = $('#dgCurrencies').dxDataGrid({
        dataSource: dataCurrencies,
        keyExpr: "code",
        editing: {
            mode: "row",
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            //popup: {
            //    title: l("Page.Title.Currencies"),
            //    showTitle: true,
            //    width: 500,
            //    height: 300
            //},
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
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
            allowedPageSizes: allowedPageSizes,
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Currency:Code"),
                width: 280,
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:Currency:Name"),
                width: 480,
                dataType: 'string',
            },
            {
                dataField: 'rate',
                caption: l("Rate (usd)"),
                width: 280,
                dataType: 'string',
            },
        ],
    }).dxDataGrid("instance");

    $("#NewCurrencyButton").click(function (e) {
        //e.preventDefault();
        //createModal.open();
        gridCurrencies.addRow();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        currencyService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/currencies/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'name', value: input.name }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });

});
