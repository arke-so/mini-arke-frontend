import type { SvelteComponent } from 'svelte'

import Accounting from './accounting.svelte'
import Archive from './archive.svelte'
import ArkeAI from './Arke-AI.svelte'
import Arke from './Arke.svelte'
import ArkeLogoOnly from './ArkeLogoOnly.svelte'
import ArkeNew from './ArkeNew.svelte'
import ArrowLeftCircle from './arrow-left-circle.svelte'
import ArrowLeft from './arrow-left.svelte'
import Bell from './bell.svelte'
import Box from './box.svelte'
import Boxes from './boxes.svelte'
import Calendar from './calendar.svelte'
import Cart from './cart.svelte'
import Check from './check.svelte'
import ChevronRight from './chevron-right.svelte'
import ChevronUpDown from './chevron-up-down.svelte'
import Crown from './crown.svelte'
import Database from './database.svelte'
import Download from './download.svelte'
import FastArrowRight from './fast-arrow-right.svelte'
import Filter from './filter.svelte'
import X from './icon-x.svelte'
import Info from './info.svelte'
import List from './list.svelte'
import Logout from './logout.svelte'
import LongArrowLeftUp from './long-arrow-left-up.svelte'
import Menu from './menu.svelte'
import Minus from './minus.svelte'
import Moon from './moon.svelte'
import Pencil from './pencil.svelte'
import PlusCircle from './plus-circle.svelte'
import Plus from './plus.svelte'
import Potion from './potion.svelte'
import Product from './product.svelte'
import Profile from './profile.svelte'
import RawMaterial from './raw-material.svelte'
import Refresh from './refresh.svelte'
import Save from './save.svelte'
import Search from './search.svelte'
import SemiFinished from './semi-finished.svelte'
import Send from './send.svelte'
import Settings from './settings.svelte'
import Shop from './shop.svelte'
import SortRows from './sort-rows.svelte'
import Sun from './sun.svelte'
import SwitchOff from './switchOff.svelte'
import SwitchOn from './switchOn.svelte'
import TowerCheck from './tower-check.svelte'
import Trash from './trash.svelte'
import Upload from './upload.svelte'
import Users from './users.svelte'
import ShoppingBasket from 'lucide-svelte/icons/shopping-basket'

export type Icon = SvelteComponent

export const IconSize = Object.freeze({
  Micro: 'w-3',
  Button: 'w-3.5',
  Small: 'w-4 h-4',
  Medium: 'w-5',
  Large: 'w-6',
})

export const IcoNoir = {
  Accounting,
  Archive,
  Arke,
  ArkeNew,
  ArkeLogoOnly,
  ArkeAI,
  ArrowLeft,
  ArrowLeftCircle,
  Bell,
  Box,
  Boxes,
  Calendar,
  Cart,
  Check,
  Crown,
  ChevronRight,
  ChevronUpDown,
  Database,
  Download,
  FastArrowRight,
  Filter,
  Info,
  List,
  Logout,
  LongArrowLeftUp,
  Menu,
  Minus,
  Moon,
  Pencil,
  Plus,
  PlusCircle,
  Potion,
  Product,
  Profile,
  RawMaterial,
  Refresh,
  Save,
  SemiFinished,
  Send,
  Settings,
  Search,
  Shop,
  ShoppingBasket,
  SwitchOff,
  SwitchOn,
  SortRows,
  Sun,
  Trash,
  TowerCheck,
  Users,
  Upload,
  X,
}
