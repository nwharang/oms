let renderPopup = async (args) => {
    if (!popup) popup = $('<div id="popup">')
    popup.dxPopup({
        // Popup title : title + status
        title: `Customer Groups - #${store.cusStatus.find(e => e.id == args.status)?.text() || "New"}`,
        showTitle: true,
        height: '99%',
        width: "99%",
        hideOnOutsideClick: false,
        dragEnabled: false,

        contentTemplate: (e) => {
            let poupcontainer = $('<div class="w-100 h-100 d-flex flex-column">')
            let popupHeader = $('<div class="w-100 mb-2">')
            let popupBody = $('<div id="popupBody" class="position-relative d-flex flex-grow-1 gap-2"/>')
            popupHeader.appendTo(poupcontainer)
            popupBody.appendTo(poupcontainer)
            poupcontainer.appendTo(e)
            // Loading order
            renderForm(popupHeader, args)
            switch (args.groupBy) {
                case 0:
                    return renderCusGrAtt(args.id)
                case 1:
                    return renderCusGrList(args.id)
                case 2:
                    return renderCusGrGeo(args.id)
                default:
                    return
            }
        },
        toolbarItems: [
            // {
            //     widget: "dxDropDownButton",
            //     location: "after",
            //     toolbar: "bottom",
            //     options: {
            //         dropDownOptions: {
            //             width: 230,
            //         },
            //         icon: 'preferences',
            //         text: 'Actions',
            //         width: 120,
            //         elementAttr: {
            //             id: "actionButtonDetailsPanel",
            //         },
            //         items: [
            //             {
            //                 text: "Release",
            //                 icon: "check",
            //                 onClick: () => {
            //                     console.log('hello');
            //                 }
            //             },
            //             {
            //                 text: "Cancel",
            //                 icon: "close",
            //                 onClick: () => DevExpress.ui.dialog.confirm("<i> Do you wish to continue this action?</i>", "Rejecting Sale Request")
            //                     .done((e) => {
            //                         if (e) {
            //                             console.log('hello');
            //                         }
            //                         else {
            //                             console.log('nooooo');
            //                         }
            //                     })
            //             }
            //         ]
            //     },
            // },
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
