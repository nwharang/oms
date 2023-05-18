let renderTree = (e, headerData) => {
    if (!tree) tree = $('<div id=dataTreeContainer>').css('flex-basis', '35%').css('height', '100%');
    if (!context) context = $('<div id=contextMenu>')
    context.dxContextMenu({
        dataSource: store.menuItems,
        target: '#dataTreeContainer .dx-row.dx-data-row',
        onItemClick: function (e) {
            let rowKey = treeInstance.option("focusedRowKey");
            let rowIndex = treeInstance.option("focusedRowIndex");
            switch (e.itemData.id) {
                case '1': {
                    treeInstance.editRow(rowIndex);
                    break;
                }
                case '2': {
                    sendMode = 1;
                    treeInstance.addRow(rowKey);
                    break;
                }
                case '3': {
                    sendMode = 2;
                    treeInstance.addRow(rowKey);
                    break;
                }
                case '4': {
                    treeInstance.deleteRow(rowIndex);
                    break;
                }
                default:
                    break;
            }
        },
    })
    context.appendTo(e)
    contextMenu = context.dxContextMenu('instance')
    tree.dxTreeList({
        dataSource: headerData.id ? store.salesOrgHierarchyStore(headerData.id) : [],
        keyExpr: 'id',
        parentIdExpr: "parentId",
        remoteOperations: true,
        autoExpandAll: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: false,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        showColumnHeaders: false,
        showRowLines: false,
        showBorders: true,
        errorRowEnabled: false,
        focusedRowIndex: 0,
        filterRow: {
            visible: false
        },
        searchPanel: {
            visible: false
        },
        scrolling: {
            mode: 'standard'
        },
        editing: {
            mode: 'row',
            allowAdding: headerData.status != 2,
            allowUpdating: headerData.status != 2,
            allowDeleting: headerData.status != 2,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onContentReady: (e) => {
            $('#routeCount').text(routeCount);
            $('#zoneCount').text(zoneCount);
        },
        onRowInserting: (e) => {
            // for create first data - if parentId = 0, update parentId = null
            if (e.data && e.data.parentId == 0) {
                e.data.parentId = null;
            }
            e.data.salesOrgHeaderId = headerData.id || salesOrgHeaderId;
            e.data.sendMode = sendMode;
        },
        onRowUpdating: (e) => {
            var objectRequire = ['salesOrgHeaderId', 'parentId', 'name'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
            e.newData['salesOrgHeaderId'] = headerData.id;
        },
        onFocusedRowChanged: (e) => {
            salesOrgHierarchyIdFilter = treeInstance.option("focusedRowKey");
            gridInstance.refresh();
        },
        onSaved(e) {
            e.component.option({ focusedRowKey: null });
        },
        onContextMenuPreparing: (e) => {
            if (!e.row) return
            let isRoute = e.row.data.isRoute;
            let isSellingZone = e.row.data.isSellingZone;
            let isHadChild = e.row.node.hasChildren
            let status = headerData.status;
            if (status == 0) {
                // Open
                if (!isRoute && !isSellingZone && !isHadChild) {
                    contextMenu.option('items[0].visible', true);
                    contextMenu.option('items[1].visible', true);
                    contextMenu.option('items[2].visible', true);
                    contextMenu.option('items[3].visible', true);
                }
                else if (!isRoute && !isSellingZone) {
                    contextMenu.option('items[0].visible', true);
                    contextMenu.option('items[1].visible', true);
                    contextMenu.option('items[2].visible', false);
                    contextMenu.option('items[3].visible', true);
                }
                if (isRoute) {
                    contextMenu.option('items[0].visible', true);
                    contextMenu.option('items[1].visible', false);
                    contextMenu.option('items[2].visible', false);
                    contextMenu.option('items[3].visible', true);
                }
                if (isSellingZone) {
                    contextMenu.option('items[0].visible', true);
                    contextMenu.option('items[1].visible', false);
                    contextMenu.option('items[2].visible', true);
                    contextMenu.option('items[3].visible', false);
                }
            }

            if (status > 0) {
                e.items = []
            }
        },
        toolbar: {
            items: [
                {
                    location: 'before',
                    template() {
                        return $('<div class="dx-fieldset-header">').append('Organization Tree');
                    },
                },
                {
                    location: 'center',
                    template() {
                        return $("<div class='d-flex gap-2'><div class='isRoute' id='routeCount'></div><div class='isSellingZone' id='zoneCount'></div></div>")
                    },
                },
                {
                    widget: 'dxButton',
                    options: {
                        text: 'New Root',
                        elementAttr: {
                            id: 'NewRootButton'
                        },
                        disabled: headerData.status != 0,
                        onClick: function (e) {
                            sendMode = 0
                            treeInstance.addRow();
                        }
                    },
                    location: 'after',
                    visible: true, // Boolean
                },
            ]
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['add', 'edit', 'delete'],
                visible: false
            },
            {
                caption: 'Name',
                dataField: "name",
                cellTemplate: function (element, info) {

                    if (info.data.isRoute) {
                        element.append("<div class='isRoute'><span class='px-1'>" + info.data.code + " - " + info.data.name + "</span></div>");
                    } else if (info.data.isSellingZone) {
                        element.append("<div class='isSellingZone'><span class='px-1'>" + info.data.code + " - " + info.data.name + "</span></div>");
                    } else {
                        element.append("<div>" + info.data.code + " - " + info.data.name + "</div>");
                    }
                },
                validationRules: [{ type: "required" }]
            }
        ]
    })
    tree.appendTo(e)
    treeInstance = tree.dxTreeList('instance')
}
