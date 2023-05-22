
let l = abp.localization.getResource("OMS");
let salesOrgHeaderService = window.dMSpro.oMS.mdmService.controllers.salesOrgHeaders.salesOrgHeader;
let salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
let salesOrgEmpAssignmentService = window.dMSpro.oMS.mdmService.controllers.salesOrgEmpAssignments.salesOrgEmpAssignment;
let employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
let popup, tree, grid, form, context, popupInstance, treeInstance, gridInstance, formInstance, contextMenu, dataGridContainer
let salesOrgHierarchyIdFilter = null, sendMode = 0, SalesOrgHeaderModel = null, salesOrgHeaderIdFilter = null, salesOrgHeaderId = null, zoneCount = 0, routeCount = 0
/** Create global notification */
let notify = (option) => {
    obj = { type: "success", position: "bottom left", message: "Message Placeholder", ...option };
    DevExpress.ui.notify({
        message: obj.message,
        height: 45,
        width: 250,
        minWidth: 250,
        type: obj.type,
        displayTime: 5000,
        animation: {
            show: {
                type: 'fade', duration: 400, from: 0, to: 1,
            },
            hide: { type: 'fade', duration: 40, to: 0 },
        },
    }, {
        position: obj.position,
    })
    return obj
}
/**  Create global promt panel */
let dialog = ({ header, body }, callBackIfTrue, callBackIfFalse) => {
    DevExpress.ui.dialog.confirm(`<i>${body}</i>`, header)
        .done((e) => {
            if (e) {
                callBackIfTrue()
            }
            else {
                callBackIfFalse()
            }
        })
}
/** Reload Popup Title, Tree dataSource, Grid Editting Setting */
let reloadPopupBodyComponent = (result) => {
    salesOrgHeaderId = result.id;
    if (result.status === 0)
        treeInstance.option('dataSource', store.salesOrgHierarchyStore(result.id))
    let newEditingOption = {
        ...grid.dxDataGrid('instance').option("editing"),
        allowAdding: result.status == 0 || result.status == 1,
        allowUpdating: result.status == 0 || result.status == 1,
        allowDeleting: result.status == 0 || result.status == 1,
    }
    popupInstance.option('title', `Sales Organization - #${store.docStatus.find(e => e.id === result.status)?.text || "New"}`)
    treeInstance.refresh()
    gridInstance.option("editing", newEditingOption)
    if (result.status > -1) {
        formInstance.getEditor('salesOrgHeaderName').option('readOnly', true)
        formInstance.getEditor('salesOrgHeaderCode').option('readOnly', true)
    }
}
/**  Create global store, can access any where */
let store = {
    menuItems: [
        {
            id: '1',
            text: () => l('SalesOrgHierarchies.Context.Edit'),
        },
        {
            id: '2',
            text: () => l('SalesOrgHierarchies.Context.AddSub'),
        },
        {
            id: '3',
            text: () => l('SalesOrgHierarchies.Context.AddRoute'),
        },
        {
            id: '4',
            text: () => l('SalesOrgHierarchies.Context.Delete'),
        }
    ],
    docStatus: [
        {
            id: 0,
            text: l('Open')
        },
        {
            id: 1,
            text: l('Released')
        },
        {
            id: 2,
            text: l('Inactive')
        },
    ],
    salesOrgHeaderStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrgHeaderService.getListDevextremes(args)
                .done(result => {
                    let zoneDictionary = result.summary[0]?.zoneDictionary
                    let routeDictionary = result.summary[0]?.routeDictionary
                    result.data = result.data.map((e) => {
                        return {
                            ...e,
                            zoneCount: zoneDictionary[e.id]?.length || 0,
                            routeCount: routeDictionary[e.id]?.length || 0
                        }
                    })
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            salesOrgHeaderService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    }),
    salesOrgHierarchyStore: (docId) => new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            if (!loadOptions.filter)
                loadOptions.filter = [["salesOrgHeaderId", "=", docId], "and", ["isDeleted", "=", false]]
            if (loadOptions.filter)
                loadOptions.filter = [...loadOptions.filter, 'and', ["salesOrgHeaderId", "=", docId], "and", ["isDeleted", "=", false]]
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            salesOrgHierarchyService.getListDevextremes(args)
                .done(result => {
                    result.data.forEach((item) => {
                        if (item.isRoute) routeCount += 1;
                        if (item.isSellingZone) zoneCount += 1;
                    })
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            salesOrgHierarchyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert({ name, parentId, salesOrgHeaderId, sendMode }) {
            switch (sendMode) {
                case 2: // Route
                    return salesOrgHierarchyService.createRoute({ name, parentId });
                case 1: // Sub
                    return salesOrgHierarchyService.createSub({ name, parentId });
                case 0: // Root
                    return salesOrgHierarchyService.createRoot({ name, salesOrgHeaderId });
                default:
                    break;
            }
        },
        update(key, values) {
            return salesOrgHierarchyService.update(key, values);
        },
        remove(key) {
            return salesOrgHierarchyService.delete(key);
        }
    }),
    salesOrgEmpAssignmentStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            salesOrgEmpAssignmentService.getListDevextremes({ filter: JSON.stringify((["salesOrgHierarchyId", "=", salesOrgHierarchyIdFilter])) })
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            salesOrgEmpAssignmentService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesOrgEmpAssignmentService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesOrgEmpAssignmentService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesOrgEmpAssignmentService.delete(key);
        }
    }),
    employeeProfileStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            employeeProfileService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            employeeProfileService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    }),
}    