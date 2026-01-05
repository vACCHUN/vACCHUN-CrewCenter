import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AFTNLogin() {
  const navigate = useNavigate();

  const isElectron = window.env?.isElectron === true;

  const [pendingToken, setPendingToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
    if (!accessToken) return;

    if (!isElectron) {
      setPendingToken(accessToken);
    } else {
      navigate("/aftn");
    }
  }, []);

  const login = () => {
    window.location.href = `aftn://auth?token=${pendingToken}`;
  };

  return (
    <>
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <h1 className="mb-4 text-4xl text-blue-900">Langord AFTN terminál</h1>
        <button className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={login}>
          Login with Crew Center
        </button>
      </div>
    </>
  );
}

export default AFTNLogin;
