$(function () {
    var l = abp.localization.getResource("OMS");
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;

    var employeeTypeStore = [
        {
            id: 0,
            displayName: l('EntityFieldValue:MDMService:EmployeeType:Salesman')
        },
        {
            id: 1,
            displayName: l('EntityFieldValue:MDMService:EmployeeType:Deliveryman')
        },
        {
            id: 2,
            displayName: l('EntityFieldValue:MDMService:EmployeeType:Supervisor')
        },
        {
            id: 3,
            displayName: l('EntityFieldValue:MDMService:EmployeeType:PromotionGirl')
        },
    ];

    var employeeProfileStore = new DevExpress.data.CustomStore({
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
        insert(values) {
            return employeeProfileService.create(values, { contentType: "application/json" })
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
        load(loadOptions) {
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

    let dataGridContainer = $('#dataGridContainer').dxDataGrid({
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
        dateSerializationFormat: "yyyy-MM-dd",
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
                height: 'fit-content',
                hideOnOutsideClick: false,
                dragEnabled: false,
            },
            form: {
                items: [
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 1,
                    },
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        items: ['erpCode', 'firstName', 'lastName', 'workingPositionId', 'employeeType']
                    },
                    {
                        itemType: 'group',
                        colCount: 2,
                        colSpan: 2,
                        caption: '',
                        items: ['dateOfBirth', 'idCardNumber', 'address', 'phone', 'email',
                            {
                                dataField: 'effectiveDate',
                                editorOptions: {
                                    format: 'dd/MM/yyyy',
                                }
                            },
                            {
                                dataField: 'endDate',
                                editorOptions: {
                                    format: 'dd/MM/yyyy',
                                },
                            }, 'active'
                        ]
                    }
                ],
            }
        },
        onInitNewRow(e) {
            e.data.active = true;
            e.data.effectiveDate = new Date()
        },
        onRowInserting: e => {
            if (!e.data.effectiveDate) e.data.effectiveDate = moment().format('yyyy-MM-DD')
        },
        onRowUpdating: (e) => {
            let { erpCode, firstName, lastName, dateOfBirth, idCardNumber, email, phone, address, active, effectiveDate, endDate, workingPositionId, employeeType } = Object.assign({}, e.oldData, e.newData);
            if (!email) email = null
            e.newData = { erpCode, firstName, lastName, dateOfBirth, idCardNumber, email, phone, address, active, effectiveDate, endDate, workingPositionId, employeeType }
        },
        onEditorPreparing: function (e) {
            if (e.dataField == "workingPositionId") {
                e.editorOptions.showClearButton = true;
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        }
                    }
                },
                "searchPanel",
            ],
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
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
                formItem: {
                    visible: false
                },
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:ERPCode"),
                dataField: "erpCode",
                dataType: 'string',
                visible: false,
                editorOptions: {
                    maxLength: 20,
                },
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ]
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Code"),
                dataField: "code",
                dataType: 'string',
                editorOptions: {
                    maxLength: 20,
                },
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ]
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
                dataType: 'date',
                editorOptions: {
                    max: new Date(),
                    format: 'dd/MM/yyyy'
                },
                format: 'dd/MM/yyyy'
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
                validationRules: [
                    {
                        type: 'email',
                    }
                ],
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Phone"),
                dataField: "phone",
                dataType: 'string',
                validationRules: [
                    {
                        type: 'pattern',
                        pattern: '^[0-9]{10}$',
                        message: l('ValidateError:Phone')
                    }
                ],
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Address"),
                dataField: "address",
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:EmployeeTypeName"),
                dataField: "employeeType",
                lookup: {
                    dataSource: employeeTypeStore,
                    valueExpr: 'id',
                    displayExpr: 'displayName',
                },
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:JobTittle"),
                dataField: "workingPositionId",
                allowSearch: false,
                calculateDisplayValue: (e) => e?.workingPosition?.name,
                dataType: 'string',
                lookup: {
                    dataSource(e) {
                        return {
                            store: workingPositionStore,
                            filter: ["active", "=", true],
                            paginate: true,
                            pageSize
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            },

            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: 'date',
                format: 'dd/MM/yyyy',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:EndDate"),
                dataField: "endDate",
                format: 'dd/MM/yyyy',
                dataType: 'date',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:Active"),
                dataField: "active",
                dataType: 'boolean',
                alignment: 'center',
            }
        ]
    }).dxDataGrid("instance");

    initImportPopup('api/mdm-service/employee-profiles', 'EmployeeProfiles_Template', 'dataGridContainer');
});