import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./user.scss";
// import { userRows } from "../../data";
// import { useContext, useState } from "react";
// import Add from "../../components/add/Add";
// import { ThemeContext } from "../../utilities/context";
import { useQuery } from "@tanstack/react-query";

const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", width: 90, type: "number" },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "is_active",
    headerName: "Status",
    width: 100,
    type: "boolean",
  },
  {
    field: "orders",
    headerName: "Orders",
    renderCell: (params) => {
      return (
        <div className="orders">
          {params.row.orders?.length > 0 ? (
            params.row.orders.map((order: any) => (
              <span key={order._id} className="order">
                {order._id}
              </span>
            ))
          ) : (
            <span className="no-orders">No Orders</span>
          )}
        </div>
      )
    },
    width: 200,
    type: "boolean",
  },
  // {
  //   field: "action",
  //   headerName: "Action",
  //   width: 150,
  //   renderCell: (params) => {
  //     return (
  //       <div className="action">
  //         <div className="view">view</div>
  //         <div className="delete">delete</div>
  //       </div>
  //     );
  //   },
  // },
  {
    field: "firstName",
    headerName: "First name",
    type: "string",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    type: "string",
    width: 150,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    type: "string",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
  {
    field: "email",
    headerName: "Email",
    type: "string",
    width: 200,
    editable: true,
  },
  {
    field: "phone",
    headerName: "Phone",
    type: "string",
    width: 200,
    editable: true,
  },
  {
    field: "createdAt",
    headerName: "createdAt",
    type: "string",
    width: 160,
    editable: true,
  },
];

const Users = () => {
  // const [open, setOpen] = useState(false);
  // const { theme } = useContext(ThemeContext);

  const { isPending, error, data } = useQuery({
    queryKey: ['allusers'],
    queryFn: () =>
      fetch('http://localhost:3000/api/user').then((res) =>
        res.json(),
      ),
  })
  console.log(data?.data)

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        {/* <button
          className={
            theme === "light" ? "new-user-btn-light" : "new-user-btn-dark"
          }
          type="button"
          onClick={() => setOpen(true)}
        >
          Add New User
        </button> */}
      </div>
      {isPending && <h1>Loading...</h1>}
      {error?.message && <p>{error.message}</p>}
      <DataTable slug="users" rows={data?.data} columns={columns.filter((item) => (item.field !== "firstName" && item.field !== "lastName"))} />
      {/* {open && <Add open={open} slug="user" columns={columns} setOpen={setOpen} />} */}
    </div>
  );
};

export default Users;
