$(function () {
    let l = abp.localization.getResource("OMS");
    let gridInfo = {};
    let customerAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;

    //Custom store - for load, update, delete
    let customStore = new DevExpress.data.CustomStore({
        key: 'id',
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

            //args["sort"] = [{"selector":"attrNo","desc": false}];

            customerAttributeService.getListDevextremes(args)
                .done(result => {
                    gridInfo = {
                        ...gridInfo,
                        length: result.data.filter(e => e.active).length,
                        lastLevel: result.data.filter(e => e.active).length, // Todo here .
                    }
                    deferred.resolve(result.data.sort((a, b) => a.attrNo - b.attrNo), {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            return key == 0 ? customerAttributeService.get(key) : null;
        },
        insert(values) {
            return customerAttributeService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerAttributeService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerAttributeService.delete(key);
        }
    });
    customStore.load().then(() => {
        let gridCusAttribute = $('#dgCusAttributes').css('max-width', '1000px').dxDataGrid({
            dataSource: {
                store: customStore,
                filter: ['active', '=', true]
            },
            showRowLines: true,
            showBorders: true,
            cacheEnabled: true,
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            allowColumnResizing: true,
            columnResizingMode: 'widget',
            columnAutoWidth: true,
            columnMinWidth: 50,
            columnFixing: {
                enabled: true,
            },
            editing: {
                mode: "row",
                allowAdding: abp.auth.isGranted('MdmService.CustomerAttributes.Create') && gridInfo.length < 20,
                allowUpdating: abp.auth.isGranted('MdmService.CustomerAttributes.Edit'),
                allowDeleting: abp.auth.isGranted('MdmService.CustomerAttributes.Delete'),
                useIcons: true,
                newRowPosition: 'last',
                texts: {
                    editRow: l("Edit"),
                    deleteRow: l("Delete"),
                    confirmDeleteMessage: l("DeleteConfirmationMessage")
                }
            },
            onRowUpdating: function (e) {
                e.newData = Object.assign({}, e.oldData, e.newData);
            },
            onRowInserting: (e) => {
                e.data.attrNo = gridInfo.lastLevel
                e.data.active = true
            },
            columns: [
                {
                    type: 'buttons',
                    alignment: 'left',
                    width: 70,
                    buttons: ["edit", {
                        name: 'delete',
                        visible: (e) => {
                            if (e.row.rowType === 'data' && abp.auth.isGranted('MdmService.CustomerAttributes.Delete'))
                                return e.row.data.attrNo === gridInfo.lastLevel - 1
                        }
                    }],
                    caption: l('Actions'),
                    fixedPosition: 'left',

                },
                {
                    dataField: 'attrName',
                    caption: l("CustomerAttribute.Name"),
                    dataType: 'string',
                    validationRules: [{ type: "required" }]
                },
            ],
        }).dxDataGrid("instance");
    });
})
