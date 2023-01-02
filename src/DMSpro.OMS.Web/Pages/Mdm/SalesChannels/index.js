$(function () {
    var l = abp.localization.getResource("MdmService");
	var salesChannelService = window.dMSpro.oMS.mdmService.controllers.salesChannels.salesChannel;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
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

            salesChannelService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            return key == 0 ? salesChannelService.get(key) : null;
        },
        insert(values) {
            return salesChannelService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesChannelService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesChannelService.delete(key);
        }
    });
    var gridSalesChannels = $('#dgSalesChannels').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.SalesChannels.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.SalesChannels.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.SalesChannels.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        remoteOperations: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        errorRowEnabled: false,
        filterRow: {
            visible: false
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
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:SalesChannel:Code"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:SalesChannel:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'description',
                caption: l("EntityFieldName:MDMService:SalesChannel:Description"),
                dataType: 'string',
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:SalesChannel:Active"),
                validationRules: [{ type: "required" }],
                width: 110,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                }
            }
        ],
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        gridSalesChannels.searchByText($(this).val());
    });

    $("#btnNewSalesChannel").click(function (e) {
        gridSalesChannels.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        salesChannelService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/sales-channels/as-excel-file' + 
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
