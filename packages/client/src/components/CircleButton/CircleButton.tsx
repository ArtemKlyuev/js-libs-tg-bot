interface Props {
  type?: 'button' | 'submit';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CircleButton = ({ type = 'button', onClick }: Props) => {
  return (
    <button type={type} onClick={onClick} className="btn btn-circle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};
