import { addToast, cn } from "@heroui/react";

// Toast configuration interface
export interface ToastOptions {
    title?: string;
    description?: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    color?: "primary" | "success" | "warning" | "danger";
    className?: string;
}

// Reusable toast function
export const showToast = ({
    title = "Successful!",
    description = "Operation completed successfully.",
    color = "primary",
    className,
}: ToastOptions) => {
    addToast({
        title,
        description,
        classNames: {
            base: cn([
                "bg-default-50 dark:bg-background shadow-sm",
                "border-1",
                "relative before:content-[''] before:absolute before:z-10",
                "before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1",
                "rounded-l-none border-l-0",
                "min-w-[350px]",
                "rounded-md",
                "flex flex-col items-start",
                `before:bg-${color} border-${color}-200 dark:border-${color}-100`,
                className,
            ]),
            icon: "w-6 h-6 fill-current",
        },
        color,
    });
};