// NO "use client" here
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import Logout from "./logout";

export default async function Page() {
  await requireAuth()

  const data = await caller.getUsers()

  return (
    <>
      <div>
        Protected route
        {JSON.stringify(data)}
      </div>

      <Logout />
    </>
  );
}
