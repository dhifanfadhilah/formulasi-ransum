import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from "recharts";
import { fetchBahanPakanStats } from "../../services/adminApi";

const GrafikKategori = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="text-base font-semibold text-green-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, left: 60, right: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            dataKey="nama"
            type="category"
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#16a34a" barSize={20}>
            <LabelList dataKey="jumlah" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const GrafikBahanPakan = () => {
  const [dataByKategori, setDataByKategori] = useState({
    energi: [],
    protein: [],
    mineral: [],
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const result = await fetchBahanPakanStats();

        // Pisahkan data berdasarkan kategori
        const kategoriData = {
          energi: [],
          protein: [],
          mineral: [],
        };

        result.forEach((item) => {
          const kategori = item.kategori.toLowerCase();
          if (kategori.includes("energi")) {
            kategoriData.energi.push(item);
          } else if (kategori.includes("protein")) {
            kategoriData.protein.push(item);
          } else if (kategori.includes("mineral") || kategori.includes("premix")) {
            kategoriData.mineral.push(item);
          }
        });

        setDataByKategori(kategoriData);
      } catch (error) {
        console.error("Gagal memuat statistik bahan pakan:", error);
      }
    };

    getStats();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GrafikKategori title="Kategori Energi" data={dataByKategori.energi} />
      <GrafikKategori title="Kategori Protein" data={dataByKategori.protein} />
      <GrafikKategori title="Kategori Mineral & Premix" data={dataByKategori.mineral} />
    </div>
  );
};

export default GrafikBahanPakan;
