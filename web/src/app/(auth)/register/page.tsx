import RegisterForm from "@/app/ui/auth/register-form";
import AuthCard from "@/app/ui/auth/auth-card";

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
