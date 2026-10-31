import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal";
import Navbar, { NavbarView } from "./Navbar";

/** Server wrapper that streams the signed-in user into the client Navbar. */
export default function SiteHeader() {
  return (
    <Suspense fallback={<NavbarView user={null} loading pathname="" />}>
      <HeaderWithUser />
    </Suspense>
  );
}

async function HeaderWithUser() {
  const user = await getCurrentUser();
  return <Navbar user={user && { firstName: user.firstName, lastName: user.lastName, plan: user.plan, isAdmin: user.isAdmin }} />;
}
