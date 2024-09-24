import ChartBox from "../../components/chartBox/ChartBox";
import TopBox from "../../components/topBox/TopBox";
import "./home.scss";
import {
  chartBoxUser,
  chartBoxRevenue,
  chartBoxConversion,
  chartBoxProduct,
  barChartBoxRevenue,
  barChartBoxVisit,
} from "../../data.ts";
import BarChartBox from "../../components/barChartBox/BarChartBox.tsx";
import PieChartBox from "../../components/pieChart/PieChartBox.tsx";
import BigChartBox from "../../components/bigChartBox/BigChartBox.tsx";

const Home = () => {
  return (
    <div className="home">
      <div className="box box-1">
        <TopBox />
      </div>
      <div className="box box-2">
        <ChartBox {...chartBoxUser} />
      </div>
      <div className="box box-3">
        <ChartBox {...chartBoxRevenue} />
      </div>
      <div className="box box-4">
        <PieChartBox />
      </div>
      <div className="box box-5">
        <ChartBox {...chartBoxProduct} />
      </div>
      <div className="box box-6">
        <ChartBox {...chartBoxConversion} />
      </div>
      <div className="box box-7">
        <BigChartBox />
      </div>
      <div className="box box-8">
        <BarChartBox {...barChartBoxVisit} />
      </div>
      <div className="box box-9">
        <BarChartBox {...barChartBoxRevenue} />
      </div>
    </div>
  );
};
export default Home;
