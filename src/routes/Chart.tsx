import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
interface ChartProps {
  coinId: string;
}
interface IData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}
function Chart() {
  const { coinId } = useOutletContext<ChartProps>();
  const { isLoading, data } = useQuery<IData[]>(
    ["price in chart", coinId],
    () => fetchCoinHistory(coinId)
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          options={{
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            theme: {
              mode: "dark",
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            grid: { show: false },
            yaxis: { show: false },
            xaxis: {
              labels: { show: false },
              axisTicks: { show: false },
              axisBorder: { show: false },
              categories: data?.slice(0, 14).map((price) => price.time_close),
              type: "datetime",
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#05c46b"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(2)}`,
              },
              x: {
                format: "dd MMM",
              },
            },
          }}
          series={[
            {
              name: "closing price",
              data:
                data?.slice(0, 14).map((price) => Number(price.close)) ?? [],
            },
          ]}
        />
      )}
    </div>
  );
}

export default Chart;
