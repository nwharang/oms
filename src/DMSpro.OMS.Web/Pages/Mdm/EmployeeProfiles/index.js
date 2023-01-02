$(function () {
    var l = abp.localization.getResource("MdmService");
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;
    var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
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

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: customStore,
        remoteOperations: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        errorRowEnabled: false,
        filterRow: {
            visible: false
        },
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
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
                buttons: ['edit', 'delete']
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
                            store: workingPositionStore
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
                            store: employeeTypeStore
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

    $("#NewEmployeeProfileButton").click(function () {
        dataGridContainer.addRow();
    });

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});


//$(function () {
//    var l = abp.localization.getResource("MdmService");

//	var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;

//        var lastNpIdId = '';
//        var lastNpDisplayNameId = '';

//        var _lookupModal = new abp.ModalManager({
//            viewUrl: abp.appPath + "Shared/LookupModal",
//            scriptUrl: "/Pages/Shared/lookupModal.js",
//            modalClass: "navigationPropertyLookup"
//        });

//        $('.lookupCleanButton').on('click', '', function () {
//            $(this).parent().find('input').val('');
//        });

//        _lookupModal.onClose(function () {
//            var modal = $(_lookupModal.getModal());
//            $('#' + lastNpIdId).val(modal.find('#CurrentLookupId').val());
//            $('#' + lastNpDisplayNameId).val(modal.find('#CurrentLookupDisplayName').val());
//        });

//    var createModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "EmployeeProfiles/CreateModal",
//        scriptUrl: "/Pages/EmployeeProfiles/createModal.js",
//        modalClass: "employeeProfileCreate"
//    });

//	var editModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "EmployeeProfiles/EditModal",
//        scriptUrl: "/Pages/EmployeeProfiles/editModal.js",
//        modalClass: "employeeProfileEdit"
//    });

//	var getFilter = function() {
//        return {
//            filterText: $("#FilterText").val(),
//            code: $("#CodeFilter").val(),
//			erpCode: $("#ERPCodeFilter").val(),
//			firstName: $("#FirstNameFilter").val(),
//			lastName: $("#LastNameFilter").val(),
//			dateOfBirthMin: $("#DateOfBirthFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
//			dateOfBirthMax: $("#DateOfBirthFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
//			idCardNumber: $("#IdCardNumberFilter").val(),
//			email: $("#EmailFilter").val(),
//			phone: $("#PhoneFilter").val(),
//			address: $("#AddressFilter").val(),
//            active: (function () {
//                var value = $("#ActiveFilter").val();
//                if (value === undefined || value === null || value === '') {
//                    return '';
//                }
//                return value === 'true';
//            })(),
//			effectiveDateMin: $("#EffectiveDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
//			effectiveDateMax: $("#EffectiveDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
//			endDateMin: $("#EndDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
//			endDateMax: $("#EndDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
//			identityUserId: $("#IdentityUserIdFilter").val(),
//			workingPositionId: $("#WorkingPositionIdFilter").val(),			employeeTypeId: $("#EmployeeTypeIdFilter").val()
//        };
//    };

//    var dataTable = $("#EmployeeProfilesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
//        processing: true,
//        serverSide: true,
//        paging: true,
//        searching: false,
//        scrollX: true,
//        autoWidth: true,
//        scrollCollapse: true,
//        order: [[1, "asc"]],
//        ajax: abp.libs.datatables.createAjax(employeeProfileService.getList, getFilter),
//        columnDefs: [
//            {
//                rowAction: {
//                    items:
//                        [
//                            {
//                                text: l("Edit"),
//                                visible: abp.auth.isGranted('MdmService.EmployeeProfiles.Edit'),
//                                action: function (data) {
//                                    editModal.open({
//                                     id: data.record.employeeProfile.id
//                                     });
//                                }
//                            },
//                            {
//                                text: l("Delete"),
//                                visible: abp.auth.isGranted('MdmService.EmployeeProfiles.Delete'),
//                                confirmMessage: function () {
//                                    return l("DeleteConfirmationMessage");
//                                },
//                                action: function (data) {
//                                    employeeProfileService.delete(data.record.employeeProfile.id)
//                                        .then(function () {
//                                            abp.notify.info(l("SuccessfullyDeleted"));
//                                            dataTable.ajax.reload();
//                                        });
//                                }
//                            }
//                        ]
//                }
//            },
//			{ data: "employeeProfile.code" },
//			{ data: "employeeProfile.erpCode" },
//			{ data: "employeeProfile.firstName" },
//			{ data: "employeeProfile.lastName" },
//            {
//                data: "employeeProfile.dateOfBirth",
//                render: function (dateOfBirth) {
//                    if (!dateOfBirth) {
//                        return "";
//                    }

//					var date = Date.parse(dateOfBirth);
//                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
//                }
//            },
//			{ data: "employeeProfile.idCardNumber" },
//			{ data: "employeeProfile.email" },
//			{ data: "employeeProfile.phone" },
//			{ data: "employeeProfile.address" },
//            {
//                data: "employeeProfile.active",
//                render: function (active) {
//                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
//                }
//            },
//            {
//                data: "employeeProfile.effectiveDate",
//                render: function (effectiveDate) {
//                    if (!effectiveDate) {
//                        return "";
//                    }

//					var date = Date.parse(effectiveDate);
//                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
//                }
//            },
//            {
//                data: "employeeProfile.endDate",
//                render: function (endDate) {
//                    if (!endDate) {
//                        return "";
//                    }

//					var date = Date.parse(endDate);
//                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
//                }
//            },
//			{ data: "employeeProfile.identityUserId" },
//            {
//                data: "workingPosition.code",
//                defaultContent : ""
//            },
//            {
//                data: "systemData.valueCode",
//                defaultContent : ""
//            }
//        ]
//    }));

//    createModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    editModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    $("#NewEmployeeProfileButton").click(function (e) {
//        e.preventDefault();
//        createModal.open();
//    });

//	$("#SearchForm").submit(function (e) {
//        e.preventDefault();
//        dataTable.ajax.reload();
//    });

//    $("#ExportToExcelButton").click(function (e) {
//        e.preventDefault();

//        employeeProfileService.getDownloadToken().then(
//            function(result){
//                    var input = getFilter();
//                    var url =  abp.appPath + 'api/mdm-service/employee-profiles/as-excel-file' +
//                        abp.utils.buildQueryString([
//                            { name: 'downloadToken', value: result.token },
//                            { name: 'filterText', value: input.filterText },
//                            { name: 'code', value: input.code },
//                            { name: 'erpCode', value: input.erpCode },
//                            { name: 'firstName', value: input.firstName },
//                            { name: 'lastName', value: input.lastName },
//                            { name: 'dateOfBirthMin', value: input.dateOfBirthMin },
//                            { name: 'dateOfBirthMax', value: input.dateOfBirthMax },
//                            { name: 'idCardNumber', value: input.idCardNumber },
//                            { name: 'email', value: input.email },
//                            { name: 'phone', value: input.phone },
//                            { name: 'address', value: input.address },
//                            { name: 'active', value: input.active },
//                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
//                            { name: 'effectiveDateMax', value: input.effectiveDateMax },
//                            { name: 'endDateMin', value: input.endDateMin },
//                            { name: 'endDateMax', value: input.endDateMax },
//                            { name: 'identityUserId', value: input.identityUserId },
//                            { name: 'workingPositionId', value: input.workingPositionId }
//,
//                            { name: 'employeeTypeId', value: input.employeeTypeId }
//                            ]);

//                    var downloadWindow = window.open(url, '_blank');
//                    downloadWindow.focus();
//            }
//        )
//    });

//    $('#AdvancedFilterSectionToggler').on('click', function (e) {
//        $('#AdvancedFilterSection').toggle();
//    });

//    $('#AdvancedFilterSection').on('keypress', function (e) {
//        if (e.which === 13) {
//            dataTable.ajax.reload();
//        }
//    });

//    $('#AdvancedFilterSection select').change(function() {
//        dataTable.ajax.reload();
//    });
//});