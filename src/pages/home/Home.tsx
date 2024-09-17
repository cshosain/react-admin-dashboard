import ChartBox from "../../components/chartBox/ChartBox";
import TopBox from "../../components/topBox/TopBox";
import "./home.scss";
import {
  chartBoxUser,
  chartBoxRevenue,
  chartBoxConversion,
  chartBoxProduct,
} from "../../data.ts";

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
      <div className="box box-4">box4</div>
      <div className="box box-5">
        <ChartBox {...chartBoxProduct} />
      </div>
      <div className="box box-6">
        <ChartBox {...chartBoxConversion} />
      </div>
      <div className="box box-7">box7</div>
      <div className="box box-8">box8</div>
      <div className="box box-9">box9</div>
    </div>
  );
};
export default Home;
