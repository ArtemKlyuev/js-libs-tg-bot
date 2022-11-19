interface Props {
  label: string;
}

export const InputLabel = ({ label }: Props) => {
  return (
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
  );
};
