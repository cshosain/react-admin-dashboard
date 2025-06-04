import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { FormEvent, useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../utilities/context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

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

type Props = {
  slug: string;
  columns: GridColDef<any>[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  operation: string;
  id: string | null;
  productToBeUpdate: ProductToBeUpdate | null;
};

const Add = ({ slug, columns, setOpen, open, operation, id, productToBeUpdate }: Props) => {
  const { theme } = useContext(ThemeContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Close function that waits for animation to finish
  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  let mutation;
  const token = localStorage.getItem("jsonwebtoken");

  if (operation === "update") {
    mutation = useMutation({
      mutationFn: (newData: any) =>
        axios.put(
          `http://localhost:3000/api/${slug}/update/${id}`,
          JSON.stringify(newData),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`all${slug}s`] });
      },
    });

  }
  else {
    mutation = useMutation({
      mutationFn: (newData: any) =>
        axios.post(
          `http://localhost:3000/api/${slug}/add`,
          JSON.stringify(newData),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`all${slug}s`] });
      },
    });
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(formData);
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="add"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            className={theme === "light" ? "modal modal-light" : "modal"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1>{operation === 'add' ? "Add A New" : "Update A"} {slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
            <span className="close" onClick={handleClose}>
              X
            </span>
            <form onSubmit={handleSubmit}>
              {columns
                .filter((item) =>
                  item.field !== "_id" &&
                  item.field !== "createdAt" &&
                  item.field !== "fullName" &&
                  item.field !== "action" &&
                  item.field !== "ratings" &&
                  item.field !== "reviews" &&
                  item.field !== "availableSizes" &&
                  item.field !== "availableColors"
                )
                .map((column) =>
                  <div className="item" key={column.field}>
                    <label htmlFor={column.field}>{column.headerName}</label>
                    <input
                      type={column.type || "text"}
                      name={column.field}
                      placeholder={column.field}
                      value={
                        formData[column.field] ??
                        (productToBeUpdate?.[column.field as keyof ProductToBeUpdate] ?? "")
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                )}
              <div className="colors-sizes">
                <div className="item">
                  <label htmlFor="availableSizes">Available Sizes</label>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]} // No predefined options
                    value={
                      formData.availableSizes ??
                      (productToBeUpdate?.availableSizes ?? [])
                    }
                    onChange={(e, value) => {
                      setFormData((prev) => ({
                        ...prev,
                        availableSizes: value
                          .map((v) => Number(v))
                          .filter((v, i, arr) => !isNaN(v) && arr.indexOf(v) === i),
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Available Sizes" placeholder="Type a size and press Enter" />
                    )}
                  />
                </div>
                <div className="item">
                  <label htmlFor="availableColors">Available Colors</label>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]} // No predefined options
                    value={
                      formData.availableColors ??
                      (productToBeUpdate?.availableColors ?? [])
                    }
                    onChange={(e, value) => {
                      setFormData((prev) => ({
                        ...prev,
                        availableColors: value
                          .map((v) => String(v).trim())
                          .filter((v, i, arr) => v && arr.indexOf(v) === i),
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Available Colors" placeholder="Type a color and press Enter" />
                    )}
                  />
                </div>
              </div>
              <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Add;
