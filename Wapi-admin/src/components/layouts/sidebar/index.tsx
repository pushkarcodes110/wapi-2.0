"use client";

import { ROUTES } from "@/src/constants";
import { iconMap, MenuItem, sidebarMenuData } from "@/src/data/sidebarList";
import { usePermissions } from "@/src/hooks/usePermissions";
import { useLogoutMutation } from "@/src/redux/api/authApi";
import { useAppSelector } from "@/src/redux/hooks";
import { logout } from "@/src/redux/reducers/authSlice";
import {
  closeMobileSidebar,
  setRTL,
  setSidebarHover,
} from "@/src/redux/reducers/layoutSlice";
import { setPageTitle } from "@/src/redux/reducers/settingsSlice";
import ConfirmModal from "@/src/shared/ConfirmModal";
import CustomImage from "@/src/shared/Image";
import {
  NavItemProps,
  SectionHeaderProps,
  SubNavItemProps,
} from "@/src/types/components";
import { ChevronDown, LogOut, User as UserIcon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/elements/ui/tooltip";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  hasSubmenu,
  active,
  isSubmenuOpen,
  onClick,
  collapsed,
}) => {
  const { t } = useTranslation();

  const isLeafNode = !hasSubmenu;

  const activeClasses = isLeafNode
    ? "bg-gradient-to-r from-(--text-green-primary) to-sidebar-hover-green text-white shadow-lg shadow-(--text-green-primary)/25"
    : "bg-green-50 dark:bg-sidebar-hover-green/50 text-(--text-green-primary)";

  const inactiveClasses =
    "hover:bg-slate-100 dark:hover:bg-sidebar-hover-green/30 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200";

  return (
    <div className="group/navitem">
      <button
        onClick={onClick}
        className={`
          w-full flex items-center justify-between transition-all duration-200 relative overflow-hidden rounded-lg
          ${collapsed ? "p-2.5 justify-center mb-1" : "p-3 mb-1"}
          ${(isLeafNode ? active : isSubmenuOpen) ? activeClasses : inactiveClasses}
        `}
      >
        <div
          className={`flex items-center gap-3 relative z-10 ${collapsed ? "justify-center" : ""}`}
        >
          <span
            className={`transition-all duration-200 
            ${(isLeafNode ? active : isSubmenuOpen) ? (isLeafNode ? "text-white" : "text-(--text-green-primary)") : "group-hover/navitem:scale-110 text-slate-500 dark:text-slate-400"}
          `}
          >
            {icon}
          </span>
          {!collapsed && (
            <span className="font-medium text-sm truncate">{t(label)}</span>
          )}
        </div>

        {hasSubmenu && !collapsed && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 relative z-10 ${isSubmenuOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>
    </div>
  );
};

const SubNavItem: React.FC<SubNavItemProps> = ({ label, active, onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all mb-1
        ${active ? "bg-linear-to-r from-(--text-green-primary) to-sidebar-hover-green text-white shadow-md shadow-(--text-green-primary)/20 font-medium" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-sidebar-hover-green/30"}
      `}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-white" : "bg-slate-300 dark:bg-(--dark-sidebar)"}`}
      />
      <span className="truncate text-start">{t(label)}</span>
    </button>
  );
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  isOpen,
  onClick,
  collapsed,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useAppSelector((state) => state.layout);

  return (
    <div
      onClick={!collapsed ? onClick : undefined}
      className={`w-full flex items-center justify-between px-3 py-2 truncate ${collapsed ? "mt-1 mb-1" : ""} text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest cursor-pointer ${collapsed ? "justify-center px-0" : ""}`}
    >
      {!collapsed ? (
        <>
          <span className="text-[16px] font-medium tracking-normal capitalize">{t(label)}</span>
          <div
            className={`transition-transform duration-200 ${isOpen ? "rotate-0" : isRTL ? "rotate-90" : "-rotate-90"}`}
          >
            <ChevronDown className="w-4 h-4  transition-opacity" />
          </div>
        </>
      ) : (
        <div className="h-0.5 w-6 bg-slate-200 dark:bg-sidebar-hover-green/50 rounded-full" />
      )}
    </div>
  );
};

export default function Sidebar() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { sidebarToggle, isMobileSidebarOpen, isRTL, sidebarHover } =
    useAppSelector((state) => state.layout);
  const { data: settings } = useAppSelector((state) => state.settings);
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutApi] = useLogoutMutation();
  const [isMobile, setIsMobile] = useState(false);
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);

  const isVisible = isMobile ? isMobileSidebarOpen : true;
  const isVisuallyCollapsed = sidebarToggle && !isMobile && !sidebarHover;

  const sidebarLogo = useMemo(() => {
    // Wait until settings are available
    if (!settings || Object.keys(settings).length === 0) return null;

    const isDark = theme === "dark";

    if (isVisuallyCollapsed) {
      return (
        (isDark
          ? settings?.sidebar_dark_logo_url
          : settings?.sidebar_light_logo_url) || "/assets/logos/sidebarLogo.png"
      );
    }

    return (
      (isDark ? settings?.logo_dark_url : settings?.logo_light_url) ||
      "/assets/logos/logo1.png"
    );
  }, [theme, settings, isVisuallyCollapsed]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    dispatch(closeMobileSidebar());
  }, [pathname, dispatch]);

  const { hasPermission } = usePermissions();

  const filteredMenuData = useMemo(() => {
    return sidebarMenuData
      .map((section) => ({
        ...section,
        items: section.items
          .filter((item) => {
            if (item.permission && !hasPermission(item.permission)) return false;
            return true;
          })
          .map((item) => {
            if (item.hasSubmenu && item.submenu) {
              return {
                ...item,
                submenu: item.submenu.filter((sub) => !sub.permission || hasPermission(sub.permission)),
              };
            }
            return item;
          })
          .filter((item) => {
            if (item.hasSubmenu && item.submenu && item.submenu.length === 0) return false;
            return true;
          }),
      }))
      .filter((section) => section.items.length > 0);
  }, [hasPermission]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    filteredMenuData.reduce(
      (acc, section) => {
        acc[section.title] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const toggleSubmenu = (itemLabel: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  // Sync openSections when menu data becomes available
  useEffect(() => {
    if (filteredMenuData.length > 0) {
      setOpenSections((prev) => {
        const updates: Record<string, boolean> = {};
        let changed = false;
        filteredMenuData.forEach((section) => {
          if (prev[section.title] === undefined) {
            updates[section.title] = true;
            changed = true;
          }
        });
        return changed ? { ...prev, ...updates } : prev;
      });
    }
  }, [filteredMenuData]);

  // Auto-open submenus based on current pathname
  useEffect(() => {
    let changed = false;
    const updates: Record<string, boolean> = {};

    filteredMenuData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.hasSubmenu && item.submenu) {
          const isActive = item.submenu.some(
            (sub) =>
              pathname === sub.path || pathname.startsWith(sub.path + "/"),
          );
          if (isActive && !openSubmenus[item.label]) {
            updates[item.label] = true;
            changed = true;
          }
        }
      });
    });

    if (changed) {
      setOpenSubmenus((prev) => ({ ...prev, ...updates }));
    }
  }, [pathname, filteredMenuData, openSubmenus]);

  // Set pageTitle in Redux based on active menu item
  useEffect(() => {
    let activeLabel = "";

    for (const section of filteredMenuData) {
      for (const item of section.items) {
        if (item.hasSubmenu && item.submenu) {
          // eslint-disable-next-line react-hooks/immutability
          const activeSub = item.submenu.find((sub) => isPathActive(sub.path, true));
          if (activeSub) {
            activeLabel = activeSub.label;
            break;
          }
        } else if (item.path && isPathActive(item.path)) {
          activeLabel = item.label;
          break;
        }
      }
      if (activeLabel) break;
    }

    if (activeLabel) {
      dispatch(setPageTitle(t(activeLabel)));
    }
  }, [pathname, t, dispatch]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (isVisuallyCollapsed) {
      setClickedItemId(item.label);
      setTimeout(() => setClickedItemId(null), 1500);
    }
    if (item.hasSubmenu) {
      toggleSubmenu(item.label);
    } else if (item.path) {
      handleNavigation(item.path);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const isSubmenuActive = (item: MenuItem) => {
    return item.submenu?.some((subItem) => pathname === subItem.path) ?? false;
  };

  const isPathActive = (path: string, exact: boolean = false) => {
    if (pathname === path) return true;
    if (!exact && pathname.startsWith(path + "/")) return true;
    return false;
  };

  return (
    <>
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 dark:bg-(--dark-body) z-[160] transition-opacity animate-in fade-in"
          onClick={() => dispatch(closeMobileSidebar())}
        />
      )}

      <div
        className={`fixed inset-s-0 top-0 h-screen bg-light-body-bg dark:bg-(--dark-body) transition-all duration-300 ease-in-out z-[161]
          ${isVisuallyCollapsed ? "w-27.5" : "w-76"}
          ${isVisible ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="h-full p-4">
          <div
            className={`
            h-full rounded-lg flex flex-col overflow-hidden border backdrop-blur-xl shadow-2xl transition-all duration-300
            ${"bg-white/80 dark:bg-(--card-color) border-white/60 dark:border-(--card-border-color) shadow-green-100/50 dark:shadow-black/50"}
            ${isVisuallyCollapsed ? "px-2" : "px-0"}
          `}
          >
            {/* Logo Section */}
            <div
              className={`${isVisuallyCollapsed ? "p-4" : "p-6 pb-2"} ${isVisuallyCollapsed ? "flex justify-center w-full" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-3 ${isVisuallyCollapsed ? "justify-center" : ""}`}
                >
                  {sidebarLogo === null ? (
                    <div className="h-7.5 w-28 flex items-center justify-center text-sm font-semibold">
                      <div className="h-7.5 w-28 bg-gray-200 dark:bg-sidebar-hover-green/40 animate-pulse rounded-md" />
                    </div>
                  ) : (
                    <CustomImage
                      src={sidebarLogo}
                      alt="Logo"
                      width={100}
                      height={100}
                      className="object-contain w-full h-7.5"
                    />
                  )}
                </div>

                {isMobile && (
                  <button
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    onClick={() => dispatch(closeMobileSidebar())}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div
              className={`flex-1 overflow-y-auto ${isVisuallyCollapsed ? "px-2" : "px-4"} py-2 custom-scrollbar scrollbar-hide space-y-1`}
            >
              {filteredMenuData.map((section) => (
                <div
                  key={section.title}
                  className={isVisuallyCollapsed ? "mb-1" : "mb-2"}
                >
                  <SectionHeader
                    label={section.title}
                    isOpen={openSections[section.title] ?? true}
                    onClick={() => toggleSection(section.title)}
                    collapsed={isVisuallyCollapsed}
                  />
                  {(openSections[section.title] || isVisuallyCollapsed) && (
                    <div className="space-y-1">
                      {section.items.map((item, index) => (
                        <div key={`${item.label}-${index}`}>
                          {isVisuallyCollapsed ? (
                            <Tooltip open={clickedItemId === item.label ? true : undefined}>
                              <TooltipTrigger asChild>
                                <div>
                                  <NavItem
                                    icon={getIcon(item.icon)}
                                    label={item.label}
                                    hasSubmenu={item.hasSubmenu}
                                    active={
                                      (!item.hasSubmenu &&
                                        item.path &&
                                        isPathActive(item.path)) ||
                                      isSubmenuActive(item)
                                    }
                                    isSubmenuOpen={openSubmenus[item.label]}
                                    onClick={() => handleMenuItemClick(item)}
                                    collapsed={isVisuallyCollapsed}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className={`ml-2 z-[200] p-0 overflow-hidden border shadow-xl bg-white dark:bg-(--card-color) dark:border-(--card-border-color) ${item.hasSubmenu ? "min-w-48" : ""}`}
                              >
                                {item.hasSubmenu ? (
                                  <div className="flex flex-col">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                      <p className="text-[14px] font-medium text-(--text-green-primary)">
                                        {t(item.label)}
                                      </p>
                                    </div>
                                    <div className="p-1.5 flex flex-col gap-0.5">
                                      {item.submenu?.map((sub, idx) => (
                                        <div
                                          key={idx}
                                          onClick={() => handleNavigation(sub.path)}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-all group cursor-pointer"
                                        >
                                          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-(--text-green-primary) dark:group-hover:text-white">
                                            {t(sub.label)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="px-3 py-1.5 text-[13px] font-semibold text-white bg-(--text-green-primary)">
                                    {t(item.label)}
                                  </div>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <NavItem
                              icon={getIcon(item.icon)}
                              label={item.label}
                              hasSubmenu={item.hasSubmenu}
                              active={
                                (!item.hasSubmenu &&
                                  item.path &&
                                  isPathActive(item.path)) ||
                                isSubmenuActive(item)
                              }
                              isSubmenuOpen={openSubmenus[item.label]}
                              onClick={() => handleMenuItemClick(item)}
                              collapsed={isVisuallyCollapsed}
                            />
                          )}

                          {/* Submenu */}
                          {item.hasSubmenu &&
                            openSubmenus[item.label] &&
                            !isVisuallyCollapsed &&
                            item.submenu && (
                              <div
                                className={`
                              overflow-hidden transition-all duration-300 ease-in-out mt-1
                              ${isRTL ? "mr-4 pr-4 border-r" : "ml-4 pl-4 border-l"} 
                              dark:border-sidebar-hover-green border-slate-200 space-y-1
                            `}
                              >
                                {item.submenu.map((subItem, subIndex) => (
                                  <SubNavItem
                                    key={`${subItem.label}-${subIndex}`}
                                    label={subItem.label}
                                    active={isPathActive(subItem.path, true)}
                                    onClick={() =>
                                      handleNavigation(subItem.path)
                                    }
                                  />
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* User Profile Section */}
            <div
              className={`p-4 mt-2 border-t dark:border-(--card-border-color) border-slate-100 ${isVisuallyCollapsed ? "px-2" : ""}`}
            >
              {isVisuallyCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => handleNavigation("/manage_profile")}
                      className="p-2 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-sidebar-hover-green/30"
                    >
                      <div
                        className="w-10 h-10 shrink-0 rounded-lg bg-linear-to-tr from-(--text-green-primary) to-sidebar-hover-green flex items-center justify-center text-white font-bold border border-white dark:border-(--card-border-color) shadow-sm"
                      >
                        {user?.user?.name?.charAt(0) || "A"}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2 z-[200] p-0 overflow-hidden border shadow-xl bg-white dark:bg-(--card-color) dark:border-(--card-border-color)">
                    <div className="px-3 py-1.5 text-[13px] font-semibold text-white bg-(--text-green-primary)">
                      {t("profile")}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div
                  onClick={() => handleNavigation("/manage_profile")}
                  className="p-3 rounded-lg flex items-center gap-3 transition-all duration-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-sidebar-hover-green/30"
                >
                  <div
                    className="w-10 h-10 shrink-0 rounded-lg bg-linear-to-tr from-(--text-green-primary) to-sidebar-hover-green flex items-center justify-center text-white font-bold border border-white dark:border-(--card-border-color) shadow-sm"
                  >
                    {user?.user?.name?.charAt(0) || "A"}
                  </div>
                  <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <p className="text-sm font-bold truncate dark:text-white">
                      {user?.user?.name || "Alex Morgan"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate tracking-tighter">
                      {user?.user?.email || "Super Admin"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLogoutModal(true);
                    }}
                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-slate-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setIsLoggingOut(true);
          await logoutApi().unwrap();
          dispatch(logout());
          dispatch(setRTL(false));
          router.push(ROUTES.Login);
        }}
        isLoading={isLoggingOut}
        title={t("common_logout_confirm_title")}
        subtitle={t("common_logout_confirm_subtitle")}
        confirmText={t("auth_logout")}
        cancelText={t("common_cancel")}
        variant="danger"
      />
    </>
  );
}
