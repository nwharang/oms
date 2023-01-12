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
    var arr_companies = [];
    window.dMSpro.oMS.mdmService.controllers.companies.company.getListDevextremes({})
        .done(result => {
            arr_companies = result.data;
            var index = 1;
            arr_companies.forEach(u => {
                if (index == 1)
                    $('#selected-company').text(u.name);
                $('table.companies > tbody').append(`<tr><td>${index}</td><td>${u.code}</td><td>${u.name}</td></tr>`);
                index++;
            });
            $('table.companies > tbody > tr').click(function () {
                changeSelectedCompany(this);
            })
        });
});