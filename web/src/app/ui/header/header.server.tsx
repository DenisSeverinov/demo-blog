import { HeaderClient } from "@/app/ui/header/header.client";
import { getUser } from "@/app/lib/api/session";

export default async function Header() {
	const user = await getUser();

	return <HeaderClient user={user} />;
}
