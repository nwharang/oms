$(function () {
    var l = abp.localization.getResource("MdmService");
    var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    /****custom store*****/
    var systemDataStore = new DevExpress.data.CustomStore({
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
            if (key == 0) return null;

            var d = new $.Deferred();
            systemDataService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
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

    /****control*****/
    //DataGrid - System Data
    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: systemDataStore,
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
            storageKey: 'dgEmployeeTypes',
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
            mode: "row",
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        dataGridContainer.addRow();
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                    onClick() {
                        //todo
                    },
                },
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
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

    /****event*****/
    //$("input#Search").on("input", function () {
    //    var searchStr = $(this).val();
    //    dataGridContainer.filter([['code', '=', 'MD03'], 'and', [['valueCode', 'contains', searchStr], 'or', ['valueName', 'contains', searchStr]]]);
    //});

    ///****button*****/
    //$("#NewEmployeeTypeButton").click(function () {
    //    dataGridContainer.addRow();
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    systemDataService.getDownloadToken().then(
    //        function (result) {
    //            var url = abp.appPath + 'api/mdm-service/system-datas/as-excel-file' +
    //                abp.utils.buildQueryString([
    //                    { name: 'downloadToken', value: result.token },
    //                    { name: 'code', value: "MD03" }
    //                ]);

    //            var downloadWindow = window.open(url, '_blank');
    //            downloadWindow.focus();
    //        }
    //    )
    //});

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});