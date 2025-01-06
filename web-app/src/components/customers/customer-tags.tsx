export function CustomerTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span key={index} className="badge badge-primary">
          {tag}
        </span>
      ))}
    </div>
  );
}
