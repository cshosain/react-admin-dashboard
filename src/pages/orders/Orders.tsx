import { useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import OrderDetailsPopup from "../../components/orderDetailsPopup/OrderDetailsPopup.tsx";
import axios from "axios";
import "./orders.scss";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusOptions = [
  "Pending",
  "Prepare",
  "Pack",
  "BoxCheck",
  "Delivered",
  "Canceled",
];

const Orders = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "Order ID", width: 180 },
    {
      field: "customer",
      headerName: "Customer",
      width: 180,
      renderCell: (params: any) =>
        `${params.row.shippingInformation?.firstName || ""} ${params.row.shippingInformation?.lastName || ""}`,
    },
    {
      field: "paymentMethod",
      headerName: "Payment",
      width: 120,
      renderCell: (params: any) => params.row.paymentMethod?.methodName?.toUpperCase(),
    },
    {
      field: "payStatus",
      headerName: "Paid",
      width: 80,
      renderCell: (params: any) =>
        params.row.paymentMethod?.payStatus ? (
          <span style={{ color: "green" }}>Yes</span>
        ) : (
          <span style={{ color: "red" }}>No</span>
        ),
    },
    {
      field: "totalAmount",
      headerName: "Total",
      width: 100,
      renderCell: (params: any) => `$${params.row.totalAmount}`,
    },
    {
      field: "itemsCount",
      headerName: "Items",
      width: 80,
      renderCell: (params: any) => params.row.items?.length || 0,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => (
        <span
          style={{
            color:
              params.row.status === "Canceled"
                ? "red"
                : params.row.status === "Delivered"
                  ? "green"
                  : "#555",
            fontWeight: 600,
          }}
        >
          {params.row.status}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      width: 140,
      renderCell: (params: any) =>
        new Date(params.row.createdAt).toLocaleDateString(),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params: any) => (
        <button
          className="view-btn"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(params.row);
            setOpenPopup(true);
          }}
        >
          View
        </button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["allorders"],
    queryFn: async () => {
      const token = localStorage.getItem("jsonwebtoken");
      const res = await fetch(`${BASE_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
  });

  // Handle status update (to be called from popup)
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("jsonwebtoken");
    await axios.put(
      `${BASE_URL}/api/admin/orders/status/${orderId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setOpenPopup(false);
    setSelectedOrder(null);
    refetch();
  };

  return (
    <div className="products">
      <div className="info">
        <h1>Orders</h1>
      </div>
      {isPending && <h1>Loading...</h1>}
      {error?.message && <p>{error.message}</p>}
      {data?.data && (
        <DataTable
          slug="orders"
          rows={data?.data}
          columns={columns}

        />
      )}
      {openPopup && selectedOrder && (
        <OrderDetailsPopup
          open={openPopup}
          order={selectedOrder}
          onClose={() => setOpenPopup(false)}
          onStatusChange={handleStatusUpdate}
          statusOptions={statusOptions}
        />
      )}
    </div>
  );
};

export default Orders;
