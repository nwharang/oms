$(function () {
    var l = abp.localization.getResource("MdmService");
    var itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;

    const status = [
        {
            id: 'OPEN',
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:OPEN')
        },
        {
            id: 'RELEASED',
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:RELEASED')
        },
        {
            id: 'CANCELLED',
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:CANCELLED')
        }
    ];

    const types = [
        {
            id: 'ATTRIBUTE',
            text: l('EntityFieldValue:MDMService:ItemGroup:Type:ATTRIBUTE')
        },
        {
            id: 'LIST',
            text: l('EntityFieldValue:MDMService:ItemGroup:Type:LIST')
        }
    ];

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    // custom store
    var groupStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemGroupService.getListDevextremes(args)
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
            itemGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return itemGroupService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemGroupService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemGroupService.delete(key);
        }
    });

    const dataGrid = $('#gridItemGroups').dxDataGrid({
        dataSource: groupStore,
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
        scrolling: {
            //mode: 'standard',
            columnRenderingMode: 'virtual'
        },
        filterRow: {
            visible: true,
            applyFilter: 'auto'
        },
        searchPanel: {
            visible: true,
            placeholder: 'Search...'
        },
        headerFilter: {
            visible: false,
        },
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        paging:
        {
            enabled: true,
            pageSize: 10,
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        groupPanel: {
            visible: true,
        },
        toolbar: {
            items: [
                {
                    location: 'before',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>New Purchase Request</span></button>',
                    onClick() {
                        //var w = window.open('/Mdm/ItemGroups/Details');
                        //w.sessionStorage.setItem('modelId', 0);
                        dataGrid.addRow();
                    }
                },
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: 'refresh',
                        onClick() {
                            dataGrid.refresh();
                        },
                    }
                },
                'columnChooserButton',
                'exportButton',
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-upload"></i> <span>Import from Excel</span> </button>',
                    onClick() {
                        //todo
                    },
                },
                'searchPanel'
            ]
        },
        export: {
            enabled: true
        },
        onExporting(e) {
            //e.preventDefault();

            itemGroupService.getDownloadToken().then(
                function (result) {
                    var url = abp.appPath + 'api/mdm-service/item-groups/as-excel-file' + abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
                }
            )
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
        onRowInserting: function (e) {
            e.data.status = 'OPEN';
            if (e.data && e.data.id == 0) {
                e.data.id = null;
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name', 'type', 'description', 'status'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        columns: [
            {
                width: 100,
                type: 'buttons',
                caption: l("Actions"),
                buttons: [
                    {
                        text: "View Details",
                        icon: "fieldchooser",
                        hint: "View Details",
                        onClick: function (e) {
                            var w = window.open('/Mdm/ItemGroups/Details', '_blank');
                            w.sessionStorage.setItem("itemGroup", JSON.stringify(e.row.data));
                        }
                    },
                    'edit', 'delete']
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Code"),
                dataField: "code",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Name"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Description"),
                dataField: "description"
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Type"),
                dataField: "type",
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: types,
                    displayExpr: 'text',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Status"),
                dataField: "status",
                allowEditing: false,
                lookup: {
                    dataSource: status,
                    displayExpr: 'text',
                    valueExpr: 'id'
                }
            },
            //{
            //    caption: l('EntityFieldName:MDMService:ItemAttachment:Active'),
            //    dataField: 'active',
            //    alignment: 'center',
            //    dataType: 'boolean',
            //    cellTemplate(container, options) {
            //        $('<div>')
            //            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
            //            .appendTo(container);
            //    }
            //}
        ]
    }).dxDataGrid('instance');

    //$("#NewItemGroup").click(function () {
    //    //dataGrid.addRow();
    //    var w = window.open('/Mdm/ItemGroups/Details');
    //    w.sessionStorage.setItem('modelId', 0);
    //});

    //$("input#Search").on("input", function () {
    //    dataGrid.searchByText($(this).val());
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    uomGroupService.getDownloadToken().then(
    //        function (result) {
    //            var url = abp.appPath + 'api/mdm-service/u-oMGroups/as-excel-file' + abp.utils.buildQueryString([
    //                { name: 'downloadToken', value: result.token }
    //            ]);

    //            var downloadWindow = window.open(url, '_blank');
    //            downloadWindow.focus();
    //        }
    //    )
    //});

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});
