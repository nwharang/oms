$(function () {
    var l = abp.localization.getResource("MdmService");
    var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    /****custom store*****/
    var workingPositionStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            workingPositionService.getListDevextremes(args)
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
            if (key == 0) return null;

            var d = new $.Deferred();
            workingPositionService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return workingPositionService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return workingPositionService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return workingPositionService.delete(key);
        }
    });

    /****control*****/
    //DataGrid - Working Position
    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: workingPositionStore,
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
        editing: {
            mode: 'row',
            allowAdding: abp.auth.isGranted('MdmService.WorkingPositions.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.WorkingPositions.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.WorkingPositions.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onInitNewRow(e) {
            e.data.active = true;
        },
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name', 'description', 'active'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete']
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Code"),
                dataField: "code",
                dataType: 'string',
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Name"),
                dataField: "name",
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Description"),
                dataField: "description",
                dataType: 'string',
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Active"),
                dataField: "active",
                dataType: 'boolean'
            }
        ]
    }).dxDataGrid("instance");

    /****event*****/
    $("input#Search").on("input", function () {
        dataGridContainer.searchByText($(this).val());
    });

    /****button*****/
    $("#NewWorkingPositionButton").click(function () {
        dataGridContainer.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        workingPositionService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/working-positions/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});