import { HeaderClient } from "@/ui/header/header.client";
import { getUser } from "@/lib/api/session";

export default async function Header() {
	const user = await getUser();

	return <HeaderClient user={user} />;
}
