$(function () {
    var l = abp.localization.getResource("MdmService");
    var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
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
        //keyExpr: "id",
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
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgVATs',
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
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
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
                "searchPanel",
            ],
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
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

    //$("input#Search").on("input", function () {
    //    gridVATs.searchByText($(this).val());
    //});

    //$("#btnNewVAT").click(function (e) {
    //    gridVATs.addRow();
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    vATService.getDownloadToken().then(
    //        function(result){
    //                var input = getFilter();
    //                var url =  abp.appPath + 'api/mdm-service/v-aTs/as-excel-file' +
    //                    abp.utils.buildQueryString([
    //                        { name: 'downloadToken', value: result.token },
    //                        { name: 'filterText', value: input.filterText },
    //                        { name: 'name', value: input.name },
    //                        { name: 'rateMin', value: input.rateMin },
    //                        { name: 'rateMax', value: input.rateMax }
    //                        ]);

    //                var downloadWindow = window.open(url, '_blank');
    //                downloadWindow.focus();
    //        }
    //    )
    //});
    initImportPopup('api/mdm-service/v-aTs', 'Vats_Template', 'dgVATs');
});
