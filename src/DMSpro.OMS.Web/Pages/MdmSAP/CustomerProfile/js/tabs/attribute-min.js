let createAttribute=()=>({title:"Attribute",icon:null,callback:()=>{let e=$("<div/>");$("<div/>").dxDataGrid({dataSource:gridInfo.data.customerAttribute,allowColumnResizing:!0,columnResizingMode:"widget",columnAutoWidth:!0,remoteOperations:!0,showRowLines:!0,showBorders:!0,cacheEnabled:!0,rowAlternationEnabled:!0,repaintChangesOnly:!0,filterRow:{visible:!0},groupPanel:{visible:!0},searchPanel:{visible:!0},headerFilter:{visible:!0},paging:{enabled:!0,pageSize:pageSize},pager:{visible:!0,showPageSizeSelector:!0,allowedPageSizes:allowedPageSizes,showInfo:!0,showNavigationButtons:!0},columnMinWidth:50,columnChooser:{enabled:!0,mode:"select"},export:{enabled:!0},onExporting:function(e){const t=new ExcelJS.Workbook,o=t.addWorksheet("Data");DevExpress.excelExporter.exportDataGrid({component:e.component,worksheet:o,autoFilterEnabled:!0}).then((()=>{t.xlsx.writeBuffer().then((e=>{saveAs(new Blob([e],{type:"application/octet-stream"}),"CustomerAttribute.xlsx")}))})),e.cancel=!0},toolbar:{items:["groupPanel","addRowButton","columnChooserButton","exportButton","searchPanel"]},columns:[{caption:l("MdmSAPService.Entity.ShipToCode"),dataField:"shipToCode",dataType:"string"},...getAttrField()]}).appendTo(e);return e}});