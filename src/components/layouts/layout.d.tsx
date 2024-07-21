import { MENU_STRINGS } from '@/constants/menuString';
import routeStrings from '@/routes/routeStrings';
import { ReactNode } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export interface MenuItem {
  key: string;
  label: string;
  path: string;
  subPath?: MenuItem[];
  icon?: ReactNode;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    key: MENU_STRINGS.Home,
    label: 'Home',
    path: routeStrings.home,
    icon: <HomeIcon />,
  },
  {
    key: MENU_STRINGS.Invoice,
    label: 'Invoice',
    path: routeStrings.invoices,
    icon: <DescriptionIcon />,
    subPath: [
      {
        key: MENU_STRINGS.InvoiceCreate,
        label: 'New Invoice',
        path: routeStrings.invoiceCreate,
        icon: <NoteAddIcon />,
      },
      {
        key: MENU_STRINGS.Invoice,
        label: 'All Invoices',
        path: routeStrings.invoices,
        icon: <DescriptionIcon />,
      },
      {
        key: MENU_STRINGS.InvoiceDetail,
        label: 'Invoice Detail',
        path: routeStrings.invoiceDetail,
        icon: <InsertDriveFileIcon />,
      }
    ]
  },
];

export const flattenMenuItems = MENU_ITEMS.reduce((acc: MenuItem[], item: MenuItem) => {
    acc.push(item);
    if (item.subPath) {
      acc.push(...item.subPath);
    }
    return acc;
  }, []);

export interface ListSubItemsProps {
  item: MenuItem;
  onItemSelected: (menu: MenuItem) => void;
  isSelected: boolean;
  selectedItem: string;
}