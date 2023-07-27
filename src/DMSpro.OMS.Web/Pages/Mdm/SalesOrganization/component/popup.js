let renderPopup = async (headerData) => {
    if (!headerData) headerData = { status: -1 };
    if (!popup) popup = $('<div id="popup">')
    popup.dxPopup({
        // Popup title : title + status
        title: `Sales Organization - #${store.docStatus.find(e => e.id === headerData.status)?.text || "New"}`,
        showTitle: true,
        height: '99%',
        width: "99%",
        hideOnOutsideClick: false,
        dragEnabled: false,
        contentTemplate: (e) => {
            let poupcontainer = $('<div class="w-100 h-100 d-flex flex-column">')
            let popupHeader = $('<div class="w-100 mb-2">')
            let popupBody = $('<div class="position-relative d-flex flex-grow-1 gap-2 h-100 w-100">')
            popupHeader.appendTo(poupcontainer)
            popupBody.appendTo(poupcontainer)
            poupcontainer.appendTo(e)
            // Loading order
            renderForm(popupHeader, headerData)
            renderTree(popupBody, headerData)
            renderGrid(popupBody, headerData)
        },
        toolbarItems: [
            {
                widget: "dxButton",
                location: "after",
                toolbar: "bottom",
                options: {
                    text: "Exit",
                    icon: "return",
                    onClick: function () {
                        zoneCount = 0, routeCount = 0
                        popupInstance.hide()
                    }
                },
            },
        ],
        onContentReady: () => {
            salesOrgHierarchyIdFilter = null
        },
        onHiding: () => {
            // Reload main content grid
            dataGridContainer.getDataSource().reload()
        },
    })
    popup.appendTo('body')
    popupInstance = popup.dxPopup('instance')
    popupInstance.show()
}
