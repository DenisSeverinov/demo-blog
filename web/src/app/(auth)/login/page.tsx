import { LoginForm } from "@/ui/auth/login-form";
import { AuthCard } from "@/ui/auth/auth-card";

export default function LoginPage() {
	return (
		<AuthCard
			title="Sign in"
			linkHref="/register"
			linkText="Don't have an account? Sign up"
		>
			<LoginForm />
		</AuthCard>
	);
}
