import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { MENU_ITEMS, MenuItem, flattenMenuItems } from './layout.d';
import { List, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const Sidebar = () => {
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const [itemActive, setItemActive] = React.useState<string>('');

  useEffect(() => {
    if (!!location.pathname) {
      const target = flattenMenuItems?.find((item: MenuItem) => item.path === location.pathname);
      setItemActive(target?.path || '');
      setOpenSubMenus({ [target?.key.split('-')[0] || '']: true });
    }
  }, [location.pathname]);

  const handleClick = (key: string) => {
    setOpenSubMenus((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <List sx={{ px: 2 }}>
        {MENU_ITEMS.map((item) => {
          const isSubpath = item.subPath && item.subPath.length > 0;
          const isActive = itemActive === item.path && !isSubpath;
          return (
            <React.Fragment key={item.key}>
              <ListItemButton
                sx={{
                  backgroundColor: (theme) => (isActive ? theme.palette.primary.main : 'inherit'),
                  color: (theme) => (isActive ? theme.palette.common.white : 'inherit'),
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.common.white,
                  },
                  borderRadius: 2
                }}
                onClick={() => (isSubpath ? handleClick(item.key) : handleNavigate(item.path))}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: (theme) => (isActive ? theme.palette.common.white : theme.palette.common.black),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {isSubpath ? openSubMenus[item.key] ? <ExpandLess /> : <ExpandMore /> : null}
              </ListItemButton>
              {isSubpath && (
                <Collapse in={openSubMenus[item.key]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {isSubpath &&
                      item.subPath?.map((subItem) => {
                        const isSubActive = itemActive === subItem.path;

                        return (
                          <ListItemButton
                            sx={{
                              backgroundColor: (theme) => (isSubActive ? theme.palette.primary.main : 'inherit'),
                              color: (theme) => (isSubActive ? theme.palette.common.white : theme.palette.common.black),
                              '&:hover': {
                                backgroundColor: (theme) => theme.palette.primary.light,
                                color: (theme) => theme.palette.common.white,
                              },
                              pl: 4,
                              borderRadius: 2
                              // '&:hover': (theme) => theme.palette.primary.light
                            }}
                            key={subItem.key}
                            onClick={() => handleNavigate(subItem.path)}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 36,
                                color: (theme) =>
                                  isSubActive ? theme.palette.common.white : theme.palette.common.black,
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={subItem.label} />
                          </ListItemButton>
                        );
                      })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </>
  );
};

export default Sidebar;
