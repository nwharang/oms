var l = abp.localization.getResource("OMS");

DevExpress.config({
    editorStylingMode: 'underlined',
});
var dxDataGridConfiguration = {
    remoteOperations: true,
    showColumnLines: true,
    showRowLines: false,
    rowAlternationEnabled: true,
    showBorders: false,
    export: {
        enabled: true,
    },
    onExporting: function (e) {
        if (e.format === 'xlsx') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');
            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Data.xlsx');
                });
            });
            e.cancel = true;
        }
        else if (e.format === 'pdf') {
            const doc = new jsPDF();
            DevExpress.pdfExporter.exportDataGrid({
                jsPDFDocument: doc,
                component: e.component,
            }).then(() => {
                doc.save('Deliveries.pdf');
            });
        }
    },
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: 'widget',
    columnMinWidth: 50,
    columnAutoWidth: true,
    columnChooser: {
        enabled: true,
        mode: "select"
    },
    columnFixing: {
        enabled: true,
    },
    filterRow: {
        visible: true,
    },
    groupPanel: {
        visible: true,
    },
    headerFilter: {
        visible: true,
    },
    searchPanel: {
        visible: true
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
            //"groupPanel",
            //"addRowButton",
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    disabled: true,
                    icon: "add",
                    elementAttr: {
                        class: "addNewButton",
                    },
                    onClick(e) {
                        var gridElement = e.element.closest('div.dx-datagrid.dx-gridbase-container').parent();
                        var dxGrid = gridElement.data('dxDataGrid');
                        if (dxGrid)
                            dxGrid.addRow();
                    },
                },
            },

            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    disabled: true,
                    icon: "checklist",
                    elementAttr: { 
                        class: "openItemsPopupButton",
                    },
                    onClick(e) {
                        var popup = $(`#popupItems`).data('dxPopup');
                        popup.show();
                    },
                },
            },

            "columnChooserButton",
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
                    },
                },
            },
            "searchPanel",
        ],
    }
};

function initChooseItemsPopup(items) {
    $('div.panel-container.show').append(`<div id="popupItems" style="display:none">
                <div id="dgItems" ></div> 
            </div>`);

    var dgItems = $('#dgItems').dxDataGrid({
        dataSource: items,
        remoteOperations: true,
        showColumnLines: true,
        showRowLines: false,
        // rowAlternationEnabled: true,
        showBorders: false,
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Items');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Items.xlsx');
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('Items.pdf');
                });
            }
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        groupPanel: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgItems',
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
            mode: 'cell',
            allowUpdating: false,
        },
        selection: {
            mode: 'multiple',
        },
        toolbar: {
            items: [
                {
                    location: 'before',
                    template() {
                        return $('<div>')
                            .addClass('informer')
                            .append(
                                $('<h4 id="numSelectedItems" style="margin:0">')
                                    .addClass('count')
                            );
                    },
                },
                //"groupPanel",
                "columnChooserButton",
                //"exportButton",
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
                        },
                    },
                },
                "searchPanel",
            ],
        },
        onCellClick: function (e) {
            if (e.columnIndex == 1) {
                e.event.preventDefault();
                e.event.stopPropagation();
                return false;
            }
        },
        columns: [
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
                dataField: 'qty',
                width: 100,
                dataType: 'number',
                cellTemplate(container, options) {
                    $('<div>')
                        .dxTextBox({
                            value: options.value,
                            onValueChanged: function (e) {
                                options.data.qty = e.value;
                            }
                        })
                        .appendTo(container);
                }
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Item:Code"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:Item:Name"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'inventory',
                caption: l("Inventory"),
                dataType: 'number',
                width: 100,
                allowEditing: false
            }
        ],
        onSelectionChanged: function (e) {
            var selectedRowsData = e.component.getSelectedRowsData();
            $('#numSelectedItems').text(l('Popup.Title.SelectedItems').replace('{0}', selectedRowsData.length));
        }
    }).dxDataGrid("instance");

    const popupItems = $('#popupItems').dxPopup({
        width: "100vh",
        height: 500,
        container: '.panel-container',
        showTitle: true,
        title: l('Popup.Title.ChooseItems'),
        visible: false,
        dragEnabled: true,
        hideOnOutsideClick: false,
        showCloseButton: true,
        resizeEnabled: true,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
        onShowing: function (e) {
            var heightGridContent = $('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').innerHeight() - 310;
            $('#dgItems div.dx-datagrid-rowsview').css('height', heightGridContent + 'px');
        },
        onResize: function (e) {
            var heightGridContent = $('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').innerHeight() - 310;
            $('#dgItems div.dx-datagrid-rowsview').css('height', heightGridContent + 'px');
        },
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                icon: 'fa fa-check hvr-icon',
                text: 'Submit',
                elementAttr: {
                    id: "submitItemsButton",
                    //disabled: true,
                },
                onClick() {
                    //todo
                    var selectedItems = dgItems.getSelectedRowsData();
                    if (selectedItems.length > 0) {
                        appendSelectedItems(selectedItems);
                        popupItems.hide();
                    }
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Cancel',
                onClick() {
                    popupItems.hide();
                },
            },
        }],
    }).dxPopup('instance');
}

$(function () {
    initImportPopup('api/mdm-service/items', 'Items_Template', 'dgItems');
});