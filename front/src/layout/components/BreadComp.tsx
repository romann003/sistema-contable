import { BreadCrumb } from "primereact/breadcrumb";
import { MenuItem } from "primereact/menuitem";
import { Link } from "react-router-dom";

export const BreadComp = ({texto, pre, valid}) => {
    if (valid) {
        return (
            <BreadCrumb model={[{ label: pre }, { template: () => <Link to=""><span className="text-primary font-semibold">{texto}</span></Link> }]} home={{ template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link> }} className="mb-3"/>
        );
    } else {
        return (
            <BreadCrumb model={[{ template: () => <Link to=""><span className="text-primary font-semibold">{texto}</span></Link> }]} home={{ template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link> }} className="mb-3"/>
        );
    }
    // const items: MenuItem[] = [valid && { label: pre }, { template: () => <Link to=""><span className="text-primary font-semibold">{texto}</span></Link> }];
    // const home: MenuItem = {
    //     template: () => <Link to="/dashboard"><span className="text-primary font-semibold">Inicio</span></Link>
    // }
    // return (
    //     <BreadCrumb model={items} home={home} className="mb-3"/>
    // );
}