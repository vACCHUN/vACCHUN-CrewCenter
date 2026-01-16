type EditModalProps = {
  children: React.ReactNode;
};

function EditModal({ children }: EditModalProps) {
  return (
    <div className="fixed w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor bg-opacity-50 z-50">
      <div className="bg-white max-w-[700px]">{children}</div>
    </div>
  );
}

export default EditModal;
