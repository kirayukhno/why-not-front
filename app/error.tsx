"use client";

type Props = {
  error: Error;
};

const Error = ({ error }: Props) => {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
    </div>
  );
};

export default Error;