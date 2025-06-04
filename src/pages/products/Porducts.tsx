import { useContext, useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { products } from "../../data";
import "./products.scss";
import { ThemeContext } from "../../utilities/context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
type ProductToBeUpdate = {
  img?: string;
  title?: string;
  prevPrice?: number;
  newPrice?: number;
  stock?: number;
  availableColors?: string[];
  availableSizes?: number[];
  brand?: string;
  category?: string;
}

const Products = () => {
  const [open, setOpen] = useState(false);
  const [operation, setOperation] = useState("add");
  const [id, setId] = useState<string | null>(null);
  const [productToBeUpdate, setProductToBeUpdate] = useState<ProductToBeUpdate | null>(null);
  const { theme } = useContext(ThemeContext);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => {
      return axios.delete(`http://localhost:3000/api/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`allusers`] })
    }
  })
  function handleDelete(id: number) {
    //delete api call
    mutation.mutate(id)
  }

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "img",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        return <img src={params.row.img || "/noavatar.png"} alt="" />;
      },
    },
    {
      field: "title",
      type: "string",
      headerName: "Title",
      width: 250,
    },
    {
      field: "ratings",
      headerName: "Avg Rating",
      width: 120,
      renderCell: (params) => {
        return <span>{params.row.ratings?.average?.toFixed(1) || "0.0"} ⭐</span>;
      },
    },

    {
      field: "reviews",
      headerName: "Reviews Count",
      width: 100,
      renderCell: (params) => {
        const reviews = params.row.reviews;
        if (!reviews || reviews.length === 0) return "No Reviews";

        return reviews.length;
      },
    },

    {
      field: "prevPrice",
      type: "number",
      headerName: "Prev Price",
      width: 100,
    },
    {
      field: "newPrice",
      type: "number",
      headerName: "New Price",
      width: 100,
    },
    {
      field: "stock",
      type: "number",
      headerName: "Stock",
      width: 100,
    },
    {
      field: "availableColors",
      type: "string",
      headerName: "Available Colors",
      width: 100,
    },
    {
      field: "availableSizes",
      type: "number",
      headerName: "Available Sizes",
      width: 100,
    },
    {
      field: "brand",
      headerName: "Brand",
      type: "string",
      width: 110,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      type: "string",
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params: GridRenderCellParams<any, Date>) => {
        return (
          <div className="action">
            <Link to={`/products/${params.row._id}`}>
              <img src="/info.svg" alt="" />
            </Link>
            <div className="delete" onClick={() => handleUpdate(params.row._id)}>
              <img src="/view.svg" alt="" />
            </div>
            <div className="delete" onClick={() => handleDelete(params.row._id)}>
              <img src="/delete.svg" alt="" />
            </div>
          </div>
        );
      },
    }
    // {
    //   field: "inStock",
    //   headerName: "In Stock",
    //   width: 150,
    //   type: "boolean",
    // },
  ];

  const { isPending, error, data } = useQuery({
    queryKey: ['allproducts'],
    queryFn: () =>
      fetch('http://localhost:3000/api/shoes').then((res) =>
        res.json(),
      ),
  })
  console.log(data?.data)
  function handleUpdate(id: number) {
    setId(id.toString());
    setOperation("update");
    setOpen(true);
    //filter data based on id
    const product = data?.data.find((product: any) => product._id === id);
    // product.availableSizes = product.availableSizes.join();
    console.log(product);
    setProductToBeUpdate(product || null);
  }

  return (
    <div className="products">
      <div className="info">
        <h1>Products</h1>
        <button
          className={
            theme === "light" ? "new-product-btn-light" : "new-product-btn-dark"
          }
          type="button"
          onClick={() => { setOpen(true); setOperation("add"); setId(null); setProductToBeUpdate(null); }}
        >
          Add New product
        </button>
      </div>
      {isPending && <h1>Loading...</h1>}
      {error?.message && <p>{error.message}</p>}
      <DataTable slug="products" rows={data?.data} columns={columns} />
      {open && <Add open={open} slug="shoes" columns={columns} setOpen={setOpen} id={id} operation={operation} productToBeUpdate={productToBeUpdate} />}
    </div>
  );
};

export default Products;
