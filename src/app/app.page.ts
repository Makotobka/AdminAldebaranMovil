import { HomePage } from "../pages/home/home";
import { MyApp } from "./app.component";
import { LoginPage } from "../pages/login/login";
import { DashboardGeneralPage } from "../pages/dashboard-general/dashboard-general";
import { CajaPage } from "../pages/caja/caja";
import { DetalleCajaPage } from "../pages/detalle-caja/detalle-caja";
import { FacturasPage } from "../pages/facturas/facturas";
import { ConfiguracionPage } from "../pages/configuracion/configuracion";
import { StockPage } from "../pages/stock/stock";
import { ListaDeudaPage } from "../pages/lista-deuda/lista-deuda";
import { DetalleDeudaClientePage } from "../pages/detalle-deuda-cliente/detalle-deuda-cliente";
import { FacturaComparacionPage } from "../pages/factura-comparacion/factura-comparacion";
import { FacturaTopPage } from "../pages/factura-top/factura-top";

export const paginas = [
    MyApp,
    HomePage,
    LoginPage,
    DashboardGeneralPage,
    CajaPage,
    DetalleCajaPage,
    FacturasPage,
    FacturaComparacionPage,
    FacturaTopPage,
    ConfiguracionPage,
    StockPage,
    ListaDeudaPage,
    DetalleDeudaClientePage
];