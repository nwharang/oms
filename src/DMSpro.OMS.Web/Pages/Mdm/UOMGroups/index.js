$(function () {
    // language text
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var uomGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
    var uomGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
    var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    // custom store
    var groupStore = new DevExpress.data.CustomStore({
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
            uomGroupService.getListDevextremes(args)
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
            uomGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return uomGroupService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return uomGroupService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return uomGroupService.delete(key);
        }
    });

    var detailStore = new DevExpress.data.CustomStore({
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
            uomGroupDetailService.getListDevextremes(args)
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
            uomGroupDetailService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return uomGroupDetailService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return uomGroupDetailService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return uomGroupDetailService.delete(key);
        }
    });

    // get UOMs lookup
    var uoms = [];
    var urlUOMsLookup = abp.appPath + 'api/mdm-service/u-oMGroup-details/u-oM-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlUOMsLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call geoList ajax: ', data);
            uoms = data.items;
        }
    });
    var getUOMs = function () {
        return uoms;
    }

    const dataGrid = $('#gridUOMGroups').dxDataGrid({
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
            mode: 'standard',
        },
        filterRow: {
            visible: true
        },
        searchPanel: {
            visible: true
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
            debugger
            if (e.data && e.data.id == 0) {
                e.data.id = null;
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
        columns: [
            {
                type: 'buttons',
                buttons: ['edit', 'delete'],
                caption: l("Actions")
            },
            {
                caption: l("EntityFieldName:MDMService:UOM:Code"),
                dataField: "code",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:UOM:Name"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            }
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentHeaderData = options.data;
                const dataGridDetail = $('<div>')
                    .dxDataGrid({
                        dataSource: {
                            store: detailStore,
                            filter: ['uomGroupId', '=', options.key]
                        },
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
                        scrolling: {
                            mode: 'standard'
                        },
                        paging:
                        {
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
                        editing:
                        {
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
                            e.data.uomGroupId = options.key
                        },
                        onRowUpdating: function (e) {
                            var objectRequire = ['uomGroupId', 'altQty', 'altUOMId', 'baseQty', 'baseUOMId', 'active'];
                            for (var property in e.oldData) {
                                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                                    e.newData[property] = e.oldData[property];
                                }
                            }
                        },
                        columns: [
                            {
                                type: 'buttons',
                                caption: l('Actions'),
                                buttons: ['edit', 'delete'],
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:AltQty"),
                                dataField: "altQty"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:AltUomCode"),
                                dataField: "altUOMId",
                                editorType: 'dxSelectBox',
                                lookup: {
                                    dataSource: getUOMs,
                                    valueExpr: 'id',
                                    displayExpr: 'displayName'
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:BaseQty"),
                                dataField: "baseQty"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:BaseUomCode"),
                                dataField: "baseUOMId",
                                editorType: 'dxSelectBox',
                                lookup: {
                                    dataSource: getUOMs,
                                    valueExpr: 'id',
                                    displayExpr: 'displayName'
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:Active"),
                                dataField: "active",
                                width: 110,
                                alignment: 'center',
                                dataType: 'boolean',
                                cellTemplate(container, options) {
                                    $('<div>')
                                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                        .appendTo(container);
                                }
                            }
                        ]
                    }).appendTo(container);
            }
        }
    }).dxDataGrid('instance');

    $("#NewUOMGroup").click(function () {
        dataGrid.addRow();
    });

    $("input#Search").on("input", function () {
        dataGrid.searchByText($(this).val());
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        uomGroupService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/u-oMGroups/as-excel-file' + abp.utils.buildQueryString([
                    { name: 'downloadToken', value: result.token }
                ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });
});
