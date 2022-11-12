interface Props {
  properties: { id: string; name: string; value: string | number }[];
  onClick?: () => void;
}

export const LibraryCard = ({ properties, onClick }: Props) => {
  return (
    <button type="button" onClick={onClick} className="card bg-neutral text-neutral-content">
      <div className="card-body gap-[15px]">
        {properties.map(({ id, name, value }) => (
          <div key={id} className="text-left">
            <span className="font-bold">{name}:</span>&nbsp;<span>{value}</span>
          </div>
        ))}
      </div>
    </button>
  );
};
