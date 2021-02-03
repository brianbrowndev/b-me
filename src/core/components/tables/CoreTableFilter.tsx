import React, { useRef, Fragment, useState, useEffect } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { FormSchema } from "../forms/SchemaForm";
import { EditModalRef, EditModal } from "../forms/EditModal";
import { ObjectEntity } from "../forms/ObjectEntityType";

interface CoreTableFilterProps<T> {
  schema: FormSchema<T>;
  onFilter: (obj: T) => void;
}

export default function CoreTableFilter<T extends ObjectEntity>({
  schema,
  onFilter,
}: CoreTableFilterProps<T>) {
  const modalRef = useRef<EditModalRef>(null);

  const [isActive, setIsActive] = useState(false);

  function handleFilter() {
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  useEffect(() => {
    /**
     * Two states can be derived - Whether the filter is clear (no values) or a filter is applied (there is a value)
     * This function analyzes the object to determine the state
     * @param obj
     */
    const filterHasValue = (obj: T) => {
      let values = Object.values(obj);
      for (let v of values) {
        if (v !== null && v !== undefined) {
          if (typeof v === "string" && v !== "") {
            return true;
          } else if (typeof v === "number" || typeof v === "boolean") {
            return true;
          } else if (v instanceof Array && v.length > 0) {
            return true;
          } else if (Object.entries(v).length > 0 && v.constructor === Object) {
            return true;
          }
        }
      }
      return false;
    };
    setIsActive(filterHasValue(schema.object));
  }, [schema.object]);

  return (
    <Fragment>
      <Tooltip title="Filter list">
        <IconButton
          aria-label="filter list"
          onClick={handleFilter}
          color={isActive ? "secondary" : "default"}
        >
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      <EditModal
        ref={modalRef}
        schema={schema}
        onSaveSuccess={onFilter}
        saveText="Apply"
      />
    </Fragment>
  );
}
