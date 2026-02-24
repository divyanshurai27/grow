import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { fetchapis } from "../api/apis";
import type { Data } from "../types/Datas";

const rowsPerPage = 12;

const Datatable = () => {
  const [data, setData] = useState<Data[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

 
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());


  const [targetSelectCount, setTargetSelectCount] = useState<number>(0);
  const [inputCount, setInputCount] = useState<number>(0);

  const overlayRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchapis(page, rowsPerPage);

        setData(response.data);
        setTotalRecords(response.pagination.total);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page]);

  
  useEffect(() => {
    if (targetSelectCount > 0) {
      const newSet = new Set(selectedIds);

      for (let row of data) {
        if (newSet.size < targetSelectCount) {
          newSet.add(row.id);
        }
      }

      setSelectedIds(newSet);
    }
  }, [data]);


  const handleSelectionChange = (e: any) => {
    const pageIds = data.map((row) => row.id);
    const newSet = new Set(selectedIds);

  
    pageIds.forEach((id) => newSet.delete(id));


    e.value.forEach((row: Data) => newSet.add(row.id));

    setSelectedIds(newSet);
  };

  
  const onPageChange = (event: any) => {
    const newPage = event.first / event.rows + 1;
    setPage(newPage);
  };


  const handleCustomSelect = () => {
    if (!inputCount || inputCount <= 0) return;

    setTargetSelectCount(inputCount);

  
    const newSet = new Set(selectedIds);

    for (let row of data) {
      if (newSet.size < inputCount) {
        newSet.add(row.id);
      }
    }

    setSelectedIds(newSet);

    overlayRef.current?.hide();
  };

 
  const customHeader = (
    <i
      className="pi pi-chevron-down"
      style={{ cursor: "pointer" }}
      onClick={(e) => overlayRef.current?.toggle(e)}
    ></i>
  );

  return (
    <div style={{ padding: "1rem" }}>
     

      <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
        Selected: {selectedIds.size} rows
      </div>

      {/* Overlay Panel */}
      <OverlayPanel ref={overlayRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontWeight: "bold" }}>
            Select Multiple Rows
          </div>

          <div>Enter number of rows to select across all pages</div>

          <InputNumber
            value={inputCount}
            onValueChange={(e) => setInputCount(e.value || 0)}
            placeholder="e.g., 20"
          />

          <Button label="Select" onClick={handleCustomSelect} />
        </div>
      </OverlayPanel>

      <DataTable
        value={data}
        lazy
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecords}
        first={(page - 1) * rowsPerPage}
        onPage={onPageChange}
        loading={loading}
        dataKey="id"
        selectionMode="checkbox"
        selection={data.filter((row) => selectedIds.has(row.id))}
        onSelectionChange={handleSelectionChange}
      >
        <Column selectionMode="multiple" header={customHeader} />
        <Column field="title" header="TITLE" />
        <Column field="place_of_origin" header="PLACE OF ORIGIN" />
        <Column field="artist_display" header="ARTIST" />
        <Column field="inscriptions" header="INSCRIPTIONS" />
        <Column field="date_start" header="START DATE" />
        <Column field="date_end" header="END DATE" />
      </DataTable>
    </div>
  );
};

export default Datatable;