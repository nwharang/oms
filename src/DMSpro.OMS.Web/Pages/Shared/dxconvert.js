
// language
var l = abp.localization.getResource("MdmService"); 

// global variable
var rowKeys = [];

//Loading panel
const loadPanel = $('#loadPanel').dxLoadPanel({
    shadingColor: "rgba(0, 0, 0, 0.2)",
    visible: false
}).dxLoadPanel('instance');

// get rowkeys
//$.ajax({
//    url: `${url}?LevelMax=0`,
//    dataType: 'json',
//    async: false,
//    success: function (data) {
//        data.items.forEach(val => {
//            rowKeys.push(val.id);
//        });
//    }
//})
abp.libs.datatables.createAjax = function (getList, getFilter) {
    return { get: getList, filter: getFilter };
}

function digits(num, min, max) {
    var min = min || 0;
    var max = max || 9;
    var temp = '';
    for (var i = 0; i < num; i++) {
        temp += Math.floor((min + Math.random() * (max - min)));
    }
    return temp;
}

function randomYear(start, end) {
    var start = start || 2000;
    var end = end || new Date().getFullYear();
    return Math.floor((start + Math.random() * (end - start)));
}

function randomDate(startYear, endYear) {
    var separator = "/";
    return digits(1, 1, 12) + separator + digits(1, 1, 28) + separator + randomYear(startYear, endYear);
}

function randomTime(militaryTime) {
    //var am_pm = ["am", "pm"];
    var hours = digits(1, 0, 2) + "" + digits(1, 0, 5);
    var minutes = digits(1, 0, 5) + "" + digits(1, 0, 9);
    var separator = ":";
    return hours + separator + minutes;
}

//var names = [];
//function getNames() {
//  $.getJSON("/data/names.json", function(tempNames) {
//    names = tempNames;
//  }).fail(function() {
//    console.log("Error retrieving names.json");
//  });
//}

//Generate names
function randomName() {
    var names = ["Calvin", "Glover", "Roosevelt", "Miles", "Luis", "Tucker", "Deanna", "Lopez", "Eloise", "Wilkins", "Lela", "Smith", "Darin", "Copeland", "Yvonne", "Simon", "Lucille", "Parker", "Guadalupe", "Bishop"];
    var length = names.length;
    return names[digits(1, 0, length)];
}

function randomStreet() {
    var streetType = ["Dr", "Blvd", "Pl", "St", "Cir"];
    var length = streetType.length;
    return randomName() + " " + streetType[digits(1, 0, length)];
}

function randomCity() {
    var cityType = ["ville", "town", "burg"];
    var length = cityType.length;
    return randomName() + cityType[digits(1, 0, cityType.length)];
}

function randomState() {
    var states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI"];
    var length = states.length;
    return states[digits(1, 0, length)];
}

// Generate addresses in the format:
// digits Name Dr/Blvd/Pl
// Name+ville/town/burg State digits(5)
function randomAddress() {
    return digits(1, 10, 9999) + " " + randomStreet() + ", " + randomCity() + " " + randomState() + " " + digits(1, 10000, 99999);
}

//Generate phone numbers
// (nnn) nnn-nnnn
function randomPhone() {
    return "(" + digits(1, 200, 999) + ") " + digits(1, 100, 999) + "-" + digits(1, 1000, 9999);
}

function buildJSONData() {
    var obj = {};
    obj.fname = randomName();
    obj.lname = randomName();
    obj.date = randomDate();
    obj.time = randomTime();
    obj.phone = randomPhone();
    obj.address = randomAddress();
    return obj;
}

 
$.fn.DataTable = function (opts) {
	//return $(this).dataTable(opts).api();
    //var url = abp.appPath + "api/mdm-service/u-oMs";//
    //var urlToken = abp.appPath + 'api/mdm-service/u-oMs/download-token';
    //var urlExport = abp.appPath + 'api/mdm-service/u-oMs/as-excel-file';

    //var store = new DevExpress.data.CustomStore({
    //    key: "ID",
    //    load() {
    //        //get data
    //        var result = null;
    //        var sorting = "name";
    //        var maxResult = 1000;
    //        $.ajax({
    //            url: `${url}?Sorting=${sorting}&MaxResultCount=${maxResult}`,
    //            dataType: 'json',
    //            async: false,
    //            beforeSend: function () {
    //                loadPanel.show();
    //            },
    //            complete: function () {
    //                loadPanel.hide();
    //            },
    //            success: function (data) {
    //                // set resource
    //                result = data.items;
    //            },
    //            error: function (xhr) {
    //                abp.message.error(xhr.responseJSON ? xhr.responseJSON.error.message : xhr.statusText, 'Oops');
    //            }
    //        })
    //        return result;
    //    },
    //    byKey: function (key) {
    //        if (key == 0) {
    //            return;
    //        }
    //        return sendRequest(`${url}/${key}`, 'GET', "text/html; charset=utf-8");
    //    },
    //    insert(values) {
    //        return sendRequest(url, 'POST', "application/json", JSON.stringify(values));
    //    },
    //    update(key, values) {
    //        return sendRequest(`${url}/${key}`, 'PUT', "application/json", JSON.stringify(values));
    //    },
    //    remove(key) {
    //        return sendRequest(`${url}/${key}`, 'DELETE', "text/html; charset=utf-8");
    //    }
    //});
    //opts.ajax.filter()
    var res = opts.ajax.get({}).then(r => {
        var data = r.items;
        var columns = [{
            type: 'buttons',
            caption: l('Actions'),
            buttons: ['edit', 'delete'],
        }];
        if (data.length == 0) {
            for (var i = 0; i < 10; i++) {
                var row = {};
                for (var j = 0; j < opts.columnDefs.length; j++) { 
                    var name = opts.columnDefs[j].data;
                    if (!name) continue; 
                    if (name.toLowerCase().indexOf('year') >= 0)
                        row[name] = randomYear(); 
                    else if (name.toLowerCase().indexOf('date') >= 0)
                        row[name] = randomDate();
                    else if (name.toLowerCase().indexOf('phone') >= 0)
                        row[name] = randomPhone();
                    else if (j%10 == 1)
                        row[name] = randomName();
                    else if (j % 10 == 2)
                        row[name] = randomAddress();
                    else if (j % 10 == 3)
                        row[name] = randomCity();
                    else if (j % 10 == 4)
                        row[name] = randomPhone();
                    else if (j % 10 == 5)
                        row[name] = randomStreet();
                    else if (j % 10 == 6)
                        row[name] = randomYear();
                    else if (j % 10 == 7)
                        row[name] = randomDate();
                }
                data.push(row);
            }
            console.log(data);
        }
        for (var c of opts.columnDefs) {
            if (!c.rowAction) {
                columns.push({
                    dataField: c.data,
                    // caption: l("EntityFieldName:MDMService:UOM:Name"),
                    // dataType: 'string',
                    // validationRules: [{ type: "required" }] 
                });
            }
        }
        $(this).dxDataGrid({
            dataSource: data,
            //keyExpr: "ID",
            showBorders: true,
            filterRow: {
                visible: true
            },
            searchPanel: {
                visible: true
            },
            scrolling: {
                mode: 'standard'
            },
            allowColumnReordering: false,
            rowAlternationEnabled: true,
            headerFilter: {
                visible: true,
            },
            paging:
            {
                pageSize: pageSize,
            },
            editing: {
                mode: "row",
                //allowAdding: abp.auth.isGranted('MdmService.u-oMs.Create'),
                //allowUpdating: abp.auth.isGranted('MdmService.u-oMs.Edit'),
                //allowDeleting: abp.auth.isGranted('MdmService.u-oMs.Delete'),
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                    deleteRow: l("Delete"),
                    confirmDeleteMessage: l("DeleteConfirmationMessage")
                }
            },
            pager: {
                visible: true,
                allowedPageSizes: [10, 20, 'all'],
                showPageSizeSelector: true,
                showInfo: true,
                showNavigationButtons: true,
            },
            columns
        }).dxDataGrid("instance");
    });
    
};
if ($('#AdvancedFilterSection').length > 0) {
    $('#AdvancedFilterSection').prev().remove();
    $('#AdvancedFilterSection').remove();

    $('#js-page-content').prepend('<ol class="breadcrumb page-breadcrumb">' +
        '<li class="breadcrumb-item"><a href="javascript:void(0);">MDM</a></li>' +
        //'<li class="breadcrumb-item">System</li>' +
        '<li class="breadcrumb-item active">' + $('title').text().replace(' | OMS','') + '</li>' +
        '</ol>');

    $('.card-body').prepend('<div class="panel-hdr" role="heading">' +
        '<h2 class="ui-sortable-handle">' +
        '<i class="subheader-icon fal fa-credit-card-front"></i>' + $('title').text().replace(' | OMS', '') +
        '</h2>' +
        '<div class="panel-saving mr-2" style="display:none"><i class="fal fa-spinner-third fa-spin-4x fs-xl"></i></div><div class="panel-toolbar" role="menu"><a href="#" class="btn btn-panel hover-effect-dot js-panel-collapse waves-effect waves-themed" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"></a> <a href="#" class="btn btn-panel hover-effect-dot js-panel-fullscreen waves-effect waves-themed" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"></a> <a href="#" class="btn btn-panel hover-effect-dot js-panel-close waves-effect waves-themed" data-toggle="tooltip" data-offset="0,10" data-original-title="Close"></a></div><div class="panel-toolbar" role="menu"><a href="#" class="btn btn-toolbar-master waves-effect waves-themed" data-toggle="dropdown"><i class="fal fa-ellipsis-v"></i></a><div class="dropdown-menu dropdown-menu-animated dropdown-menu-right p-0"><a href="#" class="dropdown-item js-panel-refresh"><span data-i18n="drpdwn.refreshpanel">Refresh Content</span></a> <a href="#" class="dropdown-item js-panel-locked"><span data-i18n="drpdwn.lockpanel">Lock Position</span></a>  <div class="dropdown-multilevel dropdown-multilevel-left">											<div class="dropdown-item">												<span data-i18n="drpdwn.panelcolor">Panel Style</span>											</div>											<div class="dropdown-menu d-flex flex-wrap" style="min-width: 9.5rem; width: 9.5rem; padding: 0.5rem"><a href="#" class="btn d-inline-block bg-primary-700 bg-success-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-primary-700 bg-success-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-primary-500 bg-info-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-primary-500 bg-info-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-primary-600 bg-primary-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-primary-600 bg-primary-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-info-600 bg-primray-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-info-600 bg-primray-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-info-600 bg-info-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-info-600 bg-info-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-info-700 bg-success-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-info-700 bg-success-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-success-900 bg-info-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-success-900 bg-info-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-success-700 bg-primary-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-success-700 bg-primary-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-success-600 bg-success-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-success-600 bg-success-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-danger-900 bg-info-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-danger-900 bg-info-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-fusion-400 bg-fusion-gradient width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-fusion-400 bg-fusion-gradient" style="margin:1px;"></a> <a href="#" class="btn d-inline-block bg-faded width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot waves-effect waves-themed" data-panel-setstyle="bg-faded" style="margin:1px;"></a></div>										</div>  <div class="dropdown-divider m-0"></div><a href="#" class="dropdown-item js-panel-reset"><span data-i18n="drpdwn.resetpanel">Reset Panel</span></a></div></div></div>' + '<div class="row buttons-header">' +
        '<div style="padding-left:12px" class="buttons-header-grid">' +
        '<button id="NewNumberingConfigButton" class="btn btn-success btn-sm waves-effect waves-themed" type="button" data-busy-text="Processing..."><i class="fa fa-plus"></i> <span>Add new</span></button>' +
        '<button id="ExportToExcelButton" class="btn btn-primary btn-sm waves-effect waves-themed" type="button" data-busy-text="Processing..."><i class="fa fa-download"></i> <span>Export to Excel</span></button>' +
        '<div class="btn-group">' +
        '<button class="btn buttons-collection dropdown-toggle buttons-colvis btn-outline-default waves-effect waves-themed" tabindex="0" aria-controls="dt-basic-example" type="button" title="Col visibility" aria-haspopup="true" aria-expanded="false">' +
        '<span>Column Visibility</span>' +
        '</button>' +
        '</div>' +
        '<button class="btn buttons-csv buttons-html5 btn-outline-default waves-effect waves-themed" tabindex="0" aria-controls="dt-basic-example" type="button" title="Generate CSV"><span>CSV</span></button>' +
        '<button class="btn buttons-copy buttons-html5 btn-outline-default waves-effect waves-themed" tabindex="0" aria-controls="dt-basic-example" type="button" title="Copy to clipboard"><span>Copy</span></button>' +
        '<button class="btn buttons-print btn-outline-default waves-effect waves-themed" tabindex="0" aria-controls="dt-basic-example" type="button" title="Print Table">' +
        '<span><i class="fal fa-print"></i></span>' +
        '</button>' +
        '<div class="dx-datagrid-search-panel dx-show-invalid-badge dx-textbox dx-texteditor dx-editor-outlined dx-searchbox dx-show-clear-button dx-texteditor-empty dx-widget dx-state-hover" style="width: 250px;">' +
        '<div class="dx-texteditor-container">' +
        '<div class="dx-texteditor-input-container">' +
        '<div class="dx-icon dx-icon-search"></div>' +
        '<input autocomplete="off" aria-label="Search in the data grid" class="dx-texteditor-input" type="text" spellcheck="false" tabindex="0" role="textbox">' +

        '</div>' +
        '<div class="dx-texteditor-buttons-container">' +
        '<span class="dx-clear-button-area"><span class="dx-icon dx-icon-clear"></span></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
    $('body').append('<style>.panel-hdr{margin-bottom: 15px;}.card-body{padding-top:0}.panel-hdr > :first-child{padding-left:0}.buttons-header .btn{height:32.3px;margin-right:2px}.table > :not(caption) > * > * {padding: 0 !important; </style>');

    $('.card-body').parent().parent().removeClass('row')
}