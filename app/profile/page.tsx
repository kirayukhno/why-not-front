import { redirect } from "next/navigation";
import { serverUserService } from "@/lib/api/serverApi";

export default async function ProfilePage() {
  const currentUser = await serverUserService.getCurrentUser();

  if (!currentUser?.data?._id) {
    redirect("/sign-in");
  }

  redirect(`/profile/${currentUser.data._id}`);
}