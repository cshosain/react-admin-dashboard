import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { FormEvent, FormEventHandler, useContext } from "react";
import { ThemeContext } from "../../utilities/context";

type Props = {
  slug: string;
  columns: GridColDef<object[][number]>[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Add = (props: Props) => {
  const { theme } = useContext(ThemeContext);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    // Extract the FormEvent
    const formEvent = event as FormEvent<HTMLFormElement>;

    // Call preventDefault on the extracted event
    formEvent.preventDefault();

    // Rest of your form submission logic
  };

  return (
    <div className="add">
      <div className={theme === "light" ? "modal modal-light" : "modal"}>
        <h1>Add New</h1>
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter(
              (item) =>
                item.field !== "id" &&
                item.field !== "img" &&
                item.field !== "fullName"
            )
            .map((column) => (
              <div className="item" key={column.field}>
                <label htmlFor="">{column.headerName}</label>
                <input type={column.type} placeholder={column.field} />
              </div>
            ))}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
