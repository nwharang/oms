$(function () {
    var l = abp.localization.getResource("MdmService");
    var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
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
            return key == 0 ? workingPositionService.get(key) : null;
        },
        insert(values) {
            return workingPositionService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return workingPositionService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return workingPositionService.delete(key);
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
            mode: 'row',
            allowAdding: abp.auth.isGranted('MdmService.WorkingPositions.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.WorkingPositions.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.WorkingPositions.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onInitNewRow(e) {
            e.data.active = true;
        },
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name', 'description', 'active'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
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
                caption: l("EntityFieldName:MDMService:WorkingPosition:Code"),
                dataField: "code",
                dataType: 'string',
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Name"),
                dataField: "name",
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Description"),
                dataField: "description",
                dataType: 'string',
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Active"),
                dataField: "active",
                dataType: 'boolean'
            }
        ]
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        dataGridContainer.searchByText($(this).val());
    });

    $("#NewWorkingPositionButton").click(function () {
        dataGridContainer.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        workingPositionService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/working-positions/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});

//$(function () {
//    var l = abp.localization.getResource("MdmService");
//	var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;



//    var createModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "WorkingPositions/CreateModal",
//        scriptUrl: "/Pages/WorkingPositions/createModal.js",
//        modalClass: "workingPositionCreate"
//    });

//	var editModal = new abp.ModalManager({
//        viewUrl: abp.appPath + "WorkingPositions/EditModal",
//        scriptUrl: "/Pages/WorkingPositions/editModal.js",
//        modalClass: "workingPositionEdit"
//    });

//	var getFilter = function() {
//        return {
//            filterText: $("#FilterText").val(),
//            code: $("#CodeFilter").val(),
//			name: $("#NameFilter").val(),
//			description: $("#DescriptionFilter").val()
//        };
//    };

//    var dataTable = $("#WorkingPositionsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
//        processing: true,
//        serverSide: true,
//        paging: true,
//        searching: false,
//        scrollX: true,
//        autoWidth: true,
//        scrollCollapse: true,
//        order: [[1, "asc"]],
//        ajax: abp.libs.datatables.createAjax(workingPositionService.getList, getFilter),
//        columnDefs: [
//            {
//                rowAction: {
//                    items:
//                        [
//                            {
//                                text: l("Edit"),
//                                visible: abp.auth.isGranted('MdmService.WorkingPositions.Edit'),
//                                action: function (data) {
//                                    editModal.open({
//                                     id: data.record.id
//                                     });
//                                }
//                            },
//                            {
//                                text: l("Delete"),
//                                visible: abp.auth.isGranted('MdmService.WorkingPositions.Delete'),
//                                confirmMessage: function () {
//                                    return l("DeleteConfirmationMessage");
//                                },
//                                action: function (data) {
//                                    workingPositionService.delete(data.record.id)
//                                        .then(function () {
//                                            abp.notify.info(l("SuccessfullyDeleted"));
//                                            dataTable.ajax.reload();
//                                        });
//                                }
//                            }
//                        ]
//                }
//            },
//			{ data: "code" },
//			{ data: "name" },
//			{ data: "description" }
//        ]
//    }));

//    createModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    editModal.onResult(function () {
//        dataTable.ajax.reload();
//    });

//    $("#NewWorkingPositionButton").click(function (e) {
//        e.preventDefault();
//        createModal.open();
//    });

//	$("#SearchForm").submit(function (e) {
//        e.preventDefault();
//        dataTable.ajax.reload();
//    });

//    $("#ExportToExcelButton").click(function (e) {
//        e.preventDefault();

//        workingPositionService.getDownloadToken().then(
//            function(result){
//                    var input = getFilter();
//                    var url =  abp.appPath + 'api/mdm-service/working-positions/as-excel-file' +
//                        abp.utils.buildQueryString([
//                            { name: 'downloadToken', value: result.token },
//                            { name: 'filterText', value: input.filterText },
//                            { name: 'code', value: input.code },
//                            { name: 'name', value: input.name },
//                            { name: 'description', value: input.description }
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
