import {
  Legend,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import "./single.scss";
import { useContext } from "react";
import { ThemeContext } from "../../utilities/context";

type Props = {
  id: number;
  img?: string;
  title: string;
  info: object;
  chart?: {
    dataKeys: { name: string; color: string }[];
    data: object[];
  };
  activities?: { time: string; text: string }[];
};

const Single = (props: Props) => {
  const { theme } = useContext(ThemeContext);

  // const updateBtnStyle = {
  //   backgroundColor: "",
  //   color: "",
  // };
  // if (theme === "light") {
  //   (updateBtnStyle.backgroundColor = "#123456"),
  //     (updateBtnStyle.color = "white");
  // } else {
  //   (updateBtnStyle.backgroundColor = "white"),
  //     (updateBtnStyle.color = "#123456");
  // }

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            {props.img && <img src={props.img} alt="" />}
            <h1>{props.title}</h1>
            <button
              className={
                theme === "light" ? "update-btn-light" : "update-btn-dark"
              }
            >
              Update
            </button>
          </div>
          <div className="details">
            {Object.entries(props.info).map((item) => (
              <div className="item" key={item[0]}>
                <span className="itemTitle">{item[0]}</span>
                <span className="itemValue">{item[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <hr />
        {props.chart && (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={props.chart.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {props.chart.dataKeys.map((dataKey) => (
                  <Line
                    key={dataKey.name}
                    type="monotone"
                    dataKey={dataKey.name}
                    stroke={
                      theme === "dark"
                        ? dataKey.color
                        : dataKey.name === "visits"
                          ? "#002c58"
                          : "#00b31b"
                    }
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="activities">
        <h2>Latest Activities</h2>
        {props.activities && (
          <ul>
            {props.activities.map((activity) => (
              <li key={activity.text + activity.time}>
                <div
                  style={{
                    backgroundColor:
                      theme === "light"
                        ? "rgba(244, 91, 104, 0.15)"
                        : "#f45b6810",
                  }}
                >
                  <p>{activity.text}</p>
                  <time>{activity.time}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Single;
