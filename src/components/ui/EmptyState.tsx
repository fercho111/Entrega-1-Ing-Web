type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="border rounded p-4 bg-light text-center">
      <h3 className="h5">{title}</h3>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
}
