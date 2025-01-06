"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { APP_NAME } from "../../lib/constants";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import PresentationChartLineIcon from "@heroicons/react/24/outline/PresentationChartLineIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import ChatBubbleLeftEllipsisIcon from "@heroicons/react/24/outline/ChatBubbleLeftEllipsisIcon";
import SidebarSubmenu from "./sidebar-submenu";
import { usePathname } from "next/navigation";
import { NewspaperIcon } from "@heroicons/react/24/outline";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

export const navItems = [
  {
    path: "/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/c",
    icon: <ChatBubbleLeftEllipsisIcon className={iconClasses} />,
    name: "Nuevo Chat",
  },
  {
    path: "/history",
    icon: <ClockIcon className={iconClasses} />,
    name: "Mensajes",
  },
  {
    path: "/customers",
    icon: <InboxArrowDownIcon className={iconClasses} />,
    name: "Clientes",
  },
  {
    path: "/products",
    icon: <BoltIcon className={iconClasses} />,
    name: "Products",
  },
  {
    path: "/orders",
    icon: <PresentationChartLineIcon className={iconClasses} />,
    name: "Ventas",
  },
  {
    path: "",
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />,
    name: "Ajustes",
    submenu: [
      {
        path: "/profile",
        icon: <UsersIcon className={submenuIconClasses} />,
        name: "Mi cuenta",
      },
      {
        path: "/settings",
        icon: <Cog6ToothIcon className={submenuIconClasses} />,
        name: "Generales",
      },
      {
        path: "/chatbots",
        icon: <ChatBubbleLeftEllipsisIcon className={submenuIconClasses} />,
        name: "Chatbots",
      },
      {
        path: "/prompts",
        icon: <NewspaperIcon className={submenuIconClasses} />,
        name: "Prompts",
      },
    ],
  },
];

export interface SidebarProps extends React.ComponentProps<"div"> {}

export function Sidebar({}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="drawer-side z-30">
      <label
        htmlFor="left-side-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu min-h-full w-60 bg-base-100 pt-2 text-base-content">
        <button
          className="btn btn-circle btn-ghost absolute right-0 top-0 z-50 mr-2 mt-4 bg-base-300 lg:hidden"
          onClick={() => close()}
        >
          <XMarkIcon className="inline-block h-5 w-5" />
        </button>
        <li className="mb-2 text-xl font-semibold">
          <Link href={"/"}>
            <Image
              className="mask mask-squircle w-10"
              src="/logo.png"
              alt="Logo"
              width={160}
              height={240}
            />
            {APP_NAME}
          </Link>{" "}
        </li>
        {navItems.map((route, k) => {
          return (
            <li className="" key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <Link
                  href={route.path}
                  // className={({ isActive}) =>
                  //   `${
                  //     isActive ? "bg-base-200  font-semibold " : "font-normal"
                  //   }`
                  // }
                >
                  {route.icon} {route.name}
                  {pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-br-md rounded-tr-md bg-primary"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
