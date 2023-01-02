$(function () {
    $('button[data-id=action-add-grid]').click(function () { 
        var controlName = $(this).attr('data-effect-grid');
        var controlType = $(this).attr('data-effect-type');
        controlType = controlType ? controlType : 'dxDataGrid';
        if ($(`#${controlName}`).length > 0) {
            $(`#${controlName}`).data(`${controlType}`).addRow();
            $(`#${controlName}`).data(`${controlType}`).deselectAll();
        }
    })
});