"use client";

import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  submenu: any;
  name: string;
  icon: any;
}

function SidebarSubmenu({ submenu, name, icon }: Props) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  /** Open Submenu list if path found in routes, this is for directly loading submenu routes  first time */
  useEffect(() => {
    if (
      submenu.filter((m: any) => {
        return m.path === pathname;
      })[0]
    )
      setIsExpanded(true);
  }, []);

  return (
    <div className="flex flex-col">
      {/** Route header */}
      <div className="block w-full" onClick={() => setIsExpanded(!isExpanded)}>
        {icon} {name}
        <ChevronDownIcon
          className={
            "delay-400 float-right mt-1 h-5 w-5 transition-all duration-500  " +
            (isExpanded ? "rotate-180" : "")
          }
        />
      </div>

      {/** Submenu list */}
      <div className={` w-full ` + (isExpanded ? "" : "hidden")}>
        <ul className={`menu-compact menu`}>
          {submenu.map((m: any, k: number) => {
            return (
              <li key={k}>
                <Link href={m.path}>
                  {m.icon} {m.name}
                  {pathname == m.path ? (
                    <span
                      className="absolute inset-y-0 left-0 mb-1 mt-1 w-1 rounded-br-md rounded-tr-md bg-primary "
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SidebarSubmenu;
