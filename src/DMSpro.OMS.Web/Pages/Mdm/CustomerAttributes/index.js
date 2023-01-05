$(function () {
    var l = abp.localization.getResource("MdmService");
    var customerAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
    var dataCusAttributes = [];
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

            customerAttributeService.getListDevextremes(args)
                .done(result => {
                    dataCusAttributes = result.data;
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            return key == 0 ? customerAttributeService.get(key) : null;
        },
        insert(values) {
            return customerAttributeService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerAttributeService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerAttributeService.delete(key);
        }
    });
	
    var gridCusAttribute = $('#dgCusAttributes').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: false,
            allowUpdating: abp.auth.isGranted('MdmService.GeoMasters.Edit'),
            allowDeleting: false,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing(e) {
            if (e.dataField == "customerAttributeTree") {
                var grid = e.component;
                var index = e.row.rowIndex;
                var value = grid.cellValue(index, "active");
                if (!value)
                    e.editorOptions.disabled = true;
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ["attrNo", "attrName", "active", "hierarchyLevel"];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
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
            pageSize: 10
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 90,
                buttons: ['edit'],
            },
            {
                dataField: 'attrNo',
                caption: l("EntityFieldName:MDMService:CustomerAttribute:Code"),
                allowEditing: false,
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'attrName',
                caption: l("EntityFieldName:MDMService:CustomerAttribute:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'hierarchyLevel ',
                caption: l("EntityFieldName:MDMService:CustomerAttribute:Level"),
                dataType: 'string',
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:CustomerAttribute:Active"),
                //allowEditing: false,
                width: 110,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
        ],
    }).dxDataGrid("instance");

    $("#btnNewCusAttribute").click(function (e) {
        if (dataCusAttributes.length < 20) {
            gridCusAttribute.addRow();
        }
    });

    $("input#Search").on("input", function () {
        gridCusAttribute.searchByText($(this).val());
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        customerAttributeService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/customer-attributes/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'attrNoMin', value: input.attrNoMin },
                            { name: 'attrNoMax', value: input.attrNoMax }, 
                            { name: 'attrName', value: input.attrName },
                            { name: 'hierarchyLevelMin', value: input.hierarchyLevelMin },
                            { name: 'hierarchyLevelMax', value: input.hierarchyLevelMax }, 
                            { name: 'active', value: input.active }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });
});
