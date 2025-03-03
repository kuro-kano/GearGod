import { Chip } from "@heroui/react";

interface ProductCategoryChipProps {
    label: string;
    classNames?: {
        base?: string;
        content?: string;
    };
    variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
    onClick?: () => void;
    className?: string;
}

export default function ProductCategoryChip({
    label = "HyperX",
    classNames,
    variant,
    onClick,
    className,
}: ProductCategoryChipProps) {
    return (
        <Chip 
            classNames={classNames}
            variant={variant}
            onClick={onClick} 
            className={className}
        >
            {label}
        </Chip>
    );
}
