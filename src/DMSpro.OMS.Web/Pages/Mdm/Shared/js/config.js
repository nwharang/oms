
let genaralConfig = (name) => {
    return {
        selection: {
            allowSelectAll: true,
            selectAllMode: 'page',
            showCheckBoxesMode: 'always',
            mode: 'multiple'
        },
        export: {
            enabled: true,
            allowExportSelectedData: true,
        },
        onExporting: function (e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Companies');
            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${name || "Exports"}.xlsx`);
                });
            });
            e.cancel = true;
        },
    }
}
let genStore = (storeObj) => {

    storeObj = {
        someThing: {
            viewOnly: true,
            raw: false,
        }
    }
    for (const obj in storeObj) {
        let viewOnly = obj.viewOnly ? {} : {
            insert(values) {
                return companyService.create(values, { contentType: "application/json" });
            },
            update(key, values) {
                return companyService.update(key, values, { contentType: "application/json" });
            },
            remove(key) {
                return companyService.delete(key);
            }
        };
        obj = DevExpress.data.CustomStore({
            key: 'id',
            loadMode: obj.raw ? "raw" : "processed",
            load(loadOptions) {
                const deferred = $.Deferred();
                const args = {};

                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                key.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });

                return deferred.promise();
            },
            ...viewOnly,


        })
    }
    return {

    }
}

let genaralCol = (serviceName, storeObj, columnsObj) => {
    let l = abp.localization.getResource("OMS");
    return {
        store: genStore(storeObj),
        columns: [
            columnsObj.id && {
                caption: l("Id"),
                dataField: 'id',
                dataType: 'string',
                allowEditing: false,
                visible: columnsObj.id.defaultShow,
                formItem: {
                    visible: columnsObj.id.defaultShow
                },
            },
            columnsObj.code && {
                caption: l(`EntityFieldName:MDMService:${serviceName}:Code`),
                dataField: "code",
                validationRules: [
                    columnsObj.code.required && {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateingCodeField')
                    }
                ],
                visible: columnsObj.code.defaultShow
            },
            columnsObj.name && {
                dataField: 'name',
                caption: l(`EntityFieldName:MDMService:${serviceName}:Name`),
                dataType: 'string',
                validationRules: [
                    columnsObj.name.required && {
                        type: "required"
                    }
                ],
                visible: columnsObj.name.defaultShow
            },
            columnsObj.geoLevel0Id && {
                dataField: "geoLevel0Id",
                caption: l("GeoLevel0Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel0 || rowData.geoLevel0 === null) return "";
                    return rowData.geoLevel0.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: ['level', '=', 0],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel0Id = value;
                    rowData.geoLevel1Id = null;
                    rowData.geoLevel2Id = null;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
            },
            columnsObj.geoLevel1Id && {
                dataField: "geoLevel1Id",
                caption: l("GeoLevel1Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel1 || rowData.geoLevel1 === null) return "";
                    return rowData.geoLevel1.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 1], 'and', ['parentId', '=', options.data.geoLevel0Id]] : ['level', '=', 1],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel1Id = value;
                    rowData.geoLevel2Id = null;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
            },
            columnsObj.geoLevel2Id && {
                dataField: "geoLevel2Id",
                caption: l("GeoLevel2Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel2 || rowData.geoLevel2 === null) return "";
                    return rowData.geoLevel2.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 2], 'and', ['parentId', '=', options.data.geoLevel1Id]] : ['level', '=', 2],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel2Id = value;
                    rowData.geoLevel3Id = null;
                    rowData.geoLevel4Id = null;
                },
            },
            columnsObj.geoLevel3Id && {
                dataField: "geoLevel3Id",
                caption: l("GeoLevel3Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel3 || rowData.geoLevel3 === null) return "";
                    return rowData.geoLevel3.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 3], 'and', ['parentId', '=', options.data.geoLevel2Id]] : ['level', '=', 3],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel3Id = value;
                    rowData.geoLevel4Id = null;
                },
            },
            columnsObj.geoLevel4Id && {
                dataField: "geoLevel4Id",
                caption: l("GeoLevel4Name"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (!rowData.geoLevel4 || rowData.geoLevel4 === null) return "";
                    return rowData.geoLevel4.name;
                },
                width: 110,
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? [['level', '=', 4], 'and', ['parentId', '=', options.data.geoLevel3Id]] : ['level', '=', 4],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                setCellValue(rowData, value) {
                    rowData.geoLevel4Id = value;
                },
            },
        ]
    }
}


let a = {
    code: {
        defaultShow: true,
    },
    name: {
        defaultShow: true,
    }
}