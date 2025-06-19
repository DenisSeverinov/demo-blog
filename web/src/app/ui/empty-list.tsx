import { EmptyState, VStack } from "@chakra-ui/react";

type TEmptyListProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
};

export const EmptyList = ({ icon, title, description }: TEmptyListProps) => {
	return (
		<EmptyState.Root>
			<EmptyState.Content>
				<EmptyState.Indicator>{icon}</EmptyState.Indicator>
				<VStack textAlign="center">
					<EmptyState.Title>{title}</EmptyState.Title>
					<EmptyState.Description>{description}</EmptyState.Description>
				</VStack>
			</EmptyState.Content>
		</EmptyState.Root>
	);
};
