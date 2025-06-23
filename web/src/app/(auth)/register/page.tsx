import { RegisterForm } from "@/ui/auth/register-form";
import { AuthCard } from "@/ui/auth/auth-card";

export default function RegisterPage() {
	return (
		<AuthCard
			title="Sign up"
			linkHref="/login"
			linkText="Already have an account? Sign in"
		>
			<RegisterForm />
		</AuthCard>
	);
}
