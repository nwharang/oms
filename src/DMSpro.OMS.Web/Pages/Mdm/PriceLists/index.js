$(function () {
    // language
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    const arithmeticFactorType = ['WHOLE_NUMBER', 'PERCENTAGE'];
    // custom store
    var customStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
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

    // get price list
    var priceList = [];
    var urlPriceListLookup = abp.appPath + 'api/mdm-service/price-lists/price-list-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlPriceListLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call geoList ajax: ', data);
            priceList = data.items;
        }
    });
    var getPriceList = function () {
        return priceList;
    }

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
                    caption: l("EntityFieldName:MDMService:PriceList:Code"),
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: 'name',
                    caption: l("EntityFieldName:MDMService:PriceList:Name"),
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: 'active',
                    caption: l("EntityFieldName:MDMService:PriceList:Active"),
                    alignment: 'center',
                    dataType: 'boolean',
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    }
                },
                {
                    caption: l("EntityFieldName:MDMService:PriceList:BasePriceList"),
                    dataField: "basePriceListId",
                    editorType: 'dxSelectBox',
                    lookup: {
                        dataSource: getPriceList,
                        valueExpr: 'id',
                        displayExpr: 'displayName'
                    }
                },
                {
                    dataField: 'arithmeticOperation',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticOperation"),
                },
                {
                    dataField: 'arithmeticFactor',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactor"),
                    dataType: 'number'
                },
                {
                    dataField: 'arithmeticFactorType',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactorType"),
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: arithmeticFactorType,
                        searchEnabled: true
                    }
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

    $("input#Search").on("input", function () {
        dataGrid.searchByText($(this).val());
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
