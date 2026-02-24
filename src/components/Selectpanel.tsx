import { useState } from "react";

interface Props {
  setGCount: React.Dispatch<React.SetStateAction<number>>;
}

const Selectpanel = ({ setGCount }: Props) => {
  const [count, setCount] = useState("");

  const handleSelect = () => {
    const num = parseInt(count);
    if (!num || num <= 0) return;

    setGCount(num);
    setCount("");
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="number"
        placeholder="Select rows (e.g. 25)"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button onClick={handleSelect}>Apply</button>
    </div>
  );
};

export default Selectpanel;