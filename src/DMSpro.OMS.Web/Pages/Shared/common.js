const pageSize = 20;
const pageSizeForLookup = 20;
const allowedPageSizes = [10, 20, 50, 100];
const requestOptions = ["filter", "group", "groupSummary", "parentIds", "requireGroupCount", "requireTotalCount", "searchExpr", "searchOperation", "searchValue", "select", "sort", "skip", "take", "totalSummary", "userData"];

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
}