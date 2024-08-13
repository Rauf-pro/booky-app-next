"use client";

import { redirect, usePathname } from "next/navigation";

const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Restaurant",
    path: "#",
  },
  {
    name: "Pool",
    path: "#",
  },
  {
    name: "Best deals",
    path: "#",
  },
  {
    name: "Contact",
    path: "#",
  },
];

const Nav = ({ isUserAuthenticated }: { isUserAuthenticated: boolean }) => {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="flex flex-col lg:flex-row gap-6  ">
        {links.map((link, index) => {
          return (
            <li key={index}>
              <a
                href={link.path}
                className="font-bold text-[13px] uppercase tracking-[3px] hover:text-accent-hover transition-all "
              >
                {link.name}
              </a>
            </li>
          );
        })}
      </ul>

      {/* redirecting to the homepage if the user is not authenticated and path name 
        and pathname is /dashboard  */}
      {!isUserAuthenticated && pathname === "/dashboard" && redirect("/")}
    </nav>
  );
};

export default Nav;
