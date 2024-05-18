import { Menu } from 'primereact/menu';
import { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';


const DashboardPage = () => {
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    return (
        <>
            <div className="card">
                <h3>Dashboard</h3>

                {/* <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">.</span>
                                    <div className="text-900 font-medium text-xl">.</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">. </span>
                            <span className="text-500">.</span>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">.</span>
                                    <div className="text-900 font-medium text-xl">.</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-map-marker text-orange-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">. </span>
                            <span className="text-500">.</span>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">.</span>
                                    <div className="text-900 font-medium text-xl">.</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-inbox text-cyan-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">. </span>
                            <span className="text-500">.</span>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">.</span>
                                    <div className="text-900 font-medium text-xl">.</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-comment text-purple-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">. </span>
                            <span className="text-500">.</span>
                        </div>
                    </div>

                    <div className="col-12 xl:col-6">
                        <div className="card">
                            <h5>Espacio 1</h5>

                        </div>
                        <div className="card">
                            <div className="flex justify-content-between align-items-center mb-5">
                                <h5>Espacio 3</h5>

                            </div>

                        </div>
                    </div>

                    <div className="col-12 xl:col-6">
                        <div className="card">
                            <h5>Espacio 2</h5>
                        </div>

                        <div className="card">
                            <div className="flex align-items-center justify-content-between mb-4">
                                <h5>Espacio 4</h5>

                            </div>


                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default DashboardPage;