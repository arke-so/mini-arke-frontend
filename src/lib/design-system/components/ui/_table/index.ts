import HeadWithFilter from './head-with-filter.svelte'
import Head from './head.svelte'
import Regular from './regular-table.svelte'
import Row from './row.svelte'
import Cell from './table-cell.svelte'
import Header from './table-header.svelte'
import Root from './table-virtualized.svelte'
import Body from './tbody.svelte'

export type TableContext = {
  sticky: boolean
  linear: boolean
}

export type UnknownWithID = any & { id: string }
export const TableClass = Object.freeze({
  MainCell: 'w-40 md:w-60 lg:w-2/5 xl:w-3/5 lg:max-w-[20rem] xl:max-w-[30rem]',
  NarrowMainCell: 'w-40 max-w-40 md:w-60 lg:w-2/6 xl:w-2/5 lg:max-w-[15rem] xl:max-w-[20rem]',
  NarrowCell: 'w-32 max-w-32 md:w-40 md:max-w-40 lg:w-48 lg:max-w-48',
  IDCell: 'max-w-40 truncate',
})

const components = {
  Header,
  Head,
  HeadWithFilter,
  Body,
  Row,
  Cell,
}

export const InfiniteTable = {
  Root,
  ...components,
}

export const Table = {
  Root: Regular,
  ...components,
}
