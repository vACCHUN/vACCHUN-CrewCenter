type EditModalHeaderProps = {
  children: React.ReactNode;
};

function EditModalHeader({ children }: EditModalHeaderProps) {
  return (
    <>
      <h1 className="text-3xl m-5">{children}</h1>
      <div className="w-full h-[2px] bg-slate-900"></div>
    </>
  );
}

export default EditModalHeader;
