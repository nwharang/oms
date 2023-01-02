$(function () {
    var l = abp.localization.getResource("MdmService");
	var cusAttributesValueService = window.dMSpro.oMS.mdmService.controllers.cusAttributesValues.cusAttributesValue;

    var dataCusAttributesValues = [
        {
            id: 1,
            name: "FMCG",
            customerAttributeId: "001",
            cusAttributesValueTree: "string",
            active: true,
        },
        {
            id: 2,
            name: "FnB",
            customerAttributeId: "003",
            cusAttributesValueTree: "string",
            active: false,
        },
        {
            id: 3,
            name: "Food",
            customerAttributeId: "001",
            cusAttributesValueTree: "string",
            active: true,
        },
        {
            id: 4,
            name: "Beverage",
            customerAttributeId: "002",
            cusAttributesValueTree: "string",
            active: false,
        },
        {
            id: 5,
            name: "Candy",
            customerAttributeId: "002",
            cusAttributesValueTree: "string",
            active: false,
        }
    ];
    var dataCusAttributes = [
        {
            id: "000",
            code: "cat0",
            name: "Category",
            customerAttributeTree: "0",
            active: true,
        },
        {
            id: "001",
            code: "cat1",
            name: "Sub-Category",
            customerAttributeTree: "1",
            active: true,
        },
        {
            id: "002",
            code: "cat2",
            name: "Attribute2",
            customerAttributeTree: "2",
            active: true,
        },
        {
            id: "003",
            code: "cat3",
            name: "Attribute3",
            customerAttributeTree: "3",
            active: true,
        },
        {
            id: "004",
            code: "cat4",
            name: "Attribute4",
            customerAttributeTree: "4",
            active: true,
        },
        {
            id: "005",
            code: "cat5",
            name: "Attribute5",
            customerAttributeTree: "5",
            active: true,
        },
        {
            id: "006",
            code: "cat6",
            name: "Attribute6",
            customerAttributeTree: "6",
            active: true,
        },
        {
            id: "007",
            code: "cat7",
            name: "Attribute7",
            customerAttributeTree: "7",
            active: true,
        }
    ];

    var gridCusAttributesValues = $('#dgCusAttributesValues').dxDataGrid({
        dataSource: dataCusAttributesValues,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            //popup: {
            //    title: l("Page.Title.Currencies"),
            //    showTitle: true,
            //    width: 500,
            //    height: 300
            //},
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        showBorders: true,
        //filterRow: {
        //    visible: true
        //},
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        //headerFilter: {
        //    visible: true,
        //},
        paging:
        {
            pageSize: 10,
        },
        pager: {
            visible: true,
            allowedPageSizes: [10, 20, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CusAttributesValue:Name"),
                width: 380,
                dataType: 'string',
            },
            {
                dataField: 'customerAttributeId',
                caption: l("EntityFieldName:MDMService:CusAttributesValue:ParentName"),
                width: 380,
                lookup: {
                    dataSource: dataCusAttributes,
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:CusAttributesValue:Active"),
                width: 110,
                alignment: 'center',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
        ],
    }).dxDataGrid("instance");

    $("#NewCustomerAttachmentButton").click(function (e) {
        e.preventDefault();
        //createModal.open();
        gridCusAttributesValues.addRow();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        customerAttachmentService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/customer-attachments/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'url', value: input.url }, 
                            { name: 'description', value: input.description }, 
                            { name: 'active', value: input.active }, 
                            { name: 'customerId', value: input.customerId }
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
