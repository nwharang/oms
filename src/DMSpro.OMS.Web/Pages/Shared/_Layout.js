$(function () {

    $('button[data-id=action-add-grid]').click(function () {
        var controlName = $(this).attr('data-effect-grid');
        var controlType = $(this).attr('data-effect-type');
        controlType = controlType ? controlType : 'dxDataGrid';
        if ($(`#${controlName}`).length > 0) {
            $(`#${controlName}`).data(`${controlType}`).addRow();
            $(`#${controlName}`).data(`${controlType}`).deselectAll();
        }
    });

    function changeSelectedCompany(arg) {
        $('#selected-company').text($(arg).find('td:nth-child(3)').text());
    }

    if (!$.isEmptyObject(abp.auth.grantedPolicies)) {
        //if (abp.auth.isAnyGranted()) { };
        return;
        //window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment.getListCompanyByCurrentUser({})
        //    .done(result => {
        //        arr_companies = result.data;
        //        var index = 1;
        //        arr_companies.forEach(u => {
        //            if (index == 1)
        //                $('#selected-company').text(u.company.name);
        //            $('table.companies > tbody').append(`<tr data-id=${u.company.id}><td>${index}</td><td>${u.company.code}</td><td>${u.company.name}</td></tr>`);
        //            index++;
        //        });
        //        $('table.companies > tbody > tr').click(function () {
        //            changeSelectedCompany(this);
        //        })

        //        //$('#selected-company').dxSelectBox({
        //        //    labelMode: 'hidden',
        //        //    stylingMode: 'underlined',
        //        //    dataSource: new DevExpress.data.ArrayStore({
        //        //        data: arr_companies,
        //        //        key: 'company.id',
        //        //    }),
        //        //    displayExpr: 'company.name',
        //        //    valueExpr: 'company.id',
        //        //    value: arr_companies[0].company.id,
        //        //    fieldTemplate(data, container) {
        //        //        const result = $(`<div class='custom-item'<i class="fa fa-sitemap"></i><div class='product-name'></div></div>`);
        //        //        result
        //        //            .find('.product-name')
        //        //            .dxTextBox({
        //        //                value: data.company.name,
        //        //                readOnly: true,
        //        //            });
        //        //        container.append(result);
        //        //        console.log(result);
        //        //    },
        //        //});
        //    });
        
        
    } else {
        //window.location = '/account/logout';
    }
    //DevExpress.config({
    //    //rtlEnabled: true,
    //    //forceIsoDateParsing: false,
    //    //editorStylingMode: 'underlined',
    //    //editorStylingMode: 'floating',
    //    // ...
    //});
    // ===== or when using modules =====
    //import config from "devextreme/core/config";

    //config({
    //    rtlEnabled: true,
    //    forceIsoDateParsing: false,
    //    // ...
    //});
});