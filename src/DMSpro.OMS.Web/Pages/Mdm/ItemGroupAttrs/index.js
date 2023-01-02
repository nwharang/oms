$(function () {
    var l = abp.localization.getResource("MdmService");
	var itemGroupAttrService = window.dMSpro.oMS.mdmService.controllers.itemGroupAttrs.itemGroupAttr;
	
        var lastNpIdId = '';
        var lastNpDisplayNameId = '';

        var _lookupModal = new abp.ModalManager({
            viewUrl: abp.appPath + "Shared/LookupModal",
            scriptUrl: "/Pages/Shared/lookupModal.js",
            modalClass: "navigationPropertyLookup"
        });

        $('.lookupCleanButton').on('click', '', function () {
            $(this).parent().find('input').val('');
        });

        _lookupModal.onClose(function () {
            var modal = $(_lookupModal.getModal());
            $('#' + lastNpIdId).val(modal.find('#CurrentLookupId').val());
            $('#' + lastNpDisplayNameId).val(modal.find('#CurrentLookupDisplayName').val());
        });
	
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "ItemGroupAttrs/CreateModal",
        scriptUrl: "/Pages/ItemGroupAttrs/createModal.js",
        modalClass: "itemGroupAttrCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "ItemGroupAttrs/EditModal",
        scriptUrl: "/Pages/ItemGroupAttrs/editModal.js",
        modalClass: "itemGroupAttrEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
			itemGroupId: $("#ItemGroupIdFilter").val(),			
            attr0: $("#Attr0Filter").val(),			
            attr1: $("#Attr1Filter").val(),			
            attr2: $("#Attr2Filter").val(),			
            attr3: $("#Attr3Filter").val(),			
            attr4: $("#Attr4Filter").val(),			
            attr5: $("#Attr5Filter").val(),			
            attr6: $("#Attr6Filter").val(),			
            attr7: $("#Attr7Filter").val(),			
            attr8: $("#Attr8Filter").val(),			
            attr9: $("#Attr9Filter").val(),			
            attr10: $("#Attr10Filter").val(),			
            attr11: $("#Attr11Filter").val(),			
            attr12: $("#Attr12Filter").val(),			
            attr13: $("#Attr13Filter").val(),			
            attr14: $("#Attr14Filter").val(),			
            attr15: $("#Attr15Filter").val(),			
            attr16: $("#Attr16Filter").val(),			
            attr17: $("#Attr17Filter").val(),			
            attr18: $("#Attr18Filter").val(),			
            attr19: $("#Attr19Filter").val()
        };
    };

    var dataTable = $("#ItemGroupAttrsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(itemGroupAttrService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.ItemGroupAttrs.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.itemGroupAttr.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.ItemGroupAttrs.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    itemGroupAttrService.delete(data.record.itemGroupAttr.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{
                data: "itemGroup.code",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue1.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue2.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue3.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue4.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue5.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue6.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue7.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue8.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue9.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue10.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue11.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue12.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue13.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue14.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue15.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue16.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue17.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue18.attrValName",
                defaultContent : ""
            },
            {
                data: "prodAttributeValue19.attrValName",
                defaultContent : ""
            }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewItemGroupAttrButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        itemGroupAttrService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/item-group-attrs/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'itemGroupId', value: input.itemGroupId }
, 
                            { name: 'attr0', value: input.attr0 }
, 
                            { name: 'attr1', value: input.attr1 }
, 
                            { name: 'attr2', value: input.attr2 }
, 
                            { name: 'attr3', value: input.attr3 }
, 
                            { name: 'attr4', value: input.attr4 }
, 
                            { name: 'attr5', value: input.attr5 }
, 
                            { name: 'attr6', value: input.attr6 }
, 
                            { name: 'attr7', value: input.attr7 }
, 
                            { name: 'attr8', value: input.attr8 }
, 
                            { name: 'attr9', value: input.attr9 }
, 
                            { name: 'attr10', value: input.attr10 }
, 
                            { name: 'attr11', value: input.attr11 }
, 
                            { name: 'attr12', value: input.attr12 }
, 
                            { name: 'attr13', value: input.attr13 }
, 
                            { name: 'attr14', value: input.attr14 }
, 
                            { name: 'attr15', value: input.attr15 }
, 
                            { name: 'attr16', value: input.attr16 }
, 
                            { name: 'attr17', value: input.attr17 }
, 
                            { name: 'attr18', value: input.attr18 }
, 
                            { name: 'attr19', value: input.attr19 }
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
