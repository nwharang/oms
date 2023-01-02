$(function () {
    var l = abp.localization.getResource("MdmService");
    var numberingConfigService = window.dMSpro.oMS.mdmService.controllers.numberingConfigs.numberingConfig;
    var customStore = new DevExpress.data.CustomStore({
        key: 'ID',
        loadMode: "raw",
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

            numberingConfigService.getListDevextremes(args)
                .done(result => {
                    debugger
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            numberingConfigService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return numberingConfigService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return numberingConfigService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return numberingConfigService.delete(key);
        }
    });

    const data = [
        {
            ID: 1,
            TenantId: 1,
            CompanyId: "*",
            ObjectId: 'CUS',
            StartNumber: 1,
            Prefix: 'KH (=> KH001)',
            Suffix: '',
            Lenght: 5
        },
        {
            ID: 2,
            TenantId: 3,
            CompanyId: "OMS",
            ObjectId: 'EMP',
            StartNumber: 6,
            Prefix: 'EM (=> EM000006)',
            Suffix: '',
            Lenght: 8
        }
    ];

    var gridNumberingConfigs = $('#gridNumberingConfigs').dxDataGrid({
        dataSource: data,

        //remoteOperations: true,
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
            mode: 'standard',
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            visible: true,
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
        onInitNewRow(e) {
            e.data.CompanyId = '*';
        },
        editing: {
            mode: 'popup',
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            popup: {
                title: l("Page.Title.NumberingConfigs"),
                showTitle: true,
                width: 700,
                height: 350
            },
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'ID',
                caption: 'ID'
            }, {
                dataField: 'TenantID',
                caption: 'TenantID'
            },
            {
                dataField: 'CompanyId',
                caption: l("EntityFieldName:MDMService:NumberingConfig:CompanyId")
            }, {
                dataField: 'ObjectId',
                caption: l("EntityFieldName:MDMService:NumberingConfig:ObjectId")
            }, {
                dataField: 'StartNumber',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Numbnr")
            }, {
                dataField: 'Prefix',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Prefix")
            }, {
                dataField: 'Suffix',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Suffix")
            },
            {
                dataField: 'Lenght',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Length")
            }
        ],
        onEditingStart(e) {
            logEvent('EditingStart');
        },
        onRowInserting(e) {
            logEvent('RowInserting');
        },
        onRowInserted(e) {
            logEvent('RowInserted');
        },
        onRowUpdating(e) {
            logEvent('RowUpdating');
        },
        onRowUpdated(e) {
            logEvent('RowUpdated');
        },
        onRowRemoving(e) {
            logEvent('RowRemoving');
        },
        onRowRemoved(e) {
            logEvent('RowRemoved');
        },
        onSaving(e) {
            logEvent('Saving');
        },
        onSaved(e) {
            logEvent('Saved');
        },
        onEditCanceling(e) {
            logEvent('EditCanceling');
        },
        onEditCanceled(e) {
            logEvent('EditCanceled');
        },
    }).dxDataGrid("instance");

    function logEvent(eventName) {
        console.log(eventName);
    }

    $('#NewNumberingConfigButton').click(function () {
        gridNumberingConfigs.addRow();
    });
});
