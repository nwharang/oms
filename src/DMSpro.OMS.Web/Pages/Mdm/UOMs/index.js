$(function () {
    // language
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var uOMsService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;

    // custom store - for load, update, delete
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
            uOMsService.getListDevextremes(args)
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
            uOMsService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return uOMsService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return uOMsService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return uOMsService.delete(key);
        }
    });

    var gridUOMs = $('#gridUOMs').dxDataGrid({
        dataSource: customStore,
        keyExpr: 'id',
        remoteOperations: true,
        showBorders: true,
        autoExpandAll: true,
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
        //onRowInserting: function (e) {
        //    debugger
        //    if (e.data && e.data.code == null) {
        //        e.data.code = e.data.Code;
        //    }
        //},
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
        columns: [
            {
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:UOM:Code"),
                dataType: 'string'
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:UOM:Name"),
                dataType: 'string'
            }
        ]
    }).dxDataGrid('instance');

    $("#NewUomSButton").click(function () {
        gridUOMs.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        uOMsService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/u-oMs/as-excel-file' + abp.utils.buildQueryString([
                    { name: 'downloadToken', value: result.token }
                ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });
});
