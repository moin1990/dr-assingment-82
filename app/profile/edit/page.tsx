import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import UpdateProfileForm from "@/components/UpdateProfileForm";

export const metadata: Metadata = {
  title: "Update Profile",
  description: "Update your name and profile photo.",
};

export default async function UpdateProfilePage() {
  /* Redirects to /login?callbackUrl=/profile/edit if unauthenticated */
  const session = await requireSession("/profile/edit");
  const user    = session.user;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200
                    flex items-start justify-center
                    px-4 md:px-8 pt-12 pb-20">
      <UpdateProfileForm
        initialName={user.name  ?? ""}
        initialImage={user.image ?? ""}
        email={user.email ?? ""}
      />
    </div>
  );
}
