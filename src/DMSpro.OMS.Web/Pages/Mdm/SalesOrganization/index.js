$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMS");
    var salesOrgHeaderService = window.dMSpro.oMS.mdmService.controllers.salesOrgHeaders.salesOrgHeader;

    /****custom store*****/
    var salesOrgHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrgHeaderService.getListDevextremes(args)
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
            salesOrgHeaderService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    /****control*****/

    //DataGrid - Sales Org
    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: salesOrgHeaderStore,
        remoteOperations: true,
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
            storageKey: 'dgSalesOrganization',
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
        editing: {
            allowAdding: true,
            useIcons: true
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        var newtab = window.open('/Mdm/SalesOrganization/Details', '_blank');
                        newtab.sessionStorage.setItem("SalesOrg", null);
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        }
                    }
                },
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 80,
                buttons: [{
                    text: l1('Button.ViewDetail'),
                    icon: "fieldchooser",
                    onClick: function (e) {
                        var newtab = window.open('/Mdm/SalesOrganization/Details', '_blank');
                        newtab.sessionStorage.setItem("SalesOrg", JSON.stringify(e.row.data));
                    }
                }],
                fixedPosition: 'left'
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
                dataField: "code"
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Name'),
                dataField: "name"
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Active'),
                dataField: 'active'
            }
        ]
    }).dxDataGrid("instance");

    /****button*****/
    //$("#NewSalesOrgButton").click(function (e) {
    //    e.preventDefault();
    //    var newtab = window.open('/Mdm/SalesOrganization/Details', '_blank');
    //    newtab.sessionStorage.setItem("SalesOrg", null);
    //});

    function addNewSalesOrg() {
        debugger
        var newtab = window.open('/Mdm/SalesOrganization/Details', '_blank');
        newtab.sessionStorage.setItem("SalesOrg", null);
    }
    /****function*****/
    // function CheckState(state) {
    //     stateMode = state;
    //     switch (stateMode) {
    //         case 'home': {
    //             ResetControl();

    //             $("#NewSalesOrgButton").prop('disabled', false);
    //             $("#SaveButton, #CancelButton").prop('disabled', true);
    //             //$("#NewSalesOrgHierarchyButton,#NewSalesOrgEmpAssignmentButton").prop('disabled', false);
    //             break;
    //         }
    //         case 'add': {
    //             ResetControl();

    //             $("#NewSalesOrgButton").prop('disabled', true);
    //             $("#SaveButton, #CancelButton").prop('disabled', false);
    //             //$("#NewSalesOrgHierarchyButton,#NewSalesOrgEmpAssignmentButton").prop('disabled', true);
    //             break;
    //         }
    //         case 'edit': {
    //             salesOrgHeaderCode.getButton("btnSearch").option("visible", true);
    //             $("#NewSalesOrgButton, #SaveButton, #CancelButton").prop('disabled', false);
    //             break;
    //         }
    //         default:
    //             break;
    //     }
    // }

    // function UpdateButton() {
    //     if ($('#dataTreeContainer span[class="dx-treelist-nodata"]').length == 0) {
    //         $("#NewSalesOrgHierarchyButton").prop('disabled', true);
    //         $("#NewSalesOrgEmpAssignmentButton").prop('disabled', false);
    //     } else {
    //         $("#NewSalesOrgHierarchyButton").prop('disabled', false);
    //         $("#NewSalesOrgEmpAssignmentButton").prop('disabled', true);
    //     }

    //     if (salesOrgHeaderIdFilter == null) {
    //         $("#NewSalesOrgHierarchyButton").prop('disabled', true);
    //         $("#btnSalesOrgHeaderActive").prop('disabled', true);
    //     } else {
    //         $("#btnSalesOrgHeaderActive").prop('disabled', false);
    //     }
    // }

    // function ResetControl() {
    //     //clear data for Sales Org Hierarchy
    //     salesOrgHeaderIdFilter = null;
    //     dataTreeContainer.refresh();

    //     //clear data for Sales Org Employee Assignment
    //     salesOrgHierarchyIdFilter = null;
    //     dataGridContainer.refresh();

    //     //clear textbox value - Name
    //     salesOrgHeaderName.reset();

    //     salesOrgHeaderCode.reset();
    //     salesOrgHeaderCode.getButton("btnSearch").option("visible", true);
    //     salesOrgHeaderCode.option('isValid', true);
    //     salesOrgHeaderName.reset();

    //     //reset active button
    //     $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:True')).prop('disabled', true);
    // }
    initImportPopup('api/mdm-service/sales-org-headers', 'SalesOrgHeader_Template', 'dataGridContainer');
});