let renderPopup = async () => {
    gridInfo.instance.popup = gridInfo.element.popup.dxPopup({
        title: l("Page.Title.MCPHeaders"),
        height: '95%',
        width: "95%",
        animation: null,
        hideOnOutsideClick: false,
        dragEnabled: false,
        contentTemplate: (e) => {
            renderForm()
            renderGrid()
            return $('<div class="w-100 h-100"/>').append($('<div class="w-100 h-100 px-2"/>').append(gridInfo.element.form).append(gridInfo.element.grid)).dxScrollView({
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: 'onScroll'
            })
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
                        gridInfo.instance.popup.hide()
                    }
                },
            },
        ],
        onHiding: () => {
            // Reload main content grid
            gridInfo.instance.mainGrid.refresh();
        },
    }).dxPopup('instance')
    gridInfo.instance.popup.show()
}
