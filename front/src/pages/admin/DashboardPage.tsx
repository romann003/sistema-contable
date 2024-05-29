import { Menu } from 'primereact/menu';
import { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';

import { OrganizationChart } from 'primereact/organizationchart';
import { TreeNode } from 'primereact/treenode';
import * as t from "../../layout/components/Tarjeta.tsx"
import { useNominaDatos } from '../../api/context/nominaDatosContext';



const DashboardPage = () => {
    // const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    // const { layoutConfig } = useContext(LayoutContext);

    // const applyLightTheme = () => {
    //     const lineOptions: ChartOptions = {
    //         plugins: {
    //             legend: {
    //                 labels: {
    //                     color: '#495057'
    //                 }
    //             }
    //         },
    //         scales: {
    //             x: {
    //                 ticks: {
    //                     color: '#495057'
    //                 },
    //                 grid: {
    //                     color: '#ebedef'
    //                 }
    //             },
    //             y: {
    //                 ticks: {
    //                     color: '#495057'
    //                 },
    //                 grid: {
    //                     color: '#ebedef'
    //                 }
    //             }
    //         }
    //     };

    //     setLineOptions(lineOptions);
    // };

    // const applyDarkTheme = () => {
    //     const lineOptions = {
    //         plugins: {
    //             legend: {
    //                 labels: {
    //                     color: '#ebedef'
    //                 }
    //             }
    //         },
    //         scales: {
    //             x: {
    //                 ticks: {
    //                     color: '#ebedef'
    //                 },
    //                 grid: {
    //                     color: 'rgba(160, 167, 181, .3)'
    //                 }
    //             },
    //             y: {
    //                 ticks: {
    //                     color: '#ebedef'
    //                 },
    //                 grid: {
    //                     color: 'rgba(160, 167, 181, .3)'
    //                 }
    //             }
    //         }
    //     };

    //     setLineOptions(lineOptions);
    // };

    // useEffect(() => {
    //     if (layoutConfig.colorScheme === 'light') {
    //         applyLightTheme();
    //     } else {
    //         applyDarkTheme();
    //     }
    // }, [layoutConfig.colorScheme]);

    const { totales, getTotales } = useNominaDatos();
    const [selection, setSelection] = useState<TreeNode[]>([]);
    const [data] = useState<TreeNode[]>([
        {
            expanded: true,
            type: 'person',
            data: {
                image: '/images/logos/umg.svg',
                name: 'Scarleth Marroquín / 20-24300',
                title: 'P.O'
            },
            children: [
                {
                    expanded: true,
                    type: 'person',
                    data: {
                        image: '/images/team/nestor.png',
                        name: 'Nestor Pérez / 16-7075',
                        title: 'SCRUM MASTER'
                    },
                    children: [
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: '/images/team/bryan.jpg',
                                name: 'Bryan Román / 21-1202',
                                title: 'DEVELOPER'
                            }
                        },
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: '/images/logos/umg.svg',
                                name: 'Andrés Barrera / 22-23723',
                                title: 'Q.A'
                            }
                        },
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: '/images/team/henry.png',
                                name: 'Henry Escorcia / 21-5510',
                                title: 'DEVELOPER'
                            }
                        }
                    ]
                }
            ]
        }
    ]);

    const nodeTemplate = (node: TreeNode) => {
        if (node.type === 'person') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <img alt={node.data.name} src={node.data.image} className="mb-3 w-3rem h-3rem" />
                        <span className="font-bold mb-2">{node.data.name}</span>
                        <span>{node.data.title}</span>
                    </div>
                </div>
            );
        }
        return node.label;
    };

    useEffect(() => {
        getTotales();
    }, []);

    return (
        <>
            <div className="card">
                {/* <h3>Dashboard</h3> */}

                <div className="grid">
                    <t.Tarjeta column={4} title="Departamentos" total={totales.totalDepartamentos} activos={totales.totalDepartamentosActivos} inactivos={totales.totalDepartamentosInactivos} color1="green" color2="red" icon={"pi pi-fw pi-clone text-blue-500"} />

                    <t.Tarjeta column={4} title="Puestos" total={totales.totalAreas} activos={totales.totalAreasActivas} inactivos={totales.totalAreasInactivas} color1="green" color2="red" icon={"pi pi-fw pi-table text-orange-500 "} />

                    <t.Tarjeta column={4} title="Empleados" total={totales.totalEmpleados} activos={totales.totalEmpleadosActivos} inactivos={totales.totalEmpleadosInactivos} color1="green" color2="red" icon={"pi pi-fw pi-user text-cyan-500"} />

                    {/* <t.Tarjeta column={12} title="Nóminas" total={totales.totalNomina} activos={totales.totalNominasMes} inactivos={200} color1="green" color2="red" icon={"pi pi-inbox text-purple-500"} /> */}
                </div>

                <div className="grid">
                    <div className="col-12">
                        <div className="card">
                            <div className="grid">
                                <div className="col-4 align-content-center">
                                    <img src='/images/logos/umg.svg' height={'60px'} alt="umg logo" />
                                </div>
                                <div className='col-4 align-content-center'>
                                    <h5 className='font-bold text-center'>PROYECTO SISTEMA CONTABLE</h5>
                                </div>
                                <div className='col-4 align-content-center'>
                                    <h5 className='font-italic font-normal text-right'>Grupo #3</h5>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <OrganizationChart value={data} selectionMode="single" selection={selection} onSelectionChange={(e) => setSelection(e.data)} nodeTemplate={nodeTemplate} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;