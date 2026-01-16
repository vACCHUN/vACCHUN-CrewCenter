type LoadingProps = {
  message: string;
  isFixed?: boolean;
};

export default function Loading({ message, isFixed = true }: LoadingProps) {
  return (
    <div
      className={`h-full w-full ${isFixed ? "fixed" : ""} flex justify-center items-center flex-col`}
    >
      <i className="fa-solid fa-spinner animate-spin text-3xl"></i>
      <p>{message ? message : ""}</p>
    </div>
  );
}
