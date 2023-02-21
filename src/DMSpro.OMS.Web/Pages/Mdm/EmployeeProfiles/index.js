$(function () {
    var l = abp.localization.getResource("MdmService");
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;
    var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;

    /****custom store*****/
    var employeeProfileStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
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
        insert(values) {
            return employeeProfileService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return employeeProfileService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return employeeProfileService.delete(key);
        }
    });

    var workingPositionStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        load(loadOptions) {
            loadOptions.filter = ["active", "=", "true"];
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            workingPositionService.getListDevextremes(args)
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
            workingPositionService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var employeeTypeStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        load(loadOptions) {
            loadOptions.filter = [["code", "=", "MD03"]];
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            systemDataService.getListDevextremes(args)
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
            systemDataService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    /****control*****/
    //DataGrid - Employee Profile
    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: employeeProfileStore,
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
        columnMinWidth: 50,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        export: {
            enabled: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgEmployeeProfiles',
        },
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        editing: {
            mode: 'popup',
            allowAdding: abp.auth.isGranted('MdmService.EmployeeProfiles.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.EmployeeProfiles.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.EmployeeProfiles.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                title: l("Page.Title.EmployeeProfiles"),
                showTitle: false,
                width: 1000,
                height: 580
            },
            form: {
                items: [
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 1,
                        items: [
                            {
                                caption: "Avatar",
                                dataField: 'url',
                                template: function (data, itemElement) {
                                    $("<img>").attr({
                                        src: "https://i.pravatar.cc/128",
                                        style: "border-radius: 50%"
                                    }).appendTo(itemElement);
                                }
                            }
                        ]
                    },
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        items:
                            [
                                {
                                    caption: l("EntityFieldName:MDMService:EmployeeProfile:Code"),
                                    dataField: "code"
                                },
                                {
                                    caption: l("EntityFieldName:MDMService:EmployeeProfile:ERPCode"),
                                    dataField: "erpCode"
                                },
                                {
                                    caption: l("EntityFieldName:MDMService:EmployeeProfile:FirstName"),
                                    dataField: "firstName",
                                    validationRules: [{ type: "required" }]
                                },
                                {
                                    caption: l("EntityFieldName:MDMService:EmployeeProfile:LastName"),
                                    dataField: "lastName"
                                },
                                {
                                    caption: l("EntityFieldName:MDMService:EmployeeProfile:JobTittle"),
                                    dataField: "workingPositionId"
                                }
                            ]
                    },
                    {
                        itemType: 'group',
                        colCount: 2,
                        colSpan: 2,
                        caption: '',
                        items: [
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:DateOfBirth"),
                                dataField: "dateOfBirth"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:EmployeeTypeName"),
                                dataField: "employeeTypeId"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:IdCardNumber"),
                                dataField: "idCardNumber"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:Address"),
                                dataField: "address"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:Phone"),
                                dataField: "phone",
                                //validationRules: [
                                //    {
                                //        type: 'pattern',
                                //        message: 'Your phone must have "0912345678" format!',
                                //        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                //    }
                                //]
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:Email"),
                                dataField: "email",
                                validationRules: [
                                    {
                                        type: 'email',
                                    }
                                ]
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:EffectiveDate"),
                                dataField: "effectiveDate"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:EndDate"),
                                dataField: "endDate"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:EmployeeProfile:Active"),
                                dataField: "active",
                                width: 120,
                                alignment: 'center',
                                cellTemplate(container, options) {
                                    $('<div>').append($(options.value ? '<i class="fa fa-check"></i>' : '<i class= "fa fa-times"></i>')).appendTo(container);
                                }
                            }
                        ]
                    }
                ],
            }
        },
        onInitNewRow(e) {

        },
        onRowUpdating: function (e) {
            var objectRequire = ["code", "erpCode", "firstName", "lastName", "dateOfBirth", "idCardNumber", "email", "phone", "address", "active", "effectiveDate", "endDate", "workingPositionId", "employeeTypeId"];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        onEditorPreparing: function (e) {
            if (e.dataField == "workingPositionId" || e.dataField == "employeeTypeId") {
                e.editorOptions.showClearButton = true;
            }
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:ERPCode"),
                dataField: "erpCode",
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Code"),
                dataField: "code",
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:FirstName"),
                dataField: "firstName",
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:LastName"),
                dataField: "lastName",
                dataType: 'string'
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:DateOfBirth"),
                dataField: "dateOfBirth",
                dataType: 'date'
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:IdCardNumber"),
                dataField: "idCardNumber",
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Email"),
                dataField: "email",
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Phone"),
                dataField: "phone",
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Address"),
                dataField: "address",
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:JobTittle"),
                dataField: "workingPositionId",
                dataType: 'string',
                lookup: {
                    dataSource() {
                        return {
                            store: workingPositionStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:EmployeeTypeName"),
                dataField: "employeeTypeId",
                dataType: 'string',
                lookup: {
                    dataSource() {
                        return {
                            store: employeeTypeStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'valueName',
                    valueExpr: 'id',
                }
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: 'date',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:EndDate"),
                dataField: "endDate",
                dataType: 'date',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Active"),
                dataField: "active",
                dataType: 'boolean'
            }
        ]
    }).dxDataGrid("instance");

    /****button*****/
    //$("#NewEmployeeProfileButton").click(function () {
    //    dataGridContainer.addRow();
    //});

    /****function*****/

});