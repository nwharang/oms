let renderPopup = async (args) => {
    if (!popup) popup = $('<div id="popup">')
    popup.dxPopup({
        // Popup title : title + status
        title: `${l('Page.Title.CustomerGroups')} - #${store.cusStatus.find(e => e.id == args.status)?.text() || "New"}`,
        showTitle: true,
        height: '99%',
        width: "99%",
        hideOnOutsideClick: false,
        dragEnabled: false,

        contentTemplate: (e) => {
            let poupcontainer = $('<div class="w-100 h-100 d-flex flex-column">').css('overflow', 'hidden')
            let popupHeader = $('<div class="w-100 mb-2">')
            let popupBody = $('<div id="popupBody" class="position-relative d-flex flex-grow-1 gap-2"/>').css('overflow-y', 'auto')
            popupHeader.appendTo(poupcontainer)
            popupBody.appendTo(poupcontainer)
            poupcontainer.appendTo(e)
            // Loading order
            renderForm(popupHeader, args)
            switch (args.groupBy) {
                case 0:
                    return renderCusGrAtt(args.id, args.status)
                case 1:
                    return renderCusGrList(args.id, args.status)
                case 2:
                    return renderCusGrGeo(args.id, args.status)
                default:
                    return
            }
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
                        popupInstance.hide()
                    }
                },
            },
        ],
        onHiding: () => {
            // Reload main content grid
            dataGridContainer.getDataSource().reload()
        },
    })
    popup.appendTo('body')
    popupInstance = popup.dxPopup('instance')
    popupInstance.show()
}
