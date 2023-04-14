let renderPopup = async (args) => {
    preLoadData = store.priceListDetailStore(args.priceListId);
    if (!popup) popup = $('<div id="popup">')
    popup.dxPopup({
        // Popup title : title + status
        title: `${l("Page.Title.PriceUpdates")} - #${store.status.find(e => e.id == args.status)?.text() || "New"}`,
        showTitle: true,
        height: '99%',
        width: "99%",
        hideOnOutsideClick: false,
        dragEnabled: false,

        contentTemplate: (e) => {
            // Saparate pop up container 
            let poupcontainer = $('<div class="w-100 h-100 d-flex flex-column">')
            let popupHeader = $('<div class="w-100 mb-2">')
            let popupBody = $('<div id="popupBody" class="position-relative d-flex flex-grow-1 gap-2 h-100 w-100"/>')
            popupHeader.appendTo(poupcontainer)
            popupBody.appendTo(poupcontainer)
            poupcontainer.appendTo(e)
            // Render inside of popup header 
            renderForm(popupHeader, args)
            // Render inside of popup body 
            if (args.status >= 0)
                renderGrid(popupBody, args)
        },
        toolbarItems: [
            {
                // Exit Button
                widget: "dxButton",
                location: "after",
                toolbar: "bottom",
                options: {
                    text: "Exit",
                    icon: "return",
                    onClick: function () {
                        popupInstance.hide()
                    }
                },
            },

        ],
        onHiding: () => {
            // Reload main content grid
            mainGridInstance.getDataSource().reload()
        },
    })
    popup.appendTo('body')
    popupInstance = popup.dxPopup('instance')
    popupInstance.show()
}
