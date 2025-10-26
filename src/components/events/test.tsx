import React, { useEffect, useState } from "react";

const Test = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  useEffect(() => {
    fetch(
      "https://fz-backoffice.linooxel.com/api/venues/branch?name__icontains=cafe&status=a&page=1&page_size=20&order_by=-created_at",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json.results);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    alert(`ID شعبه انتخاب شده: ${branchId}`);
  };

  return (
    <div>
      <h2>انتخاب شعبه:</h2>
      <select value={selectedBranch} onChange={handleSelect}>
        <option value="">-- انتخاب کنید --</option>
        {data.map((item) => (
          <option key={item.pk} value={item.pk}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Test;
