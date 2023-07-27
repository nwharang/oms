let renderTabs = async () => {
    gridInfo.instance.tabs = gridInfo.element.tabs.dxTabPanel({
        items: [
            ...gridInfo.element.tabsElement.map(e => ({
                title: e.title,
                icon: e.icon || null,
                template: () => $('<div class="p-2"/>').append(e.callback())
            }))
        ]
    })
}