import { BreadCrumb } from "primereact/breadcrumb";
import { MenuItem } from "primereact/menuitem";
import { Link } from "react-router-dom";

export const BreadComp = ({texto}) => {
    const items: MenuItem[] = [{ template: () => <Link to=""><span className="text-primary font-semibold">{texto}</span></Link> }];
    const home: MenuItem = {
        template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    }
    return (
        <BreadCrumb model={items} home={home} className="mb-3"/>
    );
}