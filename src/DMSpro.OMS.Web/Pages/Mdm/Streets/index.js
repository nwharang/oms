$(function () {
    // language texts
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var streetService = window.dMSpro.oMS.mdmService.controllers.streets.street;

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load() {
            var result = null;

            streetService.getList({ sorting: "name", maxResultCount: 1000 }, { async: false })
                .done(data => {
                    result = data.items;
                });

            return result;
        },
        byKey: function (key) {
            return key == 0 ? streetService.get(key) : null;
        },
        insert(values) {
            values.name = FormatStreetName(values.name);
            return streetService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            values.name = FormatStreetName(values.name);
            return streetService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return streetService.delete(key);
        }
    });

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: customStore,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnHidingEnabled: true,
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
            allowAdding: abp.auth.isGranted('MdmService.Streets.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.Streets.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.Streets.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
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
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete']
            },
            {
                caption: l("EntityFieldName:MDMService:Street:Name"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            }
        ]
    }).dxDataGrid("instance");

    $("#NewStreetButton").click(function () {
        dataGridContainer.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        streetService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/streets/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });

    function FormatStreetName(value) {
        var re = /(\b[a-z](?!\s))/g;
        return value.replace(re, function (x) { return x.toUpperCase(); });
    }
});