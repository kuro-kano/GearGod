import { Chip } from '@heroui/react';

interface CategoryTagsProps {
  tags: string | null;
  categoryName?: string;
}

export default function CategoryTags({ tags, categoryName }: CategoryTagsProps) {
  // If no tags, just show category if available
  if (!tags && categoryName) {
    return <Chip color="primary">{categoryName}</Chip>;
  }
  
  // If no tags and no category, don't render anything
  if (!tags) return null;
  
  // Parse tags - assuming tags are stored as comma-separated strings
  const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  
  return (
    <div className="flex flex-wrap gap-2">
      {categoryName && (
        <Chip color="primary">{categoryName}</Chip>
      )}
      {tagList.map((tag, index) => (
        <Chip key={index} color="secondary">{tag}</Chip>
      ))}
    </div>
  );
}