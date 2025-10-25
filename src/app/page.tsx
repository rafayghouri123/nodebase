import {Button} from "@/components/ui/button";
import prisma from "@/lib/database";
export default function Page() {

  const users = prisma.user.findMany();

  return (
    <div>
      <h1 className="text-red-500">Welcome home</h1>
      {JSON.stringify(users)}
    </div>
  );
}
