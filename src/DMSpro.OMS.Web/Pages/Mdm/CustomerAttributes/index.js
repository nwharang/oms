$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var customerAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;

    var dataCusAttributes = [];
    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            customerAttributeService.getListDevextremes(args)
                .done(result => {
                    //console.log('data res:', result.data)
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
            allowAdding: true,
            allowUpdating: abp.auth.isGranted('MdmService.CustomerAttributes.Edit'),
            allowDeleting: false,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing(e) {
            if (e.dataField == "hierarchyLevel") {
                var grid = e.component;
                var index = e.row.rowIndex;
                var value = grid.cellValue(index, "active");
                if (!value)
                    e.editorOptions.disabled = true;
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
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
            storageKey: 'dgCustomerAttributes',
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
        toolbar: {
            items: [
                "groupPanel",
                //{
                //    location: 'after',
                //    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                //    onClick() {
                //        gridCusAttribute.addRow();
                //    },
                //},
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
                type: 'buttons',
                caption: l("Actions"),
                width: 90,
                buttons: ['edit'],
                fixedPosition: 'left'
            },
            {
                dataField: 'attrNo',
                caption: l1("CustomerAttribute.Code"),
                allowEditing: false,
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'attrName',
                caption: l1("CustomerAttribute.Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'hierarchyLevel',
                caption: l1("CustomerAttribute.HierarchyLevel"),
                dataType: 'number',
            },
            {
                dataField: 'active',
                caption: l1("CustomerAttribute.Active"),
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

    //$("#btnNewCusAttribute").click(function (e) {
    //    if (dataCusAttributes.length < 20) {
    //        gridCusAttribute.addRow();
    //    }
    //});

    //$("input#Search").on("input", function () {
    //    gridCusAttribute.searchByText($(this).val());
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    customerAttributeService.getDownloadToken().then(
    //        function(result){
    //                var input = getFilter();
    //                var url =  abp.appPath + 'api/mdm-service/customer-attributes/as-excel-file' + 
    //                    abp.utils.buildQueryString([
    //                        { name: 'downloadToken', value: result.token },
    //                        { name: 'filterText', value: input.filterText },
    //                        { name: 'attrNoMin', value: input.attrNoMin },
    //                        { name: 'attrNoMax', value: input.attrNoMax }, 
    //                        { name: 'attrName', value: input.attrName },
    //                        { name: 'hierarchyLevelMin', value: input.hierarchyLevelMin },
    //                        { name: 'hierarchyLevelMax', value: input.hierarchyLevelMax }, 
    //                        { name: 'active', value: input.active }
    //                        ]);
                            
    //                var downloadWindow = window.open(url, '_blank');
    //                downloadWindow.focus();
    //        }
    //    )
    //});
});
