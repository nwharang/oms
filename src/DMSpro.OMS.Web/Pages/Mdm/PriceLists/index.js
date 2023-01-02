$(function () {
    // language
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;

    // custom store
    var customStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            [
                'skip',
                'take',
                'requireTotalCount',
                'requireGroupCount',
                'sort',
                'filter',
                'totalSummary',
                'group',
                'groupSummary',
            ].forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const args2 = { 'loadOptions': args };
            priceListService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return priceListService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return priceListService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return priceListService.delete(key);
        }
    });

    //const data = [
    //    {
    //        ID: 1,
    //        Code: 'PL01',
    //        Name: 'Base Price',
    //        Currencies: 1,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 2,
    //        Code: 'PL02',
    //        Name: 'Sellin Price',
    //        Currencies: 1,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 3,
    //        Code: 'PL03',
    //        Name: 'Sellout Price',
    //        Currencies: 1,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 4,
    //        Code: 'PL04',
    //        Name: 'Pricelist 4',
    //        Currencies: 1,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 5,
    //        Code: 'PL05',
    //        Name: 'Pricelist 5',
    //        Currencies: 1,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 6,
    //        Code: 'PL06',
    //        Name: 'Pricelist 6',
    //        Currencies: 1,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 7,
    //        Code: 'PL07',
    //        Name: 'Pricelist 7',
    //        Currencies: 2,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 8,
    //        Code: 'PL08',
    //        Name: 'Pricelist 8',
    //        Currencies: 3,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 9,
    //        Code: 'PL09',
    //        Name: 'Pricelist 9',
    //        Currencies: 4,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 10,
    //        Code: 'PL10',
    //        Name: 'Pricelist 10',
    //        Currencies: 5,
    //        IsActive: false,
    //    },
    //];

    //const cur = [{
    //    ID: 1,
    //    Name: 'VND',
    //}, {
    //    ID: 2,
    //    Name: 'USD',
    //}, {
    //    ID: 3,
    //    Name: 'KYAT',
    //}, {
    //    ID: 4,
    //    Name: 'BATH',
    //}, {
    //    ID: 5,
    //    Name: 'AUD',
    //},];

    const dataGrid = $('#gridPriceLists').dxDataGrid({
        dataSource: customStore,
        keyExpr: 'id',
        remoteOperations: true,
        showBorders: true,
        autoExpandAll: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        //columnHidingEnabled: true,
        errorRowEnabled: false,
        filterRow: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
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
        editing: {
            mode: 'row',
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
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        toolbar: {
            items: [
                {
                    name: "searchPanel",
                    location: 'after'
                }
            ]
        },
        columns:
            [
                {
                    type: 'buttons',
                    buttons: ['edit', 'delete'],
                    caption: l('Actions'),
                },
                {
                    dataField: 'code',
                    caption: l("EntityFieldName:MDMService:PriceList:Code")
                },
                {
                    dataField: 'name',
                    caption: l("EntityFieldName:MDMService:PriceList:Name")
                },
                {
                    dataField: 'active',
                    caption: l("EntityFieldName:MDMService:PriceList:Active")
                },
                {
                    caption: l("EntityFieldName:MDMService:PriceList:BasePriceList"),
                    dataField: "basePriceListId",
                    lookup: {
                        dataSource(options) {
                            return {
                                store: customStore,
                                filter: options.data ? ["!", ["name", "=", options.data.name]] : null,
                            };
                        },
                        displayExpr: 'name',
                        valueExpr: 'id',
                    }
                },
                {
                    dataField: 'arithmeticOperation',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticOperation")
                },
                {
                    dataField: 'arithmeticFactor',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactor")
                },
                {
                    dataField: 'arithmeticFactorType',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactorType")
                },
                //{
                //    dataField: 'isFirstPriceList',
                //    caption: l("EntityFieldName:MDMService:PriceList:IsFirstPriceList")
                //}
            ]
    }).dxDataGrid('instance');

    $("#NewPriceListButton").click(function () {
        dataGrid.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        priceListService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/price-lists/as-excel-file' + abp.utils.buildQueryString([
                    { name: 'downloadToken', value: result.token }
                ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });
});
