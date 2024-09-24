import { Box } from "@mui/material";
import "./dataTable.scss";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";

type Props = {
  rows: object[];
  columns: GridColDef<object[][number]>[];
  slug: string;
};

const DataTable = (props: Props) => {
  function handleDelete(id: number) {
    //delete api call
    console.log(id + " To be delete");
  }

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return (
        <div className="action">
          <Link to={`/${props.slug}/${params.row.id}`}>
            <img src="/view.svg" alt="" />
          </Link>
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <Box sx={{ height: "auto", width: "100%" }}>
        <DataGrid
          className="dataGrid"
          rows={props.rows}
          columns={[...props.columns, actionColumn]}
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
