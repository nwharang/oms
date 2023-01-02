$(function () {
    var l = abp.localization.getResource("MdmService");
    var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;
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

            vATService.getListDevextremes(args)
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
            return key == 0 ? vATService.get(key) : null;
        },
        insert(values) {
            return vATService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return vATService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return vATService.delete(key);
        }
    });

    var gridVATs = $('#dgVATs').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.VATs.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.VATs.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.VATs.Delete'),
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
                caption: l("EntityFieldName:MDMService:VAT:Code"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:VAT:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'rate',
                caption: l("EntityFieldName:MDMService:VAT:Rate") + " %",
                width: 200,
                dataType: 'number',
                validationRules: [{ type: "required" }]
            },
            //{
            //    dataField: 'inactive',
            //    caption: l("Active"),
            //    width: 90,
            //    alignment: 'center',
            //    cellTemplate(container, options) {
            //        $('<div>')
            //            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
            //            .appendTo(container);
            //    },
            //}
        ],
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        gridVATs.searchByText($(this).val());
    });

    $("#btnNewVAT").click(function (e) {
        gridVATs.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        vATService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/v-aTs/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'name', value: input.name },
                            { name: 'rateMin', value: input.rateMin },
                            { name: 'rateMax', value: input.rateMax }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });
});
