$(function () {
    var l = abp.localization.getResource("MdmService");
    var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            if (loadOptions.filter == undefined)
                loadOptions.filter = ["code", "=", "MD03"];
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            systemDataService.getListDevextremes(args)
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
            return key == 0 ? systemDataService.get(key) : null;
        },
        insert(values) {
            return systemDataService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return systemDataService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return systemDataService.delete(key);
        }
    });

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: customStore,
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
            e.data.code = 'MD03';
            e.data.name = 'Employee Type';
        },
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name', 'valueCode', 'valueName'];
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
                caption: l("EntityFieldName:MDMService:SystemData:Code"),
                dataField: "code",
                validationRules: [{ type: "required" }],
                visible: false,
                allowEditing: false
            },
            {
                caption: l("EntityFieldName:MDMService:SystemData:Name"),
                dataField: "name",
                validationRules: [{ type: "required" }],
                visible: false,
                allowEditing: false
            },
            {
                caption: l("EntityFieldName:MDMService:SystemData:ValueCode"),
                dataField: "valueCode",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:SystemData:ValueName"),
                dataField: "valueName",
                validationRules: [{ type: "required" }]
            }
        ]
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        //dataGridContainer.searchByText($(this).val());
        var searchStr = $(this).val();
        dataGridContainer.filter([['code', '=', 'MD03'], 'and', [['valueCode', 'contains', searchStr], 'or', ['valueName', 'contains', searchStr]]]);
    });

    $("#NewEmployeeTypeButton").click(function () {
        dataGridContainer.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        systemDataService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/system-datas/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token },
                        { name: 'code', value: "MD03" }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});