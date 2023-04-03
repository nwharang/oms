$(function () {
    var l = abp.localization.getResource("OMS");
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;
    var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
    var employeeProfileImageService = window.dMSpro.oMS.mdmService.controllers.employeeImages.employeeImage;

    var urlUploadFile = `${abp.appPath}api/mdm-service/employee-images/avatar`;
    var urlGetFile = `${abp.appPath}api/mdm-service/employee-images/get-file`;
    var files = [];
    var rowEditing = -1;

    /****custom store*****/
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
            const deferred = $.Deferred();
            employeeProfileService.create(values, { contentType: "application/json" }).done(result => {
                //uploadAvatar(result.data.id);
                deferred.resolve(result.data);
            });;

            return deferred.promise();
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
                    console.log(result);
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
        load(loadOptions) {
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
        initNewRow(e) {
            rowEditing = -1;
        },
        onEditingStart(e) {
            rowEditing = e.component.getRowIndexByKey(e.key);
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
                width: 'fit-content',
                height: 'fit-content'
            },
            form: {
                items: [
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 1,
                        items: [
                            {
                                dataField: 'Avatar',
                                template: function (data, itemElement) {
                                    renderAvatarField(data, itemElement);
                                }
                            }
                        ]
                    },
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        items:
                            ['code', 'erpCode', 'firstName', 'lastName', 'workingPositionId']
                    },
                    {
                        itemType: 'group',
                        colCount: 2,
                        colSpan: 2,
                        caption: '',
                        items: ['dateOfBirth', 'employeeTypeId', 'idCardNumber', 'address', 'phone', 'email', 'effectiveDate', 'endDate', 'active']
                    }
                ],
            }
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
                //calculateDisplayValue: "workingPosition.name",
                calculateDisplayValue(rowData){
                    //console.log(rowData.geoLevel2);
                    if(rowData.workingPosition){
                        return rowData.workingPosition.name;
                    }
                    return "";
                },
                dataType: 'string',
                lookup: {
                    dataSource() {
                        return {
                            store: workingPositionStore,
                            filer: ["active", "=", "true"],
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
                // calculateDisplayValue: "employeeType",
                calculateDisplayValue(rowData){
                    //console.log(rowData.geoLevel2);
                    if(rowData.employeeType){
                        return rowData.employeeType.valueName;
                    }
                    return "";
                },
                dataType: 'string',
                lookup: {
                    dataSource: {
                        store: employeeTypeStore,
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
                dataType: 'boolean',
                alignment: 'center',
                cellTemplate(container, options) {
                    $('<div>').append($(options.value ? '<i class="fa fa-check"></i>' : '<i class= "fa fa-times"></i>')).appendTo(container);
                }
            }
        ]
    }).dxDataGrid("instance");

    function uploadAvatar(employeeProfileId) {
        if (files.length === 0)
            return;

        var formData = new FormData();
        formData.append("file", files[0]);

        $.ajax({
            type: "POST",
            url: `${urlUploadFile}?EmployeeProfileId=${employeeProfileId}`,
            async: true,
            processData: false,
            mimeType: 'multipart/form-data',
            contentType: false,
            data: formData,
            success: function (data) {
                files = [];
            },
            error: function (msg) {
                console.log(msg.responseText.error);
            },
        });
    }

    function renderAvatarField(data, itemElement) {
        itemElement.append($("<img>").attr({
            id: "img-avatar",
            src: "/images/default-avatar-image.jpg",
            style: "border-radius: 50%",
        }));
        var selectedRowsData = dataGridContainer.getVisibleRows()[rowEditing];

        if (selectedRowsData) {
            getEmployeeImageAvatar(selectedRowsData.data.id).done(fileId => {
                if (fileId !== "") {
                    getFileAvatar(fileId, function (dataUrl) {
                        $("#img-avatar").attr("src", dataUrl);
                    });
                }
            });
        }

        itemElement.append($("<div>").attr("id", "file-uploader").dxFileUploader({
            selectButtonText: 'Select photo',
            labelText: '',
            accept: 'image/*',
            uploadMethod: 'POST',
            uploadMode: selectedRowsData ? 'instantly' : 'useButtons',
            onValueChanged(e) {
                files = e.value;
                $("#img-avatar").attr("src", URL.createObjectURL(files[0]));
            },
            uploadFile: function (file, progressCallback) {
                if (!selectedRowsData)
                    return;

                uploadAvatar(selectedRowsData.data.id);
            }
        }));
    }

    function getFileAvatar(fileId, callback) {
        toDataURL(`${urlGetFile}?id=${fileId}`, callback);
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    function getEmployeeImageAvatar(employeeProfileId) {
        var d = new $.Deferred();
        employeeProfileImageService.getList({ isAvatar: true, employeeProfileId: employeeProfileId }).done(result => {
            if (result.items.length > 0) {
                d.resolve(result.items[0].employeeImage.fileId);
            }
            d.resolve("");
        });

        return d.promise();
    }

    initImportPopup('api/mdm-service/employee-profiles', 'EmployeeProfiles_Template', 'dataGridContainer');
});