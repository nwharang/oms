$(function () {
    var l = abp.localization.getResource("MdmService");
    var weightMeasurementService = window.dMSpro.oMS.mdmService.controllers.weightMeasurements.weightMeasurement;
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

            weightMeasurementService.getListDevextremes(args)
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
            return key == 0 ? weightMeasurementService.get(key) : null;
        },
        insert(values) {
            return weightMeasurementService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return weightMeasurementService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return weightMeasurementService.delete(key);
        }
    });

    var dataWeightMeasurements = [
        {
            code: 'mg',
            name: 'Minigram',
            value: 1
        },
        {
            code: 'g',
            name: 'Gram',
            value: 1000
        },
        {
            code: 'kg',
            name: 'Kilogram',
            value: 1000000
        },
        {
            code: 'Oz',
            name: 'Ounce',
            value: 28300000
        }
    ]
    var gridWeightMeasurements = $('#dgWeightMeasurements').dxDataGrid({
        dataSource: dataWeightMeasurements,
        keyExpr: "code",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.DimensionMeasurements.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.DimensionMeasurements.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.DimensionMeasurements.Delete'),
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
            pageSize: pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
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
                caption: l("EntityFieldName:MDMService:WeightMeasurement:Code"),
                width: 280,
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:WeightMeasurement:Name"),
                width: 480,
                dataType: 'string',
            },
            {
                dataField: 'value',
                caption: l("Value (mg)"),
                width: 280,
                dataType: 'string',
            }
        ],
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        gridWeightMeasurements.searchByText($(this).val());
    });

    $("#NewWeightMeasurementButton").click(function (e) {
        gridWeightMeasurements.addRow();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        weightMeasurementService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/weight-measurements/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'name', value: input.name },
                            { name: 'valueMin', value: input.valueMin },
                            { name: 'valueMax', value: input.valueMax }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });    
});
