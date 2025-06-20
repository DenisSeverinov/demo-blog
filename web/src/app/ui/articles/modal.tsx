import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import FormInput from "../form-input";
import FormSelect from "../form-select";
import FormFileUpload from "../form-file-upload";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createArticleSchema } from "@/app/lib/schemas/article";
import { ARTICLE_TYPE_LABELS, ArticleType } from "@/types/article";
import type { TCreateArticleForm } from "@/types/article";
import { toaster } from "@/app/ui/toaster";
import { createArticle } from "@/app/lib/api/article/client";
import { useRouter } from "next/navigation";

type TArticleModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

const options = [
	{
		value: ArticleType.ANALYTICS,
		label: ARTICLE_TYPE_LABELS[ArticleType.ANALYTICS],
	},
	{
		value: ArticleType.NEWS,
		label: ARTICLE_TYPE_LABELS[ArticleType.NEWS],
	},
	{
		value: ArticleType.OTHER,
		label: ARTICLE_TYPE_LABELS[ArticleType.OTHER],
	},
];

export const ArticleModal = ({ isOpen, onClose }: TArticleModalProps) => {
	const { refresh } = useRouter();
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors },
	} = useForm<TCreateArticleForm>({
		resolver: zodResolver(createArticleSchema),
	});

	const onSubmit: SubmitHandler<TCreateArticleForm> = async (data) => {
		try {
			await createArticle(data);
			refresh();
			onClose();
			reset();
		} catch (error) {
			toaster.create({
				title: (error as Error).message ?? "Invalid credentials",
				type: "error",
			});
		}
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Create Article</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<form onSubmit={handleSubmit(onSubmit)} noValidate>
								<Box display="flex" flexDirection="column" gap="16px">
									<FormInput<TCreateArticleForm>
										label="Title"
										name="title"
										type="text"
										placeholder="Title"
										register={register}
										error={errors.title}
									/>
									<FormSelect<TCreateArticleForm>
										label="Type"
										name="type"
										placeholder="Select type"
										register={register}
										error={errors.type}
										options={options}
									/>
									<FormInput<TCreateArticleForm>
										label="Content"
										name="content"
										type="textarea"
										placeholder="Content"
										register={register}
										error={errors.content}
									/>
									<FormFileUpload<TCreateArticleForm>
										label="Preview Image"
										name="previewImage"
										accept="image/*"
										maxFiles={1}
										buttonText="Select Image"
										register={register}
										error={errors.previewImage}
									/>
								</Box>
								<Box
									display="flex"
									gap="8px"
									justifyContent="flex-end"
									mt="16px"
								>
									<Button variant="outline" onClick={onClose} type="button">
										Cancel
									</Button>
									<Button type="submit">Save</Button>
								</Box>
							</form>
						</Dialog.Body>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
