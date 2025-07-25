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
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-1"
      >
        <TopBox />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-2"
      >
        <ChartBox {...chartBoxUser} />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-3"
      >
        <ChartBox {...chartBoxRevenue} />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-4"
      >
        <PieChartBox />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-5"
      >
        <ChartBox {...chartBoxProduct} />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-6"
      >
        <ChartBox {...chartBoxConversion} />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-7"
      >
        <BigChartBox />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-8"
      >
        <BarChartBox {...barChartBoxVisit} />
      </div>
      <div
        style={
          {
            // border:
            //   theme != "light"
            //     ? "1px solid #384256"
            //     : "1px solid rgb(110 116 129)",
          }
        }
        className="box box-9"
      >
        <BarChartBox {...barChartBoxRevenue} />
      </div>
    </div>
  );
};
export default Home;
