"use client";

import Link from "next/link";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import Image from "next/image";
import { useAuth } from "../../lib/providers/auth-context";

export function Navbar() {
  const noOfNotifications = 0;
  const currentRoute: any = null;
  const { user, logout, loading } = useAuth();

  return (
    <div className="navbar sticky top-0 z-10 bg-base-100 shadow-md">
      <div className="flex-1">
        <label
          htmlFor="left-side-drawer"
          className="btn btn-primary drawer-button lg:hidden"
        >
          <Bars3Icon className="inline-block h-5 w-5" />
        </label>
        <h1 className="ml-2 text-2xl font-semibold">
          {currentRoute?.name || ""}
        </h1>
      </div>
      <div className="flex-none">
        <button className="btn btn-circle btn-ghost ml-4">
          <div className="indicator">
            <BellIcon className="h-6 w-6" />
            {noOfNotifications > 0 ? (
              <span className="badge indicator-item badge-secondary badge-sm">
                {noOfNotifications}
              </span>
            ) : null}
          </div>
        </button>
        <div className="dropdown dropdown-end ml-4">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
            <div className="w-10 rounded-full">
              <Image
                src="/empty-state.png"
                alt="profile"
                width={60}
                height={60}
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu-compact menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li className="justify-between">
              <Link href={"/profile"}>
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <div className="divider mb-0 mt-0"></div>
            <li>
              <div>
                <button className="" onClick={logout} disabled={loading}>
                  Sign Out
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
