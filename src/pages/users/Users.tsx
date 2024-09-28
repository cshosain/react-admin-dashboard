import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./user.scss";
import { userRows } from "../../data";
import { useContext, useState } from "react";
import Add from "../../components/add/Add";
import { ThemeContext } from "../../utilities/context";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "verified",
    headerName: "Status",
    width: 100,
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
    width: 110,
    editable: true,
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button
          className={
            theme === "light" ? "new-user-btn-light" : "new-user-btn-dark"
          }
          type="button"
          onClick={() => setOpen(true)}
        >
          Add New User
        </button>
      </div>
      <DataTable slug="users" rows={userRows} columns={columns} />
      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
