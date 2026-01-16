interface WindowsButtonProps {
  children: React.ReactNode;
  className?: string;
}

const WindowsButton: React.FC<WindowsButtonProps> = ({
  children,
  className = "",
}) => {
  return (
    <button
      className={`flex cursor-pointer justify-center h-6 items-center px-2 py-[2px] border border-[#F3F3F3] shadow-[0_0_0_1px_#707070] rounded-[3px] bg-gradient-to-b from-[#F2F2F2] via-[#EBEBEB] to-[#CFCFCF] text-[12px] text-black no-underline transition-all hover:border-[#ECF7FD] hover:shadow-[0_0_0_1px_#3C7FB1] hover:bg-gradient-to-b hover:from-[#EAF6FD] hover:via-[#D9F0FC] hover:to-[#A7D9F5] active:border-[#73A7C4] active:border-b-0 active:shadow-[0_0_0_1px_#2C628B] active:bg-gradient-to-b active:from-[#E5F4FC] active:via-[#C4E5F6] active:to-[#68B3DB] ${className}`}
    >
      {children}
    </button>
  );
};

export default WindowsButton;
