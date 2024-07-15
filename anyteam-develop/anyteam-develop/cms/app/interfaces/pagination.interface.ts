export interface ItemsPerPageSelect {
    label: string,
    values: number[]
}

export interface PaginationInterface {
    pageActive: number,
    itemPerPage: number,
    offsetDefault: number,
    collapseDuration: number,
    itemsPerPageSelect : ItemsPerPageSelect 
}