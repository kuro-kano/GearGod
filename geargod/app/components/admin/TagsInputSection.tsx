"use client";
import { useState, useEffect } from "react";
import { Input, Button, Chip } from "@heroui/react";

interface TagsInputSectionProps {
  tagsList: string[]; // Changed from initialTags to match parent component
  onTagsChange: (tags: string[]) => void;
}

export default function TagsInputSection({
  tagsList, // Changed from initialTags
  onTagsChange,
}: TagsInputSectionProps) {
  const [tagInput, setTagInput] = useState("");
  const [localTagsList, setLocalTagsList] = useState<string[]>(tagsList);

  // Update local tags when prop changes
  useEffect(() => {
    setLocalTagsList(tagsList);
  }, [tagsList]);

  // Add tag to the list
  const handleAddTag = () => {
    if (tagInput.trim() && !localTagsList.includes(tagInput.trim())) {
      const newTagsList = [...localTagsList, tagInput.trim()];
      setLocalTagsList(newTagsList);
      onTagsChange(newTagsList);
      setTagInput("");
    }
  };

  // Remove tag from the list
  const handleRemoveTag = (tagToRemove: string) => {
    const newTagsList = localTagsList.filter((tag) => tag !== tagToRemove);
    setLocalTagsList(newTagsList);
    onTagsChange(newTagsList);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {localTagsList.map((tag, index) => (
          <Chip
            key={index}
            color="secondary"
            onClose={() => handleRemoveTag(tag)}
          >
            {tag}
          </Chip>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add a tag"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Button type="button" onPress={handleAddTag}>
          Add
        </Button>
      </div>
    </div>
  );
}
