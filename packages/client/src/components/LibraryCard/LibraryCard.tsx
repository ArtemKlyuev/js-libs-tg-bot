interface Props {
  properties: { id: string; name: string; value: string }[];
  onClick?: () => void;
}

const isLink = (value: string): boolean => value.startsWith('https') || value.startsWith('http');

export const LibraryCard = ({ properties, onClick }: Props) => {
  return (
    <button type="button" onClick={onClick} className="card bg-neutral text-neutral-content">
      <div className="card-body gap-[15px]">
        {properties.map(({ id, name, value }) => (
          <div key={id} className="text-left">
            <span className="font-bold">{name}:</span>&nbsp;
            {isLink(value) ? (
              <a href={value} target="_blank" className="link">
                {value}
              </a>
            ) : (
              <span>{value}</span>
            )}
          </div>
        ))}
      </div>
    </button>
  );
};
