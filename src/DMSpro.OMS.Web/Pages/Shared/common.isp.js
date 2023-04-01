var l = abp.localization.getResource("OMS");

DevExpress.config({
    editorStylingMode: 'underlined',
});
var dxDataGridConfiguration = {
    //remoteOperations: true,
    showColumnLines: true,
    showRowLines: true,
    rowAlternationEnabled: true,
    showBorders: true,
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
    searchPanel: {
        visible: true
    },
    // paging: {
    //     enabled: true,
    //     pageSize: pageSize
    // },
    // pager: {
    //     visible: true,
    //     showPageSizeSelector: true,
    //     allowedPageSizes: allowedPageSizes,
    //     showInfo: true,
    //     showNavigationButtons: true
    // },
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
            "searchPanel",
        ],
    }
};

function initChooseItemsPopup(items) {
    $('div.panel-container.show').append(`<div id="popupItems" style="display:none">
                <div id="dgItems" ></div> 
            </div>`);

    var dgItems = $('#dgItems').dxDataGrid(jQuery.extend(dxDataGridConfiguration, {
        dataSource: items,
        stateStoring: {
            // enabled: true,
            type: 'localStorage',
            storageKey: 'dgItems',
        },
        editing: {
            mode: 'cell',
            allowUpdating: true,
        },
        headerFilter: {
            visible: false,
        },
        selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'always',
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
                "columnChooserButton",
                "searchPanel",
            ],
        },
        onCellClick: function (e) {
            e.event.preventDefault();
            e.event.stopPropagation();
        },
        // onSelectionChanged: function (e) {
        //     var selectedRowsData = e.component.getSelectedRowsData();
        // },
        columns: [
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
                dataField: 'qty',
                width: 100,
                cellTemplate(container, options) {
                    $('<div>')
                        .dxNumberBox({
                            value: options.value,
                            min: 0,
                            value: 1,
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
                dataField: 'isFree',
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
                dataType: 'boolean',
                width: 100,
            },
            {
                dataField: 'inventory',
                caption: l("Inventory"),
                dataType: 'number',
                width: 100,
                allowEditing: false
            }
        ],

    })).dxDataGrid("instance");

    const popupItems = $('#popupItems').dxPopup({
        width: "fit-content",
        height: 'fit-content',
        container: '.panel-container',
        showTitle: true,
        title: l('Popup.Title.ChooseItems'),
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: false,
        showCloseButton: true,
        resizeEnabled: false,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
        onShowing: function (e) {
            var heightGridContent = $('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').innerHeight() - 310;
            $('#dgItems div.dx-datagrid-rowsview').css('height', heightGridContent + 'px');
            dgItems.deselectAll()
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