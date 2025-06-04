import { Box } from "@mui/material";
import "./dataTable.scss";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type SingleRow = {
  _id: number;
  img: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  createdAt: string;
  verified: boolean;
}

type Props = {
  rows: SingleRow[];
  columns: GridColDef<SingleRow>[]
  slug: string;
};

const DataTable = (props: Props) => {
  const queryClient = useQueryClient()

  const formatedSlug = props.slug === "user" ? "generalUser" : "shoes";

  const mutation = useMutation({
    mutationFn: (id: number) => {
      return axios.delete(`http://localhost:3000/api/${formatedSlug}/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`all${props.slug}`] })
    }
  })

  function handleDelete(id: number) {
    //delete api call
    mutation.mutate(id)
  }

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return (
        <div className="action">
          <Link to={`/${props.slug}/${params.row._id}`}>
            <img src="/view.svg" alt="" />
          </Link>
          <div className="delete" onClick={() => handleDelete(params.row._id)}>
            <img src="/delete.svg" alt="" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <Box sx={{ height: "auto", width: "100%" }}>
        <DataGrid<SingleRow>
          className="dataGrid"
          rows={props.rows}
          getRowId={(row) => row?._id || Date.now()}
          columns={[...props.columns,]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 1000 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableDensitySelector
          disableColumnSelector
        />
      </Box>
    </div>
  );
};

export default DataTable;
