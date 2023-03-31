import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Table,
  Form,
  Offcanvas,
  Container,
  Stack,
} from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { ButtonDevolver, ButtonVender } from "../botones/ButtonsUpdateEstado";
import ViewProductsModal from "../botones/ViewProductsModal";
import { MdFilterAlt } from "react-icons/md";
import "../stock/tablaStock.css"
import { getProducts, productsSelectors } from "../../store/slices/products"; 
import { useDispatch,useSelector } from "react-redux";  



const TablaStock = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const productos= useSelector(productsSelectors.selectAll)   //aca traigo el state list(lo renombro como productos) y con use selector lo actualizo al estado products
  const dispatch=useDispatch() //esta funcion va ejeutar la funcion getProducts

    useEffect(() => {
      dispatch(getProducts())
    }, [dispatch])



 

  const columns = useMemo(
    () => [
      { Header: "CODIGO", accessor: "codigo" },
      { Header: "PRENDA", accessor: "prenda" },
      { Header: "MARCA", accessor: "marca" },
      { Header: "CATEGORIA", accessor: "categoria" },
      {
        Header: "TALLE",
        accessor: (t) => (
          <>
            {t.talle
              ? t.talle
              : t.prenda.includes("TALLE")
              ? t.prenda.substring(t.prenda.length - 8).substring(6)
              : null}
          </>
        ),
      },
      { Header: "CLIENTE", accessor: "cliente" },
      // {
      //   Header: "FECHA DE INGRESO",
      //   accessor: "fechaIngreso",
      //   Cell: ({ value }) => <>{value.substring(0, 10)}</>,
      // },
      {
        Header: "PRECIO DE VENTA",
        accessor: (p) => `$ ${p.precioVenta}`,
        id: "precio",
      },
      {
        Header: "GANANCIA CLIENTE",
        accessor: (d) => `$ ${Math.ceil(d.precioVenta * 0.7)}`,
        id: "ganancia",
      },
      {
        Header: "GANCANIA FERNANDEZ SHOP",
        accessor: (d) => `$ ${Math.ceil(d.precioVenta * 0.3)}`,
      },
      { Header: "ESTADO", accessor: "estado" },
      // { Header: "TIEMPO EN VENTA", accessor: "_id" },
      {
        Header: "VENDIDO",
        accessor: (p) => (
          <>
            {" "}
            {p.estado === "vendido" ? (
              <ButtonDevolver _id={p._id} />
            ) : (
              <ButtonVender _id={p._id}   />
            )}{" "}
          </>
        ),
      },
      {
        Header: "Ver Producto",
        accessor: (p) => (
          <>
            <ViewProductsModal producto={p} _id={p._id} />
          </>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data:productos,
      autoResetHiddenColumns: false, //  <-- stops the rerendering
      autoResetSortBy: false, //  <-- stops the rerendering
      initialState: { pageSize: 50 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    canPreviousPage,
    canNextPage,
    getTableProps, //funcion que nos devuelve las propiedades que va a recibir la etiqueta table
    getTableBodyProps,
    getCellProps,
    headerGroups, //array que contiene cada uno d elos grupos del header
    footerGroups,
    // rows, //array que contiene lo que va en cada fila (la data)
    page,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    nextPage,
    previousPage,
    pageOptions,
    gotoPage,
    pageCount,
    state,
    setPageSize,
    allColumns,
    getToggleHideAllColumnsProps,
  } = tableInstance;
  const { pageIndex, pageSize } = state;



  return (
    <>
    <Stack direction="horizontal">
      <Container className="div-titulo">
    <h2 className="justify-content-center">Tabla de stock</h2>

      </Container>
    
      <Stack direction="vertical" className="div-buscador-filtros">
    <div className="div-buscador ">
        <b className="m-1"> Buscar: </b> 
        <br/>
        <input
          type="text"
          value={state.globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="selectInput-paginacion"
        ></input>
      </div>
      
     
      <Container className=" container-filtro">
        <Button
          variant="dark"
          onClick={handleShow}
          className="boton-filtros"
          size="sm"
        >
          Columnas <MdFilterAlt />
        </Button>

        <Offcanvas show={show} onHide={handleClose} placement="bottom"  className="offcanvasFiltros">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filtro columnas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div>
              <Form.Check
                type="checkbox"
                label={"Toggle All"}
                {...getToggleHideAllColumnsProps()}
              />
            </div>

            <div>
              {allColumns.map((column) => (
                <div key={column.id}>
                  <label>
                    <input type="checkbox" {...column.getToggleHiddenProps()} />
                    {column.Header}
                  </label>
                </div>
              ))}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
      </Stack>
   
    </Stack>
      <Table striped bordered hover className="container mb-4 tablaStock"  size="xs"
          responsive="xl"{...getTableProps}>
        <thead>
          {/* Loop over the header rows */}
          {headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {
                      // Render the header
                      column.render("Header")
                    }
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))
              }
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Container className="container-paginacion">

        <Button variant="dark" size="sm" className="mx-2" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </Button>
        <Button variant="dark" size="sm" className="mx-2" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </Button>
    
        <input
          type="number"
          value={pageIndex + 1}
          min={1}
          max={pageCount}
          onChange={(e) => {
            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(pageNumber);
          }}
          className="mx-2 justify-content-center selectInput-paginacion"
          
        />
       {"  "} of {"  "} {pageOptions.length}

        <Button variant="dark" size="sm" className="mx-2" onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </Button>
        <Button variant="dark" size="sm" className="mx-2" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </Button>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="selectInput-paginacion"
        >
          {[25, 50, 75, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </Container>
    </>
  )
  ;
};

export default TablaStock;
