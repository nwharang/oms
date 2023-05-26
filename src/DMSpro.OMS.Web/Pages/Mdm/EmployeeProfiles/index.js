$(function () {
    let l = abp.localization.getResource("OMS"), gridInfo = {}

    let employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    let employeeImageService = window.dMSpro.oMS.mdmService.controllers.employeeImages.employeeImage;
    let workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;

    let employeeTypeStore = [
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

    let employeeProfileStore = new DevExpress.data.CustomStore({
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
        byKey: (key) => key ? new Promise((resolve, reject) => employeeProfileService.getEmployeeProfile(key)
            .done(data => resolve(data))
            .fail(err => reject(err))
        ) : null,
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

    let workingPositionStore = new DevExpress.data.CustomStore({
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

            let d = new $.Deferred();
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
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes,
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
                height: '95%',
                width: '95%',
                hideOnOutsideClick: false,
                dragEnabled: false,
                onHiding: (e) => {
                    gridInfo.editingRowId = null;
                    gridInfo.currentData = null;
                    gridInfo.imageContent = null;
                    gridInfo.generalContent = null;
                    gridInfo.form = null
                },
            },
            form: {
                labelMode: "static",
                elementAttr: {
                    id: 'formGridAddItemMaster',
                    class: "flex-grow-1 px-3"
                },
                items: [
                    {
                        itemType: 'group',
                        template: renderItemImage // Fix for future versions
                    },
                    {
                        itemType: 'group',
                        colSpan: 2,
                        items: ['code', 'erpCode', 'firstName', 'lastName', 'workingPositionId', 'employeeType']
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
        onSaved: (e) => {
            if (gridInfo.fileinput) gridInfo.fileinput(e);
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
                            class: "import-excel",
                        },
                        onClick(e) {
                            let gridControl = e.element.closest('div.dx-datagrid').parent();
                            let gridName = gridControl.attr('id');
                            let popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
                "searchPanel",
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: [
                    {
                        name: 'edit',
                        onClick: (e) => {
                            gridInfo.editingRowId = e.row.data.id;
                            dataGridContainer.editRow(e.row.rowIndex);
                        }
                    },
                    , 'delete'],
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
                allowEditing: false,
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:ERPCode"),
                dataField: "erpCode",
                dataType: 'string',
                visible: false
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:FirstName"),
                dataField: "firstName",
                dataType: 'string',
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: "stringLength",
                        max: 100,
                        message: l('WarnMessage.FieldLength').replace("{0}", 100)
                    }
                ]
            },
            {
                caption: l("EntityFieldName:MDMService:EmployeeProfile:LastName"),
                dataField: "lastName",
                dataType: 'string',
                validationRules: [
                    {
                        type: "stringLength",
                        max: 100,
                        message: l('WarnMessage.FieldLength').replace("{0}", 100)
                    }
                ]
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
                        type: "required"
                    },
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

    async function renderItemImage(e, itemElement) {
        let fileId = await employeeImageService.getListDevextremes({ filter: JSON.stringify([['employeeProfileId', '=', gridInfo.editingRowId], 'and', ['isAvatar', '=', true]]) }).then(({ data }) => data[0]?.fileId)
        editingRowId = gridInfo.editingRowId
        if (fileId) var imgURL = await employeeImageService.getFile(fileId, {
            dataType: 'binary',
            xhrFields: {
                'responseType': 'blob'
            },
        }).then((blob) => URL.createObjectURL(blob))
        itemElement.addClass('d-flex flex-column justify-content-center align-items-center').css('height', '300px');
        gridInfo.form = $('<div class="flex-column"/>').css({ 'height': '250px', 'display': 'flex' })
        let imgContainer = $('<div/>').css({ 'min-height': '250px', 'min-width': "250px" }).appendTo(itemElement);
        let img = $('<img class="w-100 h-100"/>').attr('src', imgURL || '/images/default-avatar-image.jpg').css({ 'object-fit': 'contain', 'object-position': 'center' }).appendTo(imgContainer)
        let fileinput = $('<input class="form-control mt-2" type="file" id="avatar" name="avatar" accept="image/*">').appendTo(gridInfo.form)
        fileinput.on('change', (e) => {
            if (fileinput.prop('files')[0].size > 1.5e7) return abp.message.error(l('ValidateError:UploadFileSize'), 500)
            img.attr('src', URL.createObjectURL(fileinput.prop('files')[0]))
            gridInfo.fileinput = (e) => {
                let file = fileinput.prop('files')[0]
                let form = new FormData();
                form.append('inputFile', file, file.name);
                let description = JSON.stringify({ name: file.name, size: file.size, type: file.type })
                employeeImageService[fileId ? 'updateAvatar' : 'createAvatar'](editingRowId || e.changes[0]?.data?.id, file, description, true,
                    {
                        contentType: false,
                        processData: false,
                        data: form,
                        async: true,
                    })
                gridInfo.fileinput = null
            }
        })
        gridInfo.form.appendTo(itemElement)
    }

    initImportPopup('api/mdm-service/employee-profiles', 'EmployeeProfiles_Template', 'dataGridContainer');
});