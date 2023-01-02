$(function () {
    var l = abp.localization.getResource("MdmService");
	var itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;
	
	
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "ItemGroups/CreateModal",
        scriptUrl: "/Pages/ItemGroups/createModal.js",
        modalClass: "itemGroupCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "ItemGroups/EditModal",
        scriptUrl: "/Pages/ItemGroups/editModal.js",
        modalClass: "itemGroupEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            code: $("#CodeFilter").val(),
			name: $("#NameFilter").val(),
			description: $("#DescriptionFilter").val(),
			type: $("#TypeFilter").val(),
			status: $("#StatusFilter").val()
        };
    };

    var dataTable = $("#ItemGroupsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(itemGroupService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.ItemGroups.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.ItemGroups.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    itemGroupService.delete(data.record.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "code" },
			{ data: "name" },
			{ data: "description" },
            {
                data: "type",
                render: function (type) {
                    if (type === undefined ||
                        type === null) {
                        return "";
                    }

                    var localizationKey = "EntityFieldValue:MDMService:ItemGroup:Type:" + type;
                    var localized = l(localizationKey);

                    if (localized === localizationKey) {
                        abp.log.warn("No localization found for " + localizationKey);
                        return "";
                    }

                    return localized;
                }
            },
            {
                data: "status",
                render: function (status) {
                    if (status === undefined ||
                        status === null) {
                        return "";
                    }

                    var localizationKey = "EntityFieldValue:MDMService:ItemGroup:Status:" + status;
                    var localized = l(localizationKey);

                    if (localized === localizationKey) {
                        abp.log.warn("No localization found for " + localizationKey);
                        return "";
                    }

                    return localized;
                }
            }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewItemGroupButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        itemGroupService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/item-groups/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'name', value: input.name }, 
                            { name: 'description', value: input.description }, 
                            { name: 'type', value: input.type }, 
                            { name: 'status', value: input.status }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });

    $('#AdvancedFilterSectionToggler').on('click', function (e) {
        $('#AdvancedFilterSection').toggle();
    });

    $('#AdvancedFilterSection').on('keypress', function (e) {
        if (e.which === 13) {
            dataTable.ajax.reload();
        }
    });

    $('#AdvancedFilterSection select').change(function() {
        dataTable.ajax.reload();
    });
    
    
});
