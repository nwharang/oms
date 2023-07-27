let l = abp.localization.getResource("OMS");
let itemGroupAttributeService = window.dMSpro.oMS.mdmService.controllers.itemGroupAttributes.itemGroupAttribute;
let itemListService = window.dMSpro.oMS.mdmService.controllers.itemGroupLists.itemGroupList;
let itemAttributeService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
let itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
let itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
let uOMsService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
let itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;


let popup, popupInstance, grid, gridInstance, form, formInstance;
let dataGridContainer, itemAttr;
itemAttributeService.getListDevextremes({ filter: JSON.stringify(["active", "=", true]) }).done(({ data }) => itemAttr = data.sort((a, b) => a.attrNo - b.attrNo));

let store = {
    status: [
        {
            id: 0,
            text: () => l('EntityFieldValue:MDMService:ItemGroup:Status:OPEN')
        },
        {
            id: 1,
            text: () => l('EntityFieldValue:MDMService:ItemGroup:Status:RELEASED')
        },
        // {
        //     id: 2,
        //     text: ()=>l('EntityFieldValue:MDMService:ItemGroup:Status:CANCELLED')
        // }
    ],
    type: [
        {
            id: 0,
            text: () => l('EntityFieldValue:MDMService:ItemGroup:Type:ATTRIBUTE')
        },
        {
            id: 1,
            text: () => l('EntityFieldValue:MDMService:ItemGroup:Type:LIST')
        }
    ],
    groupStore: new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemGroupService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            itemGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return itemGroupService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemGroupService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemGroupService.delete(key);
        }
    }),
    getItemList: new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            itemService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    }),
    itemAttrValueStore: new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemAttrValueService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
    }),
    getDataSourceListGrid: (itemGroupId) => {
        return new DevExpress.data.CustomStore({
            key: "id",
            load(loadOptions) {
                if (loadOptions.filter == undefined)
                    loadOptions.filter = ['itemGroupId', '=', itemGroupId]
                const deferred = $.Deferred();
                const args = {};
                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                itemListService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount
                        });
                    });
                return deferred.promise();
            },
            byKey: function (key) {
                if (key == 0) return null;

                var d = new $.Deferred();
                itemListService.get(key)
                    .done(data => {
                        d.resolve(data);
                    })
                return d.promise();
            },
            insert(values) {
                return itemListService.create(values, { contentType: 'application/json' });
            },
            update(key, values) {
                return itemListService.update(key, values, { contentType: 'application/json' });
            },
            remove(key) {
                return itemListService.delete(key);
            }
        })
    },
    getDataSourceAttrGrid: (itemGroupId) => {
        return new DevExpress.data.CustomStore({
            key: "id",
            load(loadOptions) {
                if (loadOptions.filter == undefined)
                    loadOptions.filter = ['itemGroupId', '=', itemGroupId]
                const deferred = $.Deferred();
                const args = {};
                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                itemGroupAttributeService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount
                        });
                    });
                return deferred.promise();
            },
            byKey: function (key) {
                if (key == 0) return null;

                var d = new $.Deferred();
                itemGroupAttributeService.get(key)
                    .done(data => {
                        d.resolve(data);
                    })
                return d.promise();
            },
            insert(values) {
                return itemGroupAttributeService.create(values, { contentType: 'application/json' });
            },
            update(key, values) {
                return itemGroupAttributeService.update(key, values, { contentType: 'application/json' });
            },
            remove(key) {
                return itemGroupAttributeService.delete(key);
            }
        })
    },
}